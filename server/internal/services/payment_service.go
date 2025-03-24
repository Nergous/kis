package services

import (
	"net/http"
	"project_backend/internal/models"
	"project_backend/internal/repositories"
	"strconv"

	"github.com/gin-gonic/gin"
)

type PaymentService struct {
	repo *repositories.PaymentRepository
}

func NewPaymentService(repo *repositories.PaymentRepository) *PaymentService {
	return &PaymentService{repo: repo}
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

func (s *PaymentService) Create(c *gin.Context) {
	var payment models.Payment
	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{})
	}

	paymentOut, err := s.repo.Create(&payment)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось создать платеж",
		})
		return
	}

	c.JSON(http.StatusCreated, paymentOut)
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
