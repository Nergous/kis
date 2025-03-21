package repositories

import (
	"project_backend/internal/models"

	"gorm.io/gorm"
)

type ProductMovingRepository struct {
	db *gorm.DB
}

func NewProductMovingRepository(db *gorm.DB) *ProductMovingRepository {
	return &ProductMovingRepository{db: db}
}

func (s *ProductMovingRepository) GetAll() ([]models.ProductMoving, error) {
	var productMovings []models.ProductMoving
	result := s.db.Find(&productMovings)
	return productMovings, result.Error
}

func (s *ProductMovingRepository) GetByID(id uint) (*models.ProductMoving, error) {
	productMoving := models.ProductMoving{}
	result := s.db.First(&productMoving, id)
	return &productMoving, result.Error
}

func (s *ProductMovingRepository) Create(productMoving *models.ProductMoving) (*models.ProductMoving, error) {
	productMoving.MoveDate = s.db.NowFunc()
	result := s.db.Create(productMoving)
	return productMoving, result.Error
}

func (s *ProductMovingRepository) Update(productMoving *models.ProductMoving) (*models.ProductMoving, error) {
	result := s.db.Save(*productMoving)
	return productMoving, result.Error
}

func (s *ProductMovingRepository) Delete(id uint) error {
	productMoving := models.ProductMoving{}
	result := s.db.Where("id=?", id).Delete(&productMoving)
	return result.Error
}
