package services

import (
	"fmt"
	"project_backend/internal/models"
	"project_backend/internal/repositories"
)

func GetAllOrders() ([]models.Order, error) {
	return repositories.GetAllOrders()
}

func GetAllOrdersInAssembly() ([]models.Order, error) {
	return repositories.GetAllOrdersInAssembly()
}

func GetOrderByID(id uint) (*models.Order, error) {
	return repositories.GetOrderByID(id)
}

func GetOrdersByCustomerID(customerID uint) ([]models.Order, error) {
	return repositories.GetOrdersByCustomerID(customerID)
}

func CreateOrder(order *models.Order) (*models.Order, error) {

	if len(order.OrderContent) == 0 {
		return nil, fmt.Errorf("нет содержимого заказа")
	}

	// if err := order.Validate(); err != nil {
	// 	return nil, fmt.Errorf("ошибка валидации: %w", err)
	// }

	return repositories.CreateOrder(order)
}

func UpdateOrderPrices(orderID uint, products []models.OrderContentUpdate, totalOrderPrice float64) error {
	// Получаем заказ из базы данных
	order, err := repositories.GetOrderByID(orderID)
	if err != nil {
		return fmt.Errorf("заказ с ID %d не найден", orderID)
	}

	// Проверяем, что все товары из запроса существуют в заказе
	for _, product := range products {
		found := false
		for _, content := range order.OrderContent {
			if content.ProductID == product.ProductID {
				found = true
				break
			}
		}
		if !found {
			return fmt.Errorf("товар с ID %d не найден в заказе", product.ProductID)
		}
	}

	// Обновляем цены в базе данных
	err = repositories.UpdateOrderPrices(orderID, products, totalOrderPrice)
	if err != nil {
		return fmt.Errorf("ошибка при обновлении цен: %w", err)
	}

	return nil
}

func UpdateOrderStatus(orderID uint, status string) error {
	// Получаем заказ из базы данных
	order, err := repositories.GetOrderByID(orderID)
	if err != nil {
		return fmt.Errorf("заказ с ID %d не найден", orderID)
	}

	// Обновляем статус заказа
	order.Status = status
	err = repositories.UpdateOrder(order)
	if err != nil {
		return fmt.Errorf("ошибка при обновлении статуса: %w", err)
	}

	return nil
}
