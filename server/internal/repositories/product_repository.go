package repositories

import (
	"project_backend/internal/models"

	"gorm.io/gorm"
)

type ProductRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) *ProductRepository {
	return &ProductRepository{db: db}
}

func (r *ProductRepository) GetAll() ([]models.Product, error) {
	var products []models.Product
	result := r.db.Find(&products)
	if result.Error != nil {
		return nil, result.Error
	}
	return products, nil
}

func (r *ProductRepository) GetByID(id uint) (*models.Product, error) {
	var product models.Product
	result := r.db.First(&product, id)
	if result.Error != nil {
		return &models.Product{}, result.Error
	}
	return &product, nil
}

func (r *ProductRepository) Create(product *models.Product) (*models.Product, error) {
	result := r.db.Create(product)
	return product, result.Error
}

func (r *ProductRepository) Update(product *models.Product) (*models.Product, error) {
	result := r.db.Save(*product)
	return product, result.Error
}

func (r *ProductRepository) Delete(id uint) error {
	product := models.Product{}
	result := r.db.Where("id=?", id).Delete(&product)
	return result.Error
}
