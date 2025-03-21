package models

import (
	"time"

	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type ProductMoving struct {
	BaseModel
	Count      uint      `gorm:"not null" json:"count" validate:"required,gte=1" form:"count"`
	MovingType string    `gorm:"ENUM('in', 'out'),not null" json:"moving_type" validate:"required,min=1" form:"moving_type"`
	ProductID  uint      `gorm:"not null" json:"product_id" validate:"required,gte=1" form:"product_id"`
	MoveDate   time.Time `gorm:"type:datetime" json:"move_date"`

	Product Product `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"product,omitempty"`
}

func CreateProductMovingTable(db *gorm.DB) error {
	return db.AutoMigrate(&ProductMoving{})
}

func (p *ProductMoving) Validate() error {
	validate := validator.New()
	return validate.Struct(p)
}
