package controllers

import (
	"net/http"
	"project_backend/internal/services"

	"github.com/gin-gonic/gin"
)

func GetOrdersCountByStatus(c *gin.Context) {
	var request struct {
		Status string `json:"status" binding:"required,min=1"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный формат запроса"})
		return
	}

	count := services.GetOrdersCountByStatus(request.Status)
	c.JSON(http.StatusOK, gin.H{"count": count})
}

func GetWorkersCount(c *gin.Context) {
	count := services.GetWorkersCount()
	c.JSON(http.StatusOK, gin.H{"count": count})
}

func GetCustomersCount(c *gin.Context) {
	count := services.GetCustomersCount()
	c.JSON(http.StatusOK, gin.H{"count": count})
}
