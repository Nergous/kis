package repositories

import (
	"project_backend/config"
	"project_backend/internal/models"
)

func GetOrdersCountByStatus(status string) int64 {
	var count int64
	config.DB.Model(&models.Order{}).Where("status = ?", status).Count(&count)
	return count
}

func GetWorkersCount() int64 {
	var count int64
	config.DB.Model(&models.Worker{}).Count(&count)
	return count
}

func GetCustomersCount() int64 {
	var count int64
	config.DB.Model(&models.Customer{}).Count(&count)
	return count
}
