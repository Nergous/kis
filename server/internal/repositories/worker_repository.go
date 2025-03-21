package repositories

import (
	"project_backend/internal/models"

	"gorm.io/gorm"
)

type WorkerRepository struct {
	db *gorm.DB
}

func NewWorkerRepository(db *gorm.DB) *WorkerRepository {
	return &WorkerRepository{db: db}
}

func (r *WorkerRepository) GetAll() ([]models.Worker, error) {
	var workers []models.Worker
	result := r.db.Find(&workers)
	if result.Error != nil {
		return nil, result.Error
	}
	return workers, nil
}

func (r *WorkerRepository) GetByID(id uint) (*models.Worker, error) {
	var worker models.Worker
	result := r.db.First(&worker, id)
	if result.Error != nil {
		return &models.Worker{}, result.Error
	}
	return &worker, nil
}

func (r *WorkerRepository) Create(worker *models.Worker) (*models.Worker, error) {
	result := r.db.Create(worker)
	return worker, result.Error
}

func (r *WorkerRepository) Update(worker *models.Worker) (*models.Worker, error) {
	result := r.db.Save(*worker)
	return worker, result.Error
}

func (r *WorkerRepository) Delete(id uint) error {
	worker := models.Worker{}
	result := r.db.Where("id=?", id).Delete(&worker)
	return result.Error
}

func (r *WorkerRepository) GetByLogin(login string) (*models.Worker, error) {
	var worker models.Worker
	result := r.db.Where("login = ?", login).First(&worker)
	if result.Error != nil {
		return nil, result.Error
	}
	return &worker, nil
}
