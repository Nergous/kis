package models

import (
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type PaymentChar struct {
	gorm.Model
	BIK           string `gorm:"type:varchar(255);not null" json:"bik" validate:"required,min=1"`
	PaymentNumber string `gorm:"type:varchar(255);not null" json:"payment_number" validate:"required,min=1"`
	Bank          string `gorm:"type:varchar(255);not null" json:"bank" validate:"required,min=1"`
}

func CreatePaymentCharTable(db *gorm.DB) error {
	return db.AutoMigrate(&PaymentChar{})
}

func (p *PaymentChar) Validate() error {
	validate := validator.New()
	return validate.Struct(p)
}
