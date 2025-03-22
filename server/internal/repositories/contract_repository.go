package repositories

import (
	"project_backend/internal/models"

	"gorm.io/gorm"
)

type ContractRepository struct {
	db *gorm.DB
}

func NewContractRepository(db *gorm.DB) *ContractRepository {
	return &ContractRepository{db: db}
}

func (r *ContractRepository) GetAll() ([]models.Contract, error) {
	var contracts []models.Contract
	if err := r.db.Find(&contracts).Error; err != nil {
		return nil, err
	}
	return contracts, nil
}

func (r *ContractRepository) GetByID(id uint) (*models.Contract, error) {
	var contract models.Contract
	if err := r.db.First(&contract, id).Error; err != nil {
		return nil, err
	}
	return &contract, nil
}

func (r *ContractRepository) GetByOrderID(orderID uint) ([]models.Contract, error) {
	var contracts []models.Contract
	if err := r.db.Where("order_id = ?", orderID).Find(&contracts).Error; err != nil {
		return nil, err
	}
	return contracts, nil
}

func (r *ContractRepository) Create(contract *models.Contract) (*models.Contract, error) {
	return contract, r.db.Create(contract).Error
}

func (r *ContractRepository) Update(contract *models.Contract) (*models.Contract, error) {
	return contract, r.db.Save(contract).Error
}

func (r *ContractRepository) Delete(id uint) error {
	return r.db.Where("id=?", id).Delete(&models.Contract{}).Error
}
