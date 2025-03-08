package models

import (
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type OrderContent struct {
	BaseModel
	ProductID         uint    `gorm:"not null" json:"product_id" validate:"required,gte=1" form:"product_id"`
	OrderID           uint    `gorm:"not null" json:"order_id" validate:"required,gte=1" form:"order_id"`
	Quantity          int     `gorm:"type:int;not null" json:"quantity" validate:"required,gte=1" form:"quantity"`
	Price             float64 `gorm:"type:decimal(10,2)" json:"price" validate:"required,gte=1" form:"price"`
	TotalProductPrice float64 `gorm:"type:decimal(10,2)" json:"total_product_price" validate:"required,gte=1" form:"total_product_price"`

	Product Product `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"product,omitempty"`
	Order   Order   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
}

type OrderContentUpdate struct {
	ProductID         uint    `json:"product_id"`
	Price             float64 `json:"price"`
	TotalProductPrice float64 `json:"total_product_price"`
}

func CreateOrderContentTable(db *gorm.DB) error {
	return db.AutoMigrate(&OrderContent{})
}

func (p *OrderContent) Validate() error {
	validate := validator.New()
	return validate.Struct(p)
}
