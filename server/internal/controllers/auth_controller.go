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
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный формат запроса"})
		return
	}

	token, workerRole, err := services.LoginWorker(input.Login, input.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ошибка авторизации: " + err.Error()})
		return
	}

	// Возвращаем токен
	c.JSON(http.StatusOK, gin.H{"token": token, "role": workerRole})
}

func LoginCustomer(c *gin.Context) {
	var input struct {
		Email    string `json:"email" binding:"required,min=1"`
		Password string `json:"password" binding:"required,min=1"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный формат запроса"})
		return
	}

	token, err := services.LoginCustomer(input.Email, input.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ошибка авторизации: " + err.Error()})
		return
	}

	// Возвращаем токен
	c.JSON(http.StatusOK, gin.H{"token": token, "role": "customer"})
}

func RegisterCustomer(c *gin.Context) {
	var input struct {
		Surname       string `json:"surname"`
		FirstName     string `json:"first_name"`
		Patronymic    string `json:"patronymic"`
		Name          string `json:"name"`
		Email         string `json:"email" binding:"required,min=1"`
		Password      string `json:"password" binding:"required,min=1"`
		INN           string `json:"inn"`
		MainBooker    string `json:"main_booker"`
		Director      string `json:"director"`
		CustomerType  string `json:"customer_type" binding:"required,oneof=phys juri"`
		BIK           string `json:"bik"`
		PaymentNumber string `json:"payment_number"`
		Bank          string `json:"bank"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Errorf("ошибка при парсинге JSON: %w", err).Error()})
		return
	}

	var customer_type string

	if input.CustomerType == "juri" {
		customer_type = "juri"
	} else if input.CustomerType == "phys" {
		customer_type = "phys"
	}

	var inn *string
	if input.INN != "" {
		inn = &input.INN
	}

	var paymentChar *models.PaymentChar
	if input.BIK != "" && input.PaymentNumber != "" && input.Bank != "" {
		paymentChar = &models.PaymentChar{
			BIK:           input.BIK,
			PaymentNumber: input.PaymentNumber,
			Bank:          input.Bank,
		}
	}

	var customer models.Customer = models.Customer{
		Surname:      input.Surname,
		FirstName:    input.FirstName,
		Patronymic:   input.Patronymic,
		Name:         input.Name,
		Email:        input.Email,
		Password:     input.Password,
		INN:          inn,
		MainBooker:   input.MainBooker,
		Director:     input.Director,
		CustomerType: customer_type,
		PaymentChar:  paymentChar,
	}

	token, err := services.RegisterCustomer(&customer)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Errorf("не удалось зарегистрировать покупателя: %w", err).Error()})
		return
	}

	// Возвращаем токен
	c.JSON(http.StatusOK, gin.H{"token": token, "role": "customer"})
}
