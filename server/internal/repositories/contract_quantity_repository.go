package repositories

import (
	"fmt"
	"project_backend/internal/models"

	"gorm.io/gorm"
)

type ContractQuantityRepository struct {
	db *gorm.DB
}

func NewContractQuantityRepository(db *gorm.DB) *ContractQuantityRepository {
	return &ContractQuantityRepository{db: db}
}

func (r *ContractQuantityRepository) GetAll() ([]models.ContractQuantity, error) {
	var contractQuantities []models.ContractQuantity
	if err := r.db.Find(&contractQuantities).Error; err != nil {
		return nil, err
	}
	return contractQuantities, nil
}

func (r *ContractQuantityRepository) GetByID(id uint) (*models.ContractQuantity, error) {
	var contractQuantity models.ContractQuantity
	if err := r.db.First(&contractQuantity, id).Error; err != nil {
		return nil, err
	}
	return &contractQuantity, nil
}

func (r *ContractQuantityRepository) Create(contractType string) (*models.ContractQuantity, error) {
	contracts, err := r.GetByContractType(contractType)
	if err != nil {
		return nil, err
	}
	if contracts != nil {
		r.Update(contractType)
	} else {
		contractQuantity := models.ContractQuantity{ContractType: contractType, Quantity: 1}
		if err := r.db.Create(&contractQuantity).Error; err != nil {
			return nil, err
		}
		return &contractQuantity, nil
	}
	return nil, fmt.Errorf("произошла ошибка при создании контракта %s", contractType)
}

func (r *ContractQuantityRepository) Update(contractType string) (*models.ContractQuantity, error) {
	contractQuantity, err := r.GetByContractType(contractType)
	if err != nil {
		return nil, err
	}
	contractQuantity.Quantity += 1
	if err := r.db.Save(&contractQuantity).Error; err != nil {
		return nil, err
	}
	return contractQuantity, nil
}

func (r *ContractQuantityRepository) Delete(id uint) error {
	return r.db.Delete(&models.ContractQuantity{}, id).Error
}

func (r *ContractQuantityRepository) GetByContractType(contractType string) (*models.ContractQuantity, error) {
	var contractQuantity models.ContractQuantity
	if err := r.db.Where("contract_type = ?", contractType).First(&contractQuantity).Error; err != nil {
		return nil, err
	}
	return &contractQuantity, nil
}
