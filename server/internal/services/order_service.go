package services

import (
	"fmt"
	"net/http"
	"project_backend/internal/models"
	"project_backend/internal/repositories"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type OrderService struct {
	repo    *repositories.OrderRepository
	product *repositories.ProductRepository
	move    *repositories.ProductMovingRepository
}

func NewOrderService(
	repo *repositories.OrderRepository,
	product *repositories.ProductRepository,
	move *repositories.ProductMovingRepository) *OrderService {
	return &OrderService{repo: repo, product: product, move: move}
}

func (s *OrderService) GetAll(c *gin.Context) {
	orders, err := s.repo.GetAll()
	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить все заказы",
		})
		return
	}
	c.JSON(http.StatusOK, orders)
}

func (s *OrderService) GetAllInAssembly(c *gin.Context) {
	orders, err := s.repo.GetAllInAssembly()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить все заказы",
		})
		return
	}

	c.JSON(http.StatusOK, orders)
}

func (s *OrderService) GetByID(c *gin.Context) {
	id := c.Param("id")
	orderID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}
	order, err := s.repo.GetByID(uint(orderID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Заказ не найден",
		})
		return
	}
	c.JSON(http.StatusOK, order)
}

func (s *OrderService) GetByCustomerID(c *gin.Context) {
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
	orders, err := s.repo.GetByCustomerID(customerIDUint)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Заказы не найдены",
		})
		return
	}

	// Возвращаем заказы
	c.JSON(http.StatusOK, orders)

}

func (s *OrderService) Create(c *gin.Context) {
	var input struct {
		Address        string    `json:"address" binding:"required"`
		DeliveryDate   time.Time `json:"delivery_date" binding:"required"`
		PaymentTerms   string    `json:"payment_terms" binding:"required,oneof=prepayment postpayment full_payment"`
		TotalPrice     float64   `json:"total_price"`
		RecipientPhone string    `json:"recipient_phone" binding:"required,min=1"`
		OrderContent   []struct {
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

	var pay_time *time.Time

	orderIn := models.Order{
		Address:        input.Address,
		DeliveryDate:   input.DeliveryDate,
		PaymentTerms:   input.PaymentTerms,
		TotalPrice:     input.TotalPrice,
		PaymentTime:    pay_time,
		RecipientPhone: input.RecipientPhone,
		CustomerID:     customerID.(uint),
	}

	for _, item := range input.OrderContent {
		// product, err := s.productService.GetByID(item.ProductID)
		product, err := s.product.GetByID(item.ProductID)
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
	if len(orderIn.OrderContent) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Заказ не содержит товаров",
		})
	}
	orderOut, err := s.repo.Create(&orderIn)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось создать заказ: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, orderOut.ID)
}

func (s *OrderService) UpdatePrices(c *gin.Context) {
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
	productsToUpdate := make([]models.OrderContentUpdate, len(input.Products))
	for i, product := range input.Products {
		productsToUpdate[i] = models.OrderContentUpdate{
			ProductID:         product.ProductID,
			Price:             product.Price,
			TotalProductPrice: product.TotalProductPrice,
		}
	}
	// Получаем заказ из базы данных
	order, err := s.repo.GetByID(uint(orderID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Заказ не найден",
		})
	}

	// Проверяем, что все товары из запроса существуют в заказе
	for _, product := range productsToUpdate {
		found := false
		for _, content := range order.OrderContent {
			if content.ProductID == product.ProductID {
				found = true
				break
			}
		}
		if !found {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Товар с ID " + strconv.FormatUint(uint64(product.ProductID), 10) + " не найден в заказе",
			})
			return
		}

	}

	// Обновляем цены в базе данных
	err = s.repo.UpdatePrices(uint(orderID), productsToUpdate, input.TotalOrderPrice)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось обновить цены: " + err.Error(),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Цены успешно обновлены",
	})
}

func (s *OrderService) UpdateStatus(c *gin.Context) {
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
	order, err := s.repo.GetByID(uint(orderID))

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Заказ не найден",
		})
	}

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
			_, err := s.product.Update(&product)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "Не удалось обновить количество товара на складе: " + err.Error(),
				})
				return
			}

			_, err = s.move.Create(&models.ProductMoving{
				MovingType: "out",
				ProductID:  product.ID,
				Count:      uint(content.Quantity),
			})

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "Не удалось создать перемещение товара: " + err.Error(),
				})
			}
		}
	}

	// Обновляем статус заказа
	order.Status = input.Status
	err = s.repo.Update(order)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось обновить статус заказа: " + err.Error(),
		})
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Статус успешно обновлен",
	})
}
