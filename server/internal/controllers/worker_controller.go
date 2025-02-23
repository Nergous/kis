package controllers

import (
	"net/http"
	"project_backend/internal/models"
	"project_backend/internal/services"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetAllWorkers(c *gin.Context) {
	workers, err := services.GetAllWorkers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить все продукты",
		})
		return
	}
	c.JSON(http.StatusOK, workers)
}

func GetWorkerByID(c *gin.Context) {
	id := c.Param("id")
	workerID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}
	worker, err := services.GetWorkerByID(uint(workerID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Работник не найден",
		})
		return
	}
	c.JSON(http.StatusOK, worker)
}

// CreateWorker создает нового работника
func CreateWorker(c *gin.Context) {
	var workerIn models.Worker
	if err := c.ShouldBindJSON(&workerIn); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат работника: " + err.Error(),
		})
		return
	}
	_, err := services.CreateWorker(&workerIn)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось создать работника",
		})
		return
	}
	c.JSON(http.StatusCreated, "Работник успешно создан")
}

func UpdateWorker(c *gin.Context) {

	var updatedWorkerIn models.Worker
	if err := c.ShouldBindJSON(&updatedWorkerIn); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	if updatedWorkerIn.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "ID работника не указан",
		})
		return
	}

	updatedWorkerOut, err := services.UpdateWorker(&updatedWorkerIn)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось обновить работника",
		})
		return
	}
	c.JSON(http.StatusOK, updatedWorkerOut)
}

func DeleteWorker(c *gin.Context) {
	id := c.Param("id")
	workerID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}

	err = services.DeleteWorker(uint(workerID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось удалить работника",
		})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}
