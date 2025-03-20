package services

import "project_backend/internal/repositories"

func GetOrdersCountByStatus(status string) int {
	count := repositories.GetOrdersCountByStatus(status)
	return int(count)
}

func GetWorkersCount() int {
	count := repositories.GetWorkersCount()
	return int(count)
}

func GetCustomersCount() int {
	count := repositories.GetCustomersCount()
	return int(count)
}
