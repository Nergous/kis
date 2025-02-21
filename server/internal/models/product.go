package models

import (
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Name            string  `gorm:"type:varchar(255);not null" json:"name" validate:"required,min=1"`
	Price           float64 `gorm:"type:decimal(10,2);not null" json:"price" validate:"required,gte=1"`
	Quantity        int     `gorm:"type:int;not null" json:"quantity" validate:"required,gte=1"`
	Variety         string  `gorm:"type:varchar(255);not null" json:"variety" validate:"required,min=1"`
	Characteristics string  `gorm:"type:text;not null" json:"characteristics" validate:"required,min=1"`
}

func CreateProductsTable(db *gorm.DB) error {
	return db.AutoMigrate(&Product{})
}

func (p *Product) Validate() error {
	validate := validator.New()
	return validate.Struct(p)
}
