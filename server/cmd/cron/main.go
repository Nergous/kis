package cron

import (
	"fmt"
	"project_backend/internal/models"
	"time"

	"gorm.io/gorm"
)

func SetupDebtChecker(db *gorm.DB) {
	// Запускаем каждую ночь в полночь
	ticker := time.NewTicker(5 * time.Second)
	go func() {
		for range ticker.C {
			checkDebtors(db)
			updateStatusToPaid(db)
			updateStatusPartToPaid(db)
		}
	}()
}

func updateStatusToPaid(db *gorm.DB) {
	var orders []models.Order

	db.Preload("Customer").
		Preload("Payments").
		Where("payment_terms = ?", "full_payment").
		Find(&orders)

	for _, order := range orders {
		var totalPaid float64
		for _, payment := range order.Payments {
			totalPaid += payment.PaymentSum
		}

		// Если оплачено меньше суммы заказа
		if totalPaid >= order.TotalPrice {
			db.Model(&order).Updates(map[string]interface{}{
				"debt_status": "paid",
			})
		}
	}
}

func updateStatusPartToPaid(db *gorm.DB) {
	var orders []models.Order

	db.Preload("Customer").
		Preload("Payments").
		Where("payment_terms = ?", "prepayment").
		Find(&orders)

	for _, order := range orders {
		var totalPaid float64
		for _, payment := range order.Payments {
			totalPaid += payment.PaymentSum
		}

		// Если оплачено меньше суммы заказа
		if totalPaid < order.TotalPrice && totalPaid > 0 {
			db.Model(&order).Updates(map[string]interface{}{
				"debt_status": "partial",
			})
		} else if totalPaid >= order.TotalPrice {
			db.Model(&order).Updates(map[string]interface{}{
				"debt_status": "paid",
			})
		}
	}
}

func checkDebtors(db *gorm.DB) {
	fmt.Println("-------------------------------")
	fmt.Println("ПРОВЕРКА НА ПИДОРА")
	fmt.Println("-------------------------------")
	// Находим заказы, которые могут быть просрочены
	var orders []models.Order
	fourteenDaysAgo := time.Now().AddDate(0, 0, -14)

	db.Preload("Customer").
		Preload("Payments").
		Where("payment_terms != ?", "full_payment").
		Where("sent_date IS NOT NULL").
		Where("sent_date < ?", fourteenDaysAgo).
		Find(&orders)

	for _, order := range orders {
		// Считаем сумму платежей
		var totalPaid float64
		for _, payment := range order.Payments {
			totalPaid += payment.PaymentSum
		}

		// Если оплачено меньше суммы заказа
		if totalPaid < order.TotalPrice {
			// Помечаем заказ как просроченный
			db.Model(&order).Updates(map[string]interface{}{
				"debt_status": "debt",
			})

			// Помечаем покупателя как должника
			db.Model(&order.Customer).Update("status", "debt")
		}

		if totalPaid >= order.TotalPrice {
			db.Model(&order).Updates(map[string]interface{}{
				"debt_status": "paid",
			})

			db.Model(&order.Customer).Update("status", "active")
		}
	}
}
