package repositories

import (
	"project_backend/internal/models"

	"gorm.io/gorm"
)

type CustomerRepository struct {
	db *gorm.DB
}

func NewCustomerRepository(db *gorm.DB) *CustomerRepository {
	return &CustomerRepository{db: db}
}

func (r *CustomerRepository) GetAll() ([]models.Customer, error) {
	var customers []models.Customer
	result := r.db.Preload("PaymentChar").Find(&customers)
	if result.Error != nil {
		return nil, result.Error
	}
	return customers, nil
}

func (r *CustomerRepository) GetByID(id uint) (*models.Customer, error) {
	var customer models.Customer
	result := r.db.Preload("PaymentChar").First(&customer, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &customer, nil
}

func (r *CustomerRepository) GetByEmail(email string) (*models.Customer, error) {
	var customer models.Customer
	result := r.db.Where("email=?", email).First(&customer)
	if result.Error != nil {
		return nil, result.Error
	}
	return &customer, nil
}

func (r *CustomerRepository) Create(customer *models.Customer) (*models.Customer, error) {
	result := r.db.Create(customer)
	return customer, result.Error
}

func (r *CustomerRepository) Update(customer *models.Customer) (*models.Customer, error) {
	result := r.db.Save(customer)
	return customer, result.Error
}

func (r *CustomerRepository) Delete(id uint) error {
	customer := models.Customer{}
	result := r.db.Where("id=?", id).Delete(&customer)
	return result.Error
}
