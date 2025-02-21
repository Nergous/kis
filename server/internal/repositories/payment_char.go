package repositories

import (
	"project_backend/config"
	"project_backend/internal/models"
)

func GetAllPaymentChars() ([]models.PaymentChar, error) {
	var paymentChars []models.PaymentChar
	result := config.DB.Find(&paymentChars)
	if result.Error != nil {
		return nil, result.Error
	}
	return paymentChars, nil
}

func GetPaymentCharByID(id uint) (*models.PaymentChar, error) {
	var paymentChar models.PaymentChar
	result := config.DB.First(&paymentChar, id)
	if result.Error != nil {
		return &models.PaymentChar{}, result.Error
	}
	return &paymentChar, nil
}

func CreatePaymentChar(paymentChar *models.PaymentChar) (*models.PaymentChar, error) {
	result := config.DB.Create(paymentChar)
	return paymentChar, result.Error
}

func UpdatePaymentChar(paymentChar *models.PaymentChar) (*models.PaymentChar, error) {
	result := config.DB.Save(*paymentChar)
	return paymentChar, result.Error
}

func DeletePaymentChar(id uint) error {
	paymentChar := models.PaymentChar{}
	result := config.DB.Where("id=?", id).Delete(&paymentChar)
	return result.Error
}
