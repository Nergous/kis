package controllers

import (
	"net/http"
	"project_backend/internal/models"
	"project_backend/internal/services"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetAllCustomers(c *gin.Context) {
	customers, err := services.GetAllCustomers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить список клиентов",
		})
		return
	}
	c.JSON(http.StatusOK, customers)
}

func GetCustomerByID(c *gin.Context) {
	id := c.Param("id")
	customerID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}
	customer, err := services.GetCustomerByID(uint(customerID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить клиента",
		})
	}

	c.JSON(http.StatusOK, customer)
}

func GetCustomerForLK(c *gin.Context) {
	customer_id, exists := c.Get("customer_id")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить клиента",
		})
	}
	customer, err := services.GetCustomerByID(uint(customer_id.(uint)))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить клиента",
		})
	}
	c.JSON(http.StatusOK, customer)

}

func CreateCustomer(c *gin.Context) {
	var customerIn models.Customer
	if err := c.ShouldBindJSON(&customerIn); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат клиента: " + err.Error(),
		})
		return
	}
	_, err := services.CreateCustomer(&customerIn)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось создать клиента" + err.Error(),
		})
		return
	}
	c.JSON(http.StatusCreated, "Клиент успешно создан")
}

func UpdateCustomer(c *gin.Context) {

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

	updatedCustomerOut, err := services.UpdateCustomer(&updatedCustomerIn)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось обновить клиента",
		})
		return
	}
	c.JSON(http.StatusOK, updatedCustomerOut)
}

func DeleteCustomer(c *gin.Context) {
	id := c.Param("id")
	customerID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}

	err = services.DeleteCustomer(uint(customerID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось удалить клиента",
		})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}
