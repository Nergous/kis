package controllers

import (
	"net/http"
	"project_backend/internal/services"

	"github.com/gin-gonic/gin"
)

func GetOrdersCountByStatus(c *gin.Context) {
	status := c.Query("status")

	count := services.GetOrdersCountByStatus(status)
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
