package repositories

import (
	"project_backend/config"
	"project_backend/internal/models"
)

func GetAllCustomers() ([]models.Customer, error) {
	var customers []models.Customer
	result := config.DB.Preload("PaymentChar").Find(&customers)
	if result.Error != nil {
		return nil, result.Error
	}
	return customers, nil
}

func GetCustomerByID(id uint) (*models.Customer, error) {
	var customer models.Customer
	result := config.DB.Preload("PaymentChar").First(&customer, id)
	if result.Error != nil {
		return &models.Customer{}, result.Error
	}
	return &customer, nil
}

func GetCustomerByEmail(email string) (*models.Customer, error) {
	var customer models.Customer
	result := config.DB.Where("email=?", email).First(&customer)
	if result.Error != nil {
		return &models.Customer{}, result.Error
	}
	return &customer, nil
}

func CreateCustomer(customer *models.Customer) (*models.Customer, error) {
	result := config.DB.Create(customer)
	return customer, result.Error
}

func UpdateCustomer(customer *models.Customer) (*models.Customer, error) {
	result := config.DB.Save(*customer)
	return customer, result.Error
}

func DeleteCustomer(id uint) error {
	customer := models.Customer{}
	result := config.DB.Where("id=?", id).Delete(&customer)
	return result.Error
}
