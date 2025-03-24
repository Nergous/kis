package models

import (
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type ContractQuantity struct {
	BaseModel
	ContractType string `gorm:"ENUM('order','storage');not null;default:order" json:"contract_type" validate:"required"`
	Quantity     int    `gorm:"type:int;not null" json:"quantity" validate:"required,gte=1"`
}

func CreateContractQuantityTable(db *gorm.DB) error {
	return db.AutoMigrate(&ContractQuantity{})
}

func (c *ContractQuantity) ValidateContractQuantity() error {
	validate := validator.New()
	return validate.Struct(c)
}
