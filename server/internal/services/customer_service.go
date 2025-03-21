package services

import (
	"net/http"
	"strconv"

	"project_backend/internal/models"
	"project_backend/internal/repositories"

	"github.com/gin-gonic/gin"
)

type CustomerService struct {
	Repo *repositories.CustomerRepository
}

func NewCustomerService(repo *repositories.CustomerRepository) *CustomerService {
	return &CustomerService{Repo: repo}
}

// GetAllCustomers обрабатывает запрос на получение всех клиентов
func (s *CustomerService) GetAll(c *gin.Context) {
	customers, err := s.Repo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить список клиентов",
		})
		return
	}
	c.JSON(http.StatusOK, customers)
}

// GetCustomerByID обрабатывает запрос на получение клиента по ID
func (s *CustomerService) GetByID(c *gin.Context) {
	id := c.Param("id")
	customerID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}

	customer, err := s.Repo.GetByID(uint(customerID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить клиента",
		})
		return
	}
	c.JSON(http.StatusOK, customer)
}

// GetCustomerForLK обрабатывает запрос на получение клиента для личного кабинета
func (s *CustomerService) GetForLK(c *gin.Context) {
	customerID, exists := c.Get("customer_id")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить клиента",
		})
		return
	}

	customer, err := s.Repo.GetByID(uint(customerID.(uint)))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить клиента",
		})
		return
	}
	c.JSON(http.StatusOK, customer)
}

// CreateCustomer обрабатывает запрос на создание клиента
func (s *CustomerService) Create(c *gin.Context) {
	var customerIn models.Customer
	if err := c.ShouldBindJSON(&customerIn); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат клиента: " + err.Error(),
		})
		return
	}

	_, err := s.Repo.Create(&customerIn)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось создать клиента: " + err.Error(),
		})
		return
	}
	c.JSON(http.StatusCreated, "Клиент успешно создан")
}

// UpdateCustomer обрабатывает запрос на обновление клиента
func (s *CustomerService) Update(c *gin.Context) {
	var updatedCustomerIn models.Customer
	if err := c.ShouldBindJSON(&updatedCustomerIn); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат клиента",
		})
		return
	}

	if updatedCustomerIn.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "ID клиента не указан",
		})
		return
	}

	updatedCustomerOut, err := s.Repo.Update(&updatedCustomerIn)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось обновить клиента",
		})
		return
	}
	c.JSON(http.StatusOK, updatedCustomerOut)
}

// DeleteCustomer обрабатывает запрос на удаление клиента
func (s *CustomerService) Delete(c *gin.Context) {
	id := c.Param("id")
	customerID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}

	err = s.Repo.Delete(uint(customerID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось удалить клиента",
		})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}
