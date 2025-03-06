package controllers

import (
	"net/http"
	"project_backend/internal/models"
	"project_backend/internal/services"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func GetAllOrders(c *gin.Context) {
	orders, err := services.GetAllOrders()
	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить все заказы",
		})
		return
	}
	c.JSON(http.StatusOK, orders)
}

func GetOrderByID(c *gin.Context) {
	id := c.Param("id")
	orderID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}
	order, err := services.GetOrderByID(uint(orderID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Заказ не найден",
		})
		return
	}
	c.JSON(http.StatusOK, order)
}

func CreateOrder(c *gin.Context) {

	var input struct {
		Address      string    `json:"address" binding:"required"`
		DeliveryDate time.Time `json:"delivery_date" binding:"required"`
		PaymentTerms string    `json:"payment_terms" binding:"required,oneof=prepayment postpayment full_payment"`
		TotalPrice   float64   `json:"total_price"`
		OrderContent []struct {
			ProductID         uint    `json:"product_id" binding:"required,gte=1"`
			Quantity          int     `json:"quantity" binding:"required,gte=1"`
			Price             float64 `json:"price"`
			TotalProductPrice float64 `json:"total_product_price"`
		} `json:"order_content" binding:"required,dive"`
	}

	customerID, exists := c.Get("customer_id")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Отсутствует ID клиента",
		})
		return
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат заказа" + err.Error(),
		})
		return
	}

	orderIn := models.Order{
		Address:      input.Address,
		DeliveryDate: input.DeliveryDate,
		PaymentTerms: input.PaymentTerms,
		TotalPrice:   input.TotalPrice,
		CustomerID:   customerID.(uint),
	}

	for _, item := range input.OrderContent {
		product, err := services.GetProductByID(item.ProductID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Продукт не найден",
			})
			return
		}

		orderIn.OrderContent = append(orderIn.OrderContent, models.OrderContent{
			ProductID:         item.ProductID,
			Quantity:          item.Quantity,
			Price:             product.Price,
			TotalProductPrice: item.TotalProductPrice,
		})
	}

	orderOut, err := services.CreateOrder(&orderIn)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось создать заказ: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, orderOut.ID)
}

func UpdateOrderPrices(c *gin.Context) {
	var input struct {
		OrderID  uint `json:"order_id" binding:"required"`
		Products []struct {
			ProductID         uint    `json:"product_id" binding:"required,gte=1"`
			Price             float64 `json:"price" binding:"required,gte=0"`
			TotalProductPrice float64 `json:"total_product_price" binding:"required,gte=0"`
		} `json:"products" binding:"required,dive"`
		TotalOrderPrice float64 `json:"total_order_price" binding:"required,gte=0"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат запроса: " + err.Error(),
		})
		return
	}

	orderID := input.OrderID
	// Преобразуем входные данные в структуру для сервиса
	productsToUpdate := make([]models.OrderContentUpdate, len(input.Products))
	for i, product := range input.Products {
		productsToUpdate[i] = models.OrderContentUpdate{
			ProductID:         product.ProductID,
			Price:             product.Price,
			TotalProductPrice: product.TotalProductPrice,
		}
	}

	// Вызываем сервис для обновления цен
	err := services.UpdateOrderPrices(uint(orderID), productsToUpdate, input.TotalOrderPrice)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось обновить цены: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Цены успешно обновлены",
	})
}

func UpdateOrderStatus(c *gin.Context) {
	var input struct {
		OrderID uint   `json:"order_id" binding:"required"`
		Status  string `json:"status" binding:"required,oneof=in_processing awaiting_payment in_assembly awaiting_shipment in_transit received"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат запроса: " + err.Error(),
		})
		return
	}

	// Вызываем сервис для обновления статуса
	err := services.UpdateOrderStatus(input.OrderID, input.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось обновить статус: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Статус успешно обновлен",
	})
}
