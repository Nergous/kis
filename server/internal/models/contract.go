package models

import (
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type Contract struct {
	BaseModel
	ContractType string `gorm:"type:ENUM('order','invoice', 'receipt', 'acceptance');not null;default:order" json:"contract_type" validate:"required"`
	FilePath     string `gorm:"type:varchar(255);not null" json:"file_path" validate:"required,min=1"`
	OrderID      uint   `gorm:"not null" json:"order_id" validate:"required,gte=1" form:"order_id"`

	Order Order `json:"-" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

func CreateContractTable(db *gorm.DB) error {
	return db.AutoMigrate(&Contract{})
}

func (c *Contract) Validate() error {
	validate := validator.New()
	return validate.Struct(c)
}
