package repositories

import (
	"project_backend/internal/models"

	"gorm.io/gorm"
)

type PaymentCharRepository struct {
	db *gorm.DB
}

func NewPaymentCharRepository(db *gorm.DB) *PaymentCharRepository {
	return &PaymentCharRepository{db: db}
}

func (r *PaymentCharRepository) GetAll() ([]models.PaymentChar, error) {
	var paymentChars []models.PaymentChar
	result := r.db.Find(&paymentChars)
	if result.Error != nil {
		return nil, result.Error
	}
	return paymentChars, nil
}

func (r *PaymentCharRepository) GetByID(id uint) (*models.PaymentChar, error) {
	var paymentChar models.PaymentChar
	result := r.db.First(&paymentChar, id)
	if result.Error != nil {
		return &models.PaymentChar{}, result.Error
	}
	return &paymentChar, nil
}

func (r *PaymentCharRepository) Create(paymentChar *models.PaymentChar) (*models.PaymentChar, error) {
	result := r.db.Create(paymentChar)
	return paymentChar, result.Error
}

func (r *PaymentCharRepository) Update(paymentChar *models.PaymentChar) (*models.PaymentChar, error) {
	result := r.db.Save(*paymentChar)
	return paymentChar, result.Error
}

func (r *PaymentCharRepository) Delete(id uint) error {
	paymentChar := models.PaymentChar{}
	result := r.db.Where("id=?", id).Delete(&paymentChar)
	return result.Error
}
