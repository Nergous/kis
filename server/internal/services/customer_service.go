package services

import (
	"fmt"
	"project_backend/internal/models"
	"project_backend/internal/repositories"
)

func GetAllCustomers() ([]models.Customer, error) {
	return repositories.GetAllCustomers()
}

func GetCustomerByID(id uint) (*models.Customer, error) {
	return repositories.GetCustomerByID(id)
}

func CreateCustomer(customer *models.Customer) (*models.Customer, error) {
	if err := customer.Validate(); err != nil {
		return nil, fmt.Errorf("ошибка валидации: %w", err)
	} 

	return repositories.CreateCustomer(customer)
}

func UpdateCustomer(customer *models.Customer) (*models.Customer, error) {
	if err := customer.Validate(); err != nil {
		return nil, fmt.Errorf("ошибка валидации: %w", err)
	}

	return repositories.UpdateCustomer(customer)
}

func DeleteCustomer(id uint) error {
	return repositories.DeleteCustomer(id)
}
