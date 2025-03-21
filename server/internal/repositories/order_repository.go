package repositories

import (
	"fmt"
	"project_backend/config"
	"project_backend/internal/models"
	"time"
)

func GetAllOrders() ([]models.Order, error) {
	var orders []models.Order
	result := config.DB.Preload("OrderContent").Preload("OrderContent.Product").Find(&orders)
	if result.Error != nil {
		return nil, result.Error
	}
	return orders, nil
}

func GetAllOrdersInAssembly() ([]models.Order, error) {
	var orders []models.Order
	result := config.DB.Preload("OrderContent").Preload("OrderContent.Product").Where("status IN ?", []string{"in_assembly", "awaiting_shipment"}).Find(&orders)
	if result.Error != nil {
		return nil, result.Error
	}
	return orders, nil
}

func GetOrderByID(id uint) (*models.Order, error) {
	var order models.Order
	result := config.DB.Preload("OrderContent").Preload("OrderContent.Product").First(&order, id)
	if result.Error != nil {
		return &models.Order{}, result.Error
	}
	return &order, nil
}

func GetOrdersByCustomerID(customerID uint) ([]models.Order, error) {
	// Логика поиска заказов в базе данных
	var orders []models.Order
	result := config.DB.Preload("OrderContent").Preload("OrderContent.Product").Where("customer_id = ?", customerID).Find(&orders)
	if result.Error != nil {
		return nil, result.Error
	}
	return orders, nil
}

func CreateOrder(order *models.Order) (*models.Order, error) {
	tx := config.DB.Begin()
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

func UpdateOrderPrices(orderID uint, products []models.OrderContentUpdate, totalOrderPrice float64) error {
	tx := config.DB.Begin()
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

func UpdateOrder(order *models.Order) error {
	result := config.DB.Save(order)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
