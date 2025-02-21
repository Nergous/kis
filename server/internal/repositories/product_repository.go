package repositories

import (
	"project_backend/config"
	"project_backend/internal/models"
)

func GetAllProducts() ([]models.Product, error) {
	var products []models.Product
	result := config.DB.Find(&products)
	if result.Error != nil {
		return nil, result.Error
	}
	return products, nil
}

func GetProductByID(id uint) (*models.Product, error) {
	var product models.Product
	result := config.DB.First(&product, id)
	if result.Error != nil {
		return &models.Product{}, result.Error
	}
	return &product, nil
}

func CreateProduct(product *models.Product) (*models.Product, error) {
	result := config.DB.Create(product)
	return product, result.Error
}

func UpdateProduct(product *models.Product) (*models.Product, error) {
	result := config.DB.Save(*product)
	return product, result.Error
}

func DeleteProduct(id uint) error {
	product := models.Product{}
	result := config.DB.Where("id=?", id).Delete(&product)
	return result.Error
}
