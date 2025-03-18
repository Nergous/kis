package models

import (
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type Customer struct {
	BaseModel

	Name          string      `gorm:"type:varchar(255);not null"                      json:"name" validate:"required,min=1"`
	Email         string      `gorm:"type:varchar(255);not null;unique"               json:"email" validate:"required,min=1"`
	Password      string      `gorm:"type:varchar(255);not null"                      json:"-" validate:"required,min=1"`
	INN           string      `gorm:"type:varchar(255);unique"                        json:"inn"`
	MainBooker    string      `gorm:"type:varchar(255);        "                      json:"main_booker"`
	Director      string      `gorm:"type:varchar(255);        "                      json:"director"`
	PaymentCharID uint        `gorm:"not null;unique"                                 json:"-"`
	PaymentChar   PaymentChar `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"   json:"payment_char,omitempty"`
	CustomerType  string      `gorm:"type:ENUM('phys', 'juri');not null;default:phys" json:"customer_type" validate:"required"`

	Orders []Order `gorm:"foreignKey:CustomerID;references:ID" json:"orders,omitempty"`
}

func CreateCustomersTable(db *gorm.DB) error {
	return db.AutoMigrate(&Customer{})
}

func (p *Customer) Validate() error {
	validate := validator.New()
	return validate.Struct(p)
}
