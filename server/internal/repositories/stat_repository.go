package repositories

import (
	"project_backend/internal/models"

	"gorm.io/gorm"
)

type StatRepository struct {
	db *gorm.DB
}

type product struct {
	Name     string
	Quantity int64
}

func NewStatRepository(db *gorm.DB) *StatRepository {
	return &StatRepository{db: db}
}

func (r *StatRepository) GetOrdersCountByStatus(status string) int64 {
	var count int64
	r.db.Model(&models.Order{}).Where("status = ?", status).Count(&count)
	return count
}

func (r *StatRepository) GetWorkersCount() int64 {
	var count int64
	r.db.Model(&models.Worker{}).Count(&count)
	return count
}

func (r *StatRepository) GetCustomersCount() int64 {
	var count int64
	r.db.Model(&models.Customer{}).Count(&count)

	return count
}

func (r *StatRepository) GetProductsCount() []product {

	var products []product
	r.db.Raw("SELECT name, quantity FROM products WHERE quantity > 0;").Scan(&products)

	return products
}
