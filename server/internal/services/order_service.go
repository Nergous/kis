package services

import (
	"fmt"
	"log"
	"net/http"
	"project_backend/internal/models"
	"project_backend/internal/repositories"
	"project_backend/internal/utils"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type OrderService struct {
	repo             *repositories.OrderRepository
	product          *repositories.ProductRepository
	move             *repositories.ProductMovingRepository
	contract         *repositories.ContractRepository
	contractQuantity *repositories.ContractQuantityRepository
	customerRepo     *repositories.CustomerRepository
	paymentRepo      *repositories.PaymentRepository
}

func NewOrderService(
	repo *repositories.OrderRepository,
	product *repositories.ProductRepository,
	contract *repositories.ContractRepository,
	contractQuantity *repositories.ContractQuantityRepository,
	move *repositories.ProductMovingRepository,
	customerRepo *repositories.CustomerRepository,
	paymentRepo *repositories.PaymentRepository,
) *OrderService {
	return &OrderService{
		repo:             repo,
		product:          product,
		move:             move,
		contract:         contract,
		contractQuantity: contractQuantity,
		customerRepo:     customerRepo,
		paymentRepo:      paymentRepo,
	}
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

	customer, err := s.customerRepo.GetByID(customerID.(uint))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Клиент не найден",
		})
		return
	}

	if customer.Status == "debt" {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "Покупатель имеет неоплаченные заказы. Новые заказы невозможны до погашения долга",
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

	var products []utils.OrderContent
	for _, item := range orderIn.OrderContent {
		product, err := s.product.GetByID(item.ProductID)
		if err != nil {
			continue // или обработка ошибки
		}
		products = append(products, utils.OrderContent{
			ProductID:   item.ProductID,
			ProductName: product.Name, // предполагая, что у продукта есть поле Name
			Quantity:    item.Quantity,
			Price:       item.Price,
		})
	}

	contractData := utils.ContractData{
		Address:        orderIn.Address,
		DeliveryDate:   orderIn.DeliveryDate.Format(time.RFC3339),
		PaymentTerms:   orderIn.PaymentTerms,
		TotalPrice:     orderIn.TotalPrice,
		RecipientPhone: orderIn.RecipientPhone,
		OrderContent:   products,
	}

	// Generate contract
	contractPath, err := utils.GenerateContract(contractData)

	if err != nil {
		log.Printf("Failed to generate contract: %v", err)
		// Можно продолжить, даже если контракт не сгенерировался
	} else {
		log.Printf("Contract generated at: %s", contractPath)
		// Можно сохранить contractPath в базе данных для заказа
	}

	var contractModel models.Contract = models.Contract{
		OrderID:      orderOut.ID,
		FilePath:     contractPath,
		ContractType: "order",
	}
	_, err = s.contract.Create(&contractModel)

	if err != nil {
		log.Printf("Failed to create contract: %#v", err)
	}

	_, err = s.contractQuantity.Create("order")

	if err != nil {
		log.Printf("Failed to create contract quantity: %v", err)
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
	order, err = s.repo.GetByID(uint(orderID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Заказ не найден",
		})
	}

	var products []utils.OrderContent
	for _, item := range order.OrderContent {
		product, err := s.product.GetByID(item.ProductID)
		if err != nil {
			continue // или обработка ошибки
		}
		products = append(products, utils.OrderContent{
			ProductID:   item.ProductID,
			ProductName: product.Name, // предполагая, что у продукта есть поле Name
			Quantity:    item.Quantity,
			Price:       item.Price,
		})
	}

	contractData := utils.ContractData{
		Address:        order.Address,
		DeliveryDate:   order.DeliveryDate.Format(time.RFC3339),
		PaymentTerms:   order.PaymentTerms,
		TotalPrice:     order.TotalPrice,
		RecipientPhone: order.RecipientPhone,
		OrderContent:   products,
	}

	// Generate contract
	contractPath, err := utils.GenerateContract(contractData)

	if err != nil {
		log.Printf("Failed to generate contract: %v", err)
		// Можно продолжить, даже если контракт не сгенерировался
	} else {
		log.Printf("Contract generated at: %s", contractPath)
		// Можно сохранить contractPath в базе данных для заказа
	}

	var contractModel models.Contract = models.Contract{
		OrderID:      order.ID,
		FilePath:     contractPath,
		ContractType: "order",
	}

	err = s.contract.Delete(order.ID, "order")
	if err != nil {
		log.Printf("Failed to delete old contract: %#v", err)
	}
	_, err = s.contract.Create(&contractModel)

	if err != nil {
		log.Printf("Failed to create contract: %#v", err)
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
		Status  string `json:"status" binding:"required,oneof=in_processing awaiting_payment in_assembly awaiting_shipment in_transit received contacting"`
		Comment string `json:"comment"`
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
		return
	}

	if input.Status == "in_transit" && order.Status != "in_transit" {
		now := time.Now()
		order.SentDate = &now
	}

	// Генерация накладной при переходе в статус in_assembly
	if input.Status == "in_assembly" && order.Status != "in_assembly" {
		var products []utils.OrderContent
		fmt.Println("------------------------------")
		fmt.Println("ВОЙНА НАЧИНАЕТСЯ")
		fmt.Println("------------------------------")
		for _, item := range order.OrderContent {
			product, err := s.product.GetByID(item.ProductID)
			if err != nil {
				log.Printf("Failed to get product for invoice: %v", err)
				continue
			}
			products = append(products, utils.OrderContent{
				ProductID:         item.ProductID,
				ProductName:       product.Name,
				Quantity:          item.Quantity,
				Price:             item.Price,
				TotalProductPrice: item.Price * float64(item.Quantity),
			})
		}

		invoiceData := utils.InvoiceData{
			OrderID:        strconv.FormatUint(uint64(order.ID), 10),
			Address:        order.Address,
			DeliveryDate:   order.DeliveryDate.UTC().Format("2006-01-02T15:04:05Z"),
			RecipientPhone: order.RecipientPhone,
			TotalPrice:     order.TotalPrice,
			OrderContent:   products,
		}
		fmt.Println("------------------------------")
		fmt.Println("ГЕНЕРИМ ДОКУМЕНТ")
		fmt.Println("------------------------------")
		invoicePath, err := utils.GenerateInvoice(invoiceData)
		if err != nil {
			log.Printf("Failed to generate invoice: %v", err)
		} else {
			log.Printf("Invoice generated at: %s", invoicePath)

			// Сохраняем информацию о накладной в базу данных
			invoiceModel := models.Contract{
				OrderID:      order.ID,
				FilePath:     invoicePath,
				ContractType: "invoice",
			}
			fmt.Println("------------------------------")
			fmt.Println("ДОБАВЛЯЕМ В БД")
			fmt.Println("------------------------------")
			if _, err := s.contract.Create(&invoiceModel); err != nil {
				log.Printf("Failed to save invoice to database: %v", err)
			}
			fmt.Println("------------------------------")
			fmt.Println("ОБНОВЛЯЕМ КОЛИЧЕСТВО")
			fmt.Println("------------------------------")
			if _, err := s.contractQuantity.Create("invoice"); err != nil {
				log.Printf("Failed to save invoice quantity to database: %v", err)
			}
		}
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
			if _, err := s.product.Update(&product); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "Не удалось обновить количество товара на складе: " + err.Error(),
				})
				return
			}

			if _, err = s.move.Create(&models.ProductMoving{
				MovingType: "out",
				ProductID:  product.ID,
				Count:      uint(content.Quantity),
			}); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "Не удалось создать перемещение товара: " + err.Error(),
				})
			}
		}
	}

	if input.Status == "received" && order.Status != "received" {
		var products []utils.OrderContent
		for _, item := range order.OrderContent {
			product, err := s.product.GetByID(item.ProductID)
			if err != nil {
				log.Printf("Failed to get product for acceptance act: %v", err)
				continue
			}
			products = append(products, utils.OrderContent{
				ProductID:         item.ProductID,
				ProductName:       product.Name,
				Quantity:          item.Quantity,
				Price:             item.Price,
				TotalProductPrice: item.TotalProductPrice,
			})
		}

		actData := utils.AcceptanceActData{
			OrderID:        strconv.FormatUint(uint64(order.ID), 10),
			Customer:       order.Customer,
			Address:        order.Address,
			DeliveryDate:   order.DeliveryDate.UTC().Format("2006-01-02T15:04:05Z"),
			RecipientPhone: order.RecipientPhone,
			PaymentTerms:   order.PaymentTerms,
			TotalPrice:     order.TotalPrice,
			OrderContent:   products,
			AcceptanceDate: time.Now().UTC().Format("2006-01-02T15:04:05Z"),
		}

		actPath, err := utils.GenerateAcceptanceAct(actData)
		if err != nil {
			log.Printf("Failed to generate acceptance act: %v", err)
		} else {
			log.Printf("Acceptance act generated at: %s", actPath)

			// Сохраняем информацию об акте в базу данных
			actModel := models.Contract{
				OrderID:      order.ID,
				FilePath:     actPath,
				ContractType: "acceptance",
			}
			if _, err := s.contract.Create(&actModel); err != nil {
				log.Printf("Failed to save acceptance act to database: %v", err)
			}
		}
		if _, err := s.contractQuantity.Create("acceptance"); err != nil {
			log.Printf("Failed to save invoice quantity to database: %v", err)
		}
	}

	// Обновляем статус заказа
	order.Status = input.Status
	order.Comment = input.Comment
	if err = s.repo.Update(order); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось обновить статус заказа: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Статус успешно обновлен",
	})
}

func (s *OrderService) CheckCustomerDebt(customerID uint) (bool, error) {
	debtOrders, err := s.repo.GetDebtOrdersByCustomerID(customerID)
	if err != nil {
		return false, err
	}

	return len(debtOrders) > 0, nil
}
