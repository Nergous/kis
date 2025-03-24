package models

import (
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type Worker struct {
	BaseModel
	Name     string `gorm:"type:varchar(255);not null" json:"name" validate:"required,min=1"`
	Login    string `gorm:"type:varchar(255);not null" json:"login" validate:"required,min=1"`
	Password string `gorm:"type:varchar(255);not null" json:"-" validate:"required,min=1"`

	Role string `gorm:"type:ENUM('admin', 'storage', 'intern', 'manager', 'director', 'accountant');not null;default:intern" json:"role" validate:"required"`
}

func CreateWorkersTable(db *gorm.DB) error {
	return db.AutoMigrate(&Worker{})
}

func (p *Worker) Validate() error {
	validate := validator.New()
	return validate.Struct(p)
}
