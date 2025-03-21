package models

import (
	"time"

	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type Order struct {
	BaseModel
	OrderID        uint       `gorm:"type:int;not null;unique" json:"order_id_unique" form:"order_id_unique"`
	Address        string     `gorm:"type:varchar(255);not null" json:"address" validate:"required" form:"address"`
	DeliveryDate   time.Time  `gorm:"type:datetime" json:"delivery_date" form:"delivery_date"`
	PaymentTerms   string     `gorm:"type:ENUM('prepayment', 'postpayment', 'full_payment');default:full_payment;not null" json:"payment_terms" validate:"required" form:"payment_terms"`
	Status         string     `gorm:"type:ENUM('in_processing', 'awaiting_payment', 'in_assembly', 'awaiting_shipment', 'in_transit', 'received');default:in_processing;not null" json:"status" form:"status"`
	PaymentTime    *time.Time `gorm:"type:datetime" json:"payment_time" form:"payment_time"`
	CustomerID     uint       `gorm:"not null" json:"customer_id" validate:"required,gte=1" form:"customer_id"`
	TotalPrice     float64    `gorm:"type:decimal(10,2)" json:"total_price" form:"total_price"`
	RecipientPhone string     `gorm:"type:varchar(255);not null" json:"recipient_phone" validate:"required,min=1" form:"recipient_phone"`

	Customer     Customer       `json:"customer"`
	OrderContent []OrderContent `json:"order_content" gorm:"foreignKey:OrderID;references:ID"`
	Payments     []Payment      `json:"-" gorm:"foreignKey:OrderID;references:ID"`
}

func CreateOrdersTable(db *gorm.DB) error {
	return db.AutoMigrate(&Order{})
}

func (p *Order) Validate() error {
	validate := validator.New()
	return validate.Struct(p)
}
