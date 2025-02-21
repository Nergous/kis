package models

import (
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type Customer struct {
	gorm.Model
	Name          string      `gorm:"type:varchar(255);not null"                    json:"name" validate:"required,min=1"`
	Email         string      `gorm:"type:varchar(255);not null;unique"             json:"email" validate:"required,min=1"`
	Password      string      `gorm:"type:varchar(255);not null"                    json:"password" validate:"required,min=1"`
	INN           string      `gorm:"type:varchar(255);not null;unique"             json:"inn" validate:"required,min=1"`
	MainBooker    string      `gorm:"type:varchar(255);not null"                    json:"main_booker" validate:"required,min=1"`
	Director      string      `gorm:"type:varchar(255);not null"                    json:"director" validate:"required,min=1"`
	PaymentCharID uint        `gorm:"not null;unique"                               json:"payment_char_id"`
	PaymentChar   PaymentChar `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"payment_char,omitempty"`
}

func CreateCustomersTable(db *gorm.DB) error {
	return db.AutoMigrate(&Customer{})
}

func (p *Customer) Validate() error {
	validate := validator.New()
	return validate.Struct(p)
}
