package repositories

import (
	"fmt"
	"log"
	"project_backend/internal/models"
	"time"

	"gorm.io/gorm"
)

type OrderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) *OrderRepository {
	return &OrderRepository{db: db}
}

func (r *OrderRepository) GetAll() ([]models.Order, error) {
	var orders []models.Order
	result := r.db.Preload("OrderContent").Preload("OrderContent.Product").Preload("Customer").Find(&orders)
	if result.Error != nil {
		return nil, result.Error
	}
	return orders, nil
}

func (r *OrderRepository) GetAllInAssembly() ([]models.Order, error) {
	var orders []models.Order
	result := r.db.Preload("OrderContent").Preload("OrderContent.Product").Preload("Customer").Where("status IN ?", []string{"in_assembly", "awaiting_shipment"}).Find(&orders)
	if result.Error != nil {
		return nil, result.Error
	}
	return orders, nil
}

func (r *OrderRepository) GetByID(id uint) (*models.Order, error) {
	var order models.Order
	result := r.db.Preload("OrderContent").Preload("OrderContent.Product").Preload("Customer").First(&order, id)
	if result.Error != nil {
		return &models.Order{}, result.Error
	}
	return &order, nil
}

func (r *OrderRepository) GetByCustomerID(customerID uint) ([]models.Order, error) {
	// Логика поиска заказов в базе данных
	var orders []models.Order
	result := r.db.Preload("OrderContent").Preload("OrderContent.Product").Preload("Contracts").Preload("Customer").Where("customer_id = ?", customerID).Find(&orders)
	if result.Error != nil {
		return nil, result.Error
	}
	return orders, nil
}

func (r *OrderRepository) Create(order *models.Order) (*models.Order, error) {
	tx := r.db.Begin()
	order.OrderID = uint(time.Now().UnixNano())
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	var existingOrder models.Order
	if tx.Where("order_id = ?", order.OrderID).First(&existingOrder).Error == nil {
		tx.Rollback()
		return nil, fmt.Errorf("order ID %d already exists", order.OrderID)
	}

	if err := tx.Create(order).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	tx.Commit()
	return order, nil
}

func (r *OrderRepository) UpdatePrices(orderID uint, products []models.OrderContentUpdate, totalOrderPrice float64) error {
	tx := r.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Обновляем цены для каждого товара в заказе
	for _, product := range products {
		result := tx.Model(&models.OrderContent{}).
			Where("order_id = ? AND product_id = ?", orderID, product.ProductID).
			Updates(map[string]interface{}{
				"price":               product.Price,
				"total_product_price": product.TotalProductPrice,
			})
		if result.Error != nil {
			tx.Rollback()
			return result.Error
		}
	}

	// Обновляем общую стоимость заказа
	result := tx.Model(&models.Order{}).
		Where("id = ?", orderID).
		Update("total_price", totalOrderPrice)
	if result.Error != nil {
		tx.Rollback()
		return result.Error
	}

	tx.Commit()
	return nil
}

func (r *OrderRepository) Update(order *models.Order) error {
	result := r.db.Save(order)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *OrderRepository) UpdateDebtStatus(id uint, status string) error {
	// Начинаем новую транзакцию
	tx := r.db.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	// Выполняем обновление в транзакции
	result := tx.Model(&models.Order{}).Where("id = ?", id).Update("debt_status", status)
	if result.Error != nil {
		tx.Rollback() // Откатываем при ошибке
		return result.Error
	}

	// Коммитим транзакцию
	if err := tx.Commit().Error; err != nil {
		return err
	}

	log.Printf("Updated order %d debt_status to %s, rows affected: %d",
		id, status, result.RowsAffected)
	return nil
}

func (r *OrderRepository) GetDebtOrdersByCustomerID(customerID uint) ([]models.Order, error) {
	var orders []models.Order

	// Ищем заказы, где:
	// - CustomerID соответствует указанному
	// - DebtStatus равен "debt"
	// - SentDate не nil (заказ был отправлен)
	// - Разница между текущей датой и SentDate больше 14 дней
	err := r.db.
		Where("customer_id = ?", customerID).
		Where("debt_status = ?", "debt").
		Where("sent_date IS NOT NULL").
		Where("DATE_ADD(sent_date, INTERVAL 14 DAY) < NOW()").
		Preload("Payments"). // Загружаем связанные платежи для расчета суммы
		Find(&orders).Error

	if err != nil {
		return nil, err
	}

	// Фильтруем заказы, где сумма платежей меньше суммы заказа
	var result []models.Order
	for _, order := range orders {
		var totalPaid float64
		for _, payment := range order.Payments {
			totalPaid += payment.PaymentSum
		}

		if totalPaid < order.TotalPrice {
			result = append(result, order)
		}
	}

	return result, nil
}
