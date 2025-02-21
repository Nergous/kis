package models

import (
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type Worker struct {
	gorm.Model
	Name     string `gorm:"type:varchar(255);not null" json:"name" validate:"required,min=1"`
	Role     string `gorm:"type:ENUM('admin', 'storage', 'intern');not null;default:intern" json:"role" validate:"required"`
	Login    string `gorm:"type:varchar(255);not null" json:"login" validate:"required,min=1"`
	Password string `gorm:"type:varchar(255);not null" json:"password" validate:"required,min=1"`
}

func CreateWorkersTable(db *gorm.DB) error {
	return db.AutoMigrate(&Worker{})
}

func (p *Worker) Validate() error {
	validate := validator.New()
	return validate.Struct(p)
}
