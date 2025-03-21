package repositories

import (
	"project_backend/internal/models"

	"gorm.io/gorm"
)

type PaymentRepository struct {
	db *gorm.DB
}

func NewPaymentRepository(db *gorm.DB) *PaymentRepository {
	return &PaymentRepository{db: db}
}

func (r *PaymentRepository) GetAll() ([]models.Payment, error) {
	var payments []models.Payment
	result := r.db.Find(&payments)
	return payments, result.Error
}

func (r *PaymentRepository) GetByID(id uint) (*models.Payment, error) {
	payment := models.Payment{}
	result := r.db.First(&payment, id)
	return &payment, result.Error
}

func (r *PaymentRepository) Create(payment *models.Payment) (*models.Payment, error) {
	result := r.db.Create(payment)
	return payment, result.Error
}

func (r *PaymentRepository) Update(payment *models.Payment) (*models.Payment, error) {
	result := r.db.Save(*payment)
	return payment, result.Error
}

func (r *PaymentRepository) Delete(id uint) error {
	payment := models.Payment{}
	result := r.db.Where("id=?", id).Delete(&payment)
	return result.Error
}
