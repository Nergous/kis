package services

import (
	"fmt"
	"os"
	"project_backend/internal/models"
	"project_backend/internal/repositories"
)

func GetAllProducts() ([]models.Product, error) {
	return repositories.GetAllProducts()
}

func GetProductByID(id uint) (*models.Product, error) {
	return repositories.GetProductByID(id)
}

func CreateProduct(product *models.Product) (*models.Product, error) {

	fmt.Println(product)
	if err := product.Validate(); err != nil {
		return nil, fmt.Errorf("ошибка валидации: %w", err)
	}

	return repositories.CreateProduct(product)
}

func UpdateProduct(product *models.Product) (*models.Product, error) {
	if err := product.Validate(); err != nil {
		return nil, fmt.Errorf("ошибка валидации: %w", err)
	}

	existingProduct, err := repositories.GetProductByID(product.ID)
	if err != nil {
		return nil, fmt.Errorf("ошибка при получении продукта: %w", err)
	}

	if product.ImgPath != existingProduct.ImgPath && existingProduct.ImgPath != "" {
		err = os.Remove(existingProduct.ImgPath)
		if err != nil {
			return nil, fmt.Errorf("ошибка при удалении старого изображения: %w", err)
		}
	}

	return repositories.UpdateProduct(product)
}

func DeleteProduct(id uint) error {
	product, err := repositories.GetProductByID(id)
	if err != nil {
		return err
	}
	if product.ImgPath != "" {
		err := os.Remove(product.ImgPath)
		if err != nil {
			return err
		}
	}
	return repositories.DeleteProduct(id)
}

func UpdateQuantity(id uint, quantity int) error {
	product, err := repositories.GetProductByID(id)
	if err != nil {
		return err
	}

	product.Quantity += quantity
	_, err = repositories.UpdateProduct(product)
	if err != nil {
		return err
	}
	return nil
}

func UpdatePrice(id uint, price float64) error {
	product, err := repositories.GetProductByID(id)
	if err != nil {
		return err
	}

	product.Price = price
	_, err = repositories.UpdateProduct(product)
	if err != nil {
		return err
	}
	return nil
}
