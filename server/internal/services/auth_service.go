package services

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"project_backend/internal/models"
	"project_backend/internal/repositories"
	"project_backend/pkg"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET")) // Замените на ваш секретный ключ

type AuthService struct {
	customer *repositories.CustomerRepository
	worker   *repositories.WorkerRepository
}

func NewAuthService(customer *repositories.CustomerRepository, worker *repositories.WorkerRepository) *AuthService {
	return &AuthService{customer: customer, worker: worker}
}

func (s *AuthService) LoginWorker(c *gin.Context) {

	var input struct {
		Login    string `json:"login" binding:"required,min=1"`
		Password string `json:"password" binding:"required,min=1"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный формат запроса"})
		return
	}

	worker, err := s.worker.GetByLogin(input.Login)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неправильный логин или пароль"})
		return
	}

	if err := pkg.CheckPasswordHash(input.Password, worker.Password); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неправильный логин или пароль"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":   worker.ID,
		"role": worker.Role,
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
	})

	// Подписываем токен
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при создании токена"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenString, "role": worker.Role})
}

func (s *AuthService) LoginCustomer(c *gin.Context) {
	var input struct {
		Email    string `json:"email" binding:"required,min=1"`
		Password string `json:"password" binding:"required,min=1"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный формат запроса"})
		return
	}

	customer, err := s.customer.GetByEmail(input.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неправильный логин или пароль"})
		return
	}

	if err := pkg.CheckPasswordHash(input.Password, customer.Password); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неправильный логин или пароль"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":   customer.ID,
		"role": "customer",
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
	})

	// Подписываем токен
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при создании токена"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenString, "role": "customer"})
}

func (s *AuthService) RegisterCustomer(c *gin.Context) {
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

	passw, err := pkg.HashPassword(customer.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ошибка при хэшировании пароля: " + err.Error()})
		return
	}
	// customerIn.PaymentCharID = paymentOut.ID
	customer.Password = passw
	customerOut, err := s.customer.Create(&customer)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ошибка при создании пользователя: " + err.Error()})
		return
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":   customerOut.ID,
		"role": "customer",
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ошибка при создании токена: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": tokenString, "role": "customer"})
}
