package services

import (
	"fmt"
	"project_backend/internal/models"
	"project_backend/internal/repositories"
	"project_backend/pkg"
)

func GetAllWorkers() ([]models.Worker, error) {
	return repositories.GetAllWorkers()
}

func GetWorkerByID(id uint) (*models.Worker, error) {
	return repositories.GetWorkerByID(id)
}

func CreateWorker(worker *models.Worker) (*models.Worker, error) {

	if err := worker.Validate(); err != nil {
		return nil, fmt.Errorf("ошибка валидации: %w", err)
	}

	prevPassw := worker.Password

	prevPassw, err := pkg.HashPassword(prevPassw)
	if err != nil {
		return nil, err
	}
	worker.Password = prevPassw

	return repositories.CreateWorker(worker)
}

func UpdateWorker(worker *models.Worker) (*models.Worker, error) {
	if err := worker.Validate(); err != nil {
		return nil, fmt.Errorf("ошибка валидации: %w", err)
	}

	return repositories.UpdateWorker(worker)
}

func DeleteWorker(id uint) error {
	return repositories.DeleteWorker(id)
}
