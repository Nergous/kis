package repositories

import (
	"fmt"
	"project_backend/internal/models"
	"time"

	"gorm.io/gorm"
)

type PaymentRepository struct {
	db *gorm.DB
}

func NewPaymentRepository(db *gorm.DB) *PaymentRepository {
	return &PaymentRepository{db: db}
}

func (r *PaymentRepository) GetAll(duration string) (map[string]interface{}, error) {
	response := make(map[string]interface{})

	switch duration {
	case "all", "week", "month", "3month", "6month", "year":
		// Для всех случаев используем группировку по дням
		var startDate time.Time
		now := time.Now()

		if duration == "all" {
			// Для "all" получаем самую раннюю дату из базы
			var oldestPayment models.Payment
			if err := r.db.Order("created_at asc").First(&oldestPayment).Error; err != nil {
				return nil, err
			}
			startDate = oldestPayment.CreatedAt
		} else {
			// Определяем период для других случаев
			switch duration {
			case "week":
				startDate = now.AddDate(0, 0, -7)
			case "month":
				startDate = now.AddDate(0, -1, 0)
			case "3month":
				startDate = now.AddDate(0, -3, 0)
			case "6month":
				startDate = now.AddDate(0, -6, 0)
			case "year":
				startDate = now.AddDate(-1, 0, 0)
			}
		}

		// Выполняем запрос с группировкой по дням
		var dailyResults []struct {
			Date  string `json:"date"`
			Total string `json:"sum"`
		}

		rows, err := r.db.Model(&models.Payment{}).
			Select("DATE_FORMAT(created_at, '%d-%m-%Y') as date, SUM(payment_sum) as total").
			Where("created_at >= ?", startDate).
			Group("DATE(created_at)").
			Order("created_at ASC").
			Rows()

		if err != nil {
			return nil, err
		}
		defer rows.Close()

		for rows.Next() {
			var item struct {
				Date  string `json:"date"`
				Total string `json:"sum"`
			}
			if err := r.db.ScanRows(rows, &item); err != nil {
				return nil, err
			}
			dailyResults = append(dailyResults, item)
		}

		response["money"] = dailyResults
		return response, nil
	}

	return nil, fmt.Errorf("invalid duration: %s", duration)
}

func (r *PaymentRepository) GetByID(id uint) (*models.Payment, error) {
	payment := models.Payment{}
	result := r.db.First(&payment, id)
	return &payment, result.Error
}

func (r *PaymentRepository) GetByOrderID(id uint) (*[]models.Payment, error) {
	payment := make([]models.Payment, 0)

	result := r.db.Where("order_id=?", id).Find(&payment)
	return &payment, result.Error
}

func (r *PaymentRepository) Create(payment *models.Payment) (*models.Payment, error) {
	result := r.db.Create(payment)
	return payment, result.Error
}

func (r *PaymentRepository) Update(payment *models.Payment) (*models.Payment, error) {
	result := r.db.Save(*payment)
	return payment, result.Error
}

func (r *PaymentRepository) Delete(id uint) error {
	payment := models.Payment{}
	result := r.db.Where("id=?", id).Delete(&payment)
	return result.Error
}
