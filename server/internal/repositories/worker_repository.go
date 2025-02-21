package repositories

import (
	"project_backend/config"
	"project_backend/internal/models"
)

func GetAllWorkers() ([]models.Worker, error) {
	var workers []models.Worker
	result := config.DB.Find(&workers)
	if result.Error != nil {
		return nil, result.Error
	}
	return workers, nil
}

func GetWorkerByID(id uint) (*models.Worker, error) {
	var worker models.Worker
	result := config.DB.First(&worker, id)
	if result.Error != nil {
		return &models.Worker{}, result.Error
	}
	return &worker, nil
}

func CreateWorker(worker *models.Worker) (*models.Worker, error) {
	result := config.DB.Create(worker)
	return worker, result.Error
}

func UpdateWorker(worker *models.Worker) (*models.Worker, error) {
	result := config.DB.Save(*worker)
	return worker, result.Error
}

func DeleteWorker(id uint) error {
	worker := models.Worker{}
	result := config.DB.Where("id=?", id).Delete(&worker)
	return result.Error
}

func GetWorkerByLogin(login string) (*models.Worker, error) {
	var worker models.Worker
	result := config.DB.Where("login = ?", login).First(&worker)
	if result.Error != nil {
		return nil, result.Error
	}
	return &worker, nil
}
