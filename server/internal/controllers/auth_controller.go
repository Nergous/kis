package controllers

import (
	"fmt"
	"net/http"

	"project_backend/internal/models"
	"project_backend/internal/services"

	"github.com/gin-gonic/gin"
)

// Login обрабатывает запрос на вход
func LoginWorker(c *gin.Context) {
	var input struct {
		Login    string `json:"login" binding:"required,min=1"`
		Password string `json:"password" binding:"required,min=1"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, err := services.LoginWorker(input.Login, input.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// Возвращаем токен
	c.JSON(http.StatusOK, gin.H{"token": token, "role": "admin"})
}

func RegisterCustomer(c *gin.Context) {
	var input struct {
		Name          string `json:"name" binding:"required,min=1"`
		Email         string `json:"email" binding:"required,min=1"`
		Password      string `json:"password" binding:"required,min=1"`
		INN           string `json:"inn" binding:"required,min=1"`
		MainBooker    string `json:"main_booker" binding:"required,min=1"`
		Director      string `json:"director" binding:"required,min=1"`
		BIK           string `json:"bik" binding:"required,min=1"`
		PaymentNumber string `json:"payment_number" binding:"required,min=1"`
		Bank          string `json:"bank" binding:"required,min=1"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Errorf("ошибка при парсинге JSON: %w", err).Error()})
		return
	}
	var customer models.Customer = models.Customer{
		Name:       input.Name,
		Email:      input.Email,
		Password:   input.Password,
		INN:        input.INN,
		MainBooker: input.MainBooker,
		Director:   input.Director,
		PaymentChar: models.PaymentChar{
			BIK:           input.BIK,
			PaymentNumber: input.PaymentNumber,
			Bank:          input.Bank,
		},
	}

	token, err := services.RegisterCustomer(&customer)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": fmt.Errorf("не удалось зарегистрировать покупателя: %w", err).Error()})
		return
	}

	// Возвращаем токен
	c.JSON(http.StatusOK, gin.H{"token": token, "role": "customer"})
}
