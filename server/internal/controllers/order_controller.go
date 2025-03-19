package controllers

import (
	"fmt"
	"net/http"
	"project_backend/config"
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

func GetAllOrdersInAssembly(c *gin.Context) {
	orders, err := services.GetAllOrdersInAssembly()
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

func GetOrderByCustomer(c *gin.Context) {
	// Извлекаем customer_id из контекста
	customerID, exists := c.Get("customer_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Не удалось идентифицировать покупателя",
		})
		return
	}

	// Преобразуем customerID в uint
	customerIDUint, ok := customerID.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Ошибка сервера: неверный формат customer_id",
		})
		return
	}

	// Получаем заказы по ID покупателя
	orders, err := services.GetOrdersByCustomerID(customerIDUint)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Заказы не найдены",
		})
		return
	}

	// Возвращаем заказы
	c.JSON(http.StatusOK, orders)
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

	// customerID, exists := c.Get("customer_id")
	// if !exists {
	// 	c.JSON(http.StatusBadRequest, gin.H{
	// 		"error": "Отсутствует ID клиента",
	// 	})
	// 	return
	// }
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

	var pay_time *time.Time


	orderIn := models.Order{
		Address:      input.Address,
		DeliveryDate: input.DeliveryDate,
		PaymentTerms: input.PaymentTerms,
		TotalPrice:   input.TotalPrice,
		PaymentTime:  pay_time,
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
	id := c.Param("id")
	orderID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID: " + err.Error(),
		})
		return
	}

	var input struct {
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
	err = services.UpdateOrderPrices(uint(orderID), productsToUpdate, input.TotalOrderPrice)
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
	orderIDStr := c.Param("id")
	orderID, err := strconv.ParseUint(orderIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID: " + err.Error(),
		})
		return
	}

	var input struct {
		Status string `json:"status" binding:"required,oneof=in_processing awaiting_payment in_assembly awaiting_shipment in_transit received"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат запроса: " + err.Error(),
		})
		return
	}

	// Получаем заказ с его содержимым (товарами)
	var order models.Order
	result := config.DB.Preload("OrderContent.Product").First(&order, orderID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Заказ не найден: " + result.Error.Error(),
		})
		return
	}

	// Если новый статус - awaiting_shipment, вычитаем товары со склада
	if input.Status == "awaiting_shipment" {
		// Проверяем, достаточно ли товаров на складе
		for _, content := range order.OrderContent {
			product := content.Product
			if product.Quantity < content.Quantity {
				c.JSON(http.StatusBadRequest, gin.H{
					"error": fmt.Sprintf("Недостаточно товара на складе: %s (доступно: %d, требуется: %d)", product.Name, product.Quantity, content.Quantity),
				})
				return
			}
		}

		// Вычитаем товары со склада
		for _, content := range order.OrderContent {
			product := content.Product
			product.Quantity -= content.Quantity
			if err := config.DB.Save(&product).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "Не удалось обновить количество товара на складе: " + err.Error(),
				})
				return
			}
		}
	}

	// Обновляем статус заказа
	err = services.UpdateOrderStatus(uint(orderID), input.Status)
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
