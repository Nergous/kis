package models

import (
	"time"

	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type Payment struct {
	BaseModel

	PaymentDate time.Time `gorm:"type:datetime" json:"payment_date" validate:"required"`
	PaymentSum  float64   `gorm:"type:decimal(10,2)" json:"payment_sum" validate:"required"`

	OrderID uint `gorm:"not null" json:"order_id" validate:"required,gte=1" form:"order_id"`

	Order Order `json:"-" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

func CreatePaymentTable(db *gorm.DB) error {
	return db.AutoMigrate(&Payment{})
}

func (p *Payment) Validate() error {
	validate := validator.New()
	return validate.Struct(p)
}
