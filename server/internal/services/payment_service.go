package services

import (
	"fmt"
	"net/http"
	"project_backend/internal/models"
	"project_backend/internal/repositories"
	"project_backend/internal/utils"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type PaymentService struct {
	repo              *repositories.PaymentRepository
	orders            *repositories.OrderRepository
	contracts         *repositories.ContractRepository
	contract_quantity *repositories.ContractQuantityRepository
	customers         *repositories.CustomerRepository
}

func NewPaymentService(
	repo *repositories.PaymentRepository,
	orders *repositories.OrderRepository,
	contracts *repositories.ContractRepository,
	contract_quantity *repositories.ContractQuantityRepository,
	customers *repositories.CustomerRepository,
) *PaymentService {
	return &PaymentService{
		repo:              repo,
		orders:            orders,
		contracts:         contracts,
		contract_quantity: contract_quantity,
		customers:         customers,
	}
}

func (s *PaymentService) GetAll(c *gin.Context) {
	duration := c.Query("duration")

	payments, err := s.repo.GetAll(duration)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить список платежей",
		})
		return
	}

	c.JSON(http.StatusOK, payments)
}

func (s *PaymentService) GetByID(c *gin.Context) {
	id := c.Param("id")
	paymentID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
	}

	payment, err := s.repo.GetByID(uint(paymentID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Платеж не найден",
		})
		return
	}

	c.JSON(http.StatusOK, payment)
}

func (s *PaymentService) GetByOrderID(c *gin.Context) {
	id := c.Param("order_id")
	orderID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
	}

	payment, err := s.repo.GetByOrderID(uint(orderID))
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"error": "Платеж не найден",
		})
		return
	}

	c.JSON(http.StatusOK, payment)
}

func (s *PaymentService) Create(c *gin.Context) {
	var payment models.Payment
	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{})
		return
	}

	order, err := s.orders.GetByID(payment.OrderID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить данные заказа: " + err.Error(),
		})
		return
	}

	customer, err := s.customers.GetByID(order.CustomerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить данные покупателя: " + err.Error(),
		})
		return
	}

	paymentOut, err := s.repo.Create(&payment)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось создать платеж: " + err.Error(),
		})
		return
	}

	payments, err := s.repo.GetByOrderID(payment.OrderID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить информацию о платежах: " + err.Error(),
		})
		return
	}

	var totalPaid float64
	for _, p := range *payments {
		totalPaid += p.PaymentSum
	}

	fmt.Println("totalPaid", totalPaid)
	fmt.Println("totalPrice", order.TotalPrice)

	if totalPaid >= order.TotalPrice {
		// Если заказ был в статусе долга
		if order.DebtStatus == "debt" || order.DebtStatus == "not_paid" || order.DebtStatus == "partial" {
			// Обновляем статус заказа
			order.DebtStatus = "paid"
			if err := s.orders.UpdateDebtStatus(order.ID, "paid"); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "Платеж создан, но не удалось обновить статус заказа: " + err.Error(),
				})
				return
			}

			hasOtherDebts, err := s.hasCustomerOtherDebts(order.CustomerID, order.ID)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "Платеж создан, но не удалось проверить другие долги: " + err.Error(),
				})
				return
			}

			// Если других долгов нет, снимаем статус должника
			if !hasOtherDebts && customer.Status == "debt" {
				customer.Status = "active"
				if _, err := s.customers.Update(customer); err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{
						"error": "Платеж создан, но не удалось обновить статус покупателя: " + err.Error(),
					})
					return
				}
			}
		}

		// Обновляем время оплаты заказа, если это первый платеж
		if order.PaymentTime == nil {
			now := time.Now()
			order.PaymentTime = &now
			if err := s.orders.Update(order); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "Платеж создан, но не удалось обновить время оплаты заказа: " + err.Error(),
				})
				return
			}
		}
	}

	// Генерируем чек
	receiptData := utils.ReceiptData{
		OrderID:      fmt.Sprintf("%d", order.ID),
		Customer:     order.Customer,
		PaymentTime:  paymentOut.CreatedAt.Format(time.RFC3339),
		Amount:       payment.PaymentSum,
		PaymentTerms: order.PaymentTerms,
		TotalPrice:   order.TotalPrice,
		OrderContent: order.OrderContent,
	}

	receiptPath, err := utils.GenerateReceipt(receiptData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Платеж создан, но не удалось сгенерировать чек: " + err.Error(),
		})
		return
	}

	var contractModel models.Contract = models.Contract{
		OrderID:      order.ID,
		FilePath:     receiptPath,
		ContractType: "receipt",
	}

	_, err = s.contracts.Create(&contractModel)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Платеж создан, но не удалось создать запись о получении чека: " + err.Error(),
		})
		return
	}

	_, err = s.contract_quantity.Create("receipt")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Платеж создан, но не удалось создать количество контрактов: " + err.Error(),
		})
		return
	}
	c.JSON(http.StatusCreated, paymentOut)
}

func (s *PaymentService) hasCustomerOtherDebts(customerID uint, currentOrderID uint) (bool, error) {
	// Получаем все заказы покупателя со статусом "debt", кроме текущего
	orders, err := s.orders.GetDebtOrdersByCustomerID(customerID)
	if err != nil {
		return false, err
	}

	for _, order := range orders {
		if order.ID != currentOrderID && order.DebtStatus == "debt" {
			// Получаем платежи по заказу
			payments, err := s.repo.GetByOrderID(order.ID)
			if err != nil {
				return false, err
			}

			// Считаем сумму платежей
			var totalPaid float64
			for _, p := range *payments {
				totalPaid += p.PaymentSum
			}

			// Если заказ не оплачен полностью
			if totalPaid < order.TotalPrice {
				return true, nil
			}
		}
	}

	return false, nil
}

func (s *PaymentService) Update(c *gin.Context) {
	var payment models.Payment
	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат запроса",
		})
	}

	paymentOut, err := s.repo.Update(&payment)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось обновить платеж",
		})
		return
	}

	c.JSON(http.StatusOK, paymentOut)
}

func (s *PaymentService) Delete(c *gin.Context) {
	id := c.Param("id")
	paymentID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}

	err = s.repo.Delete(uint(paymentID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось удалить платеж",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Платеж успешно удален",
	})
}
