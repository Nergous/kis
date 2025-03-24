package migration

import (
	"log"
	"project_backend/config"
	"project_backend/internal/models"
)

func Migrate() error {
	err := models.CreateProductsTable(config.DB)
	if err != nil {
		log.Fatalf("Ошибка создания таблицы продуктов: %v", err)
	}
	err = models.CreateCustomersTable(config.DB)
	if err != nil {
		log.Fatalf("Ошибка создания таблицы клиентов: %v", err)
	}
	err = models.CreateWorkersTable(config.DB)
	if err != nil {
		log.Fatalf("Ошибка создания таблицы работников: %v", err)
	}
	err = models.CreatePaymentCharTable(config.DB)
	if err != nil {
		log.Fatalf("Ошибка создания таблицы платежных характеристик: %v", err)
	}
	err = models.CreateOrdersTable(config.DB)
	if err != nil {
		log.Fatalf("Ошибка создания таблицы заказа: %v", err)
	}
	err = models.CreateOrderContentTable(config.DB)
	if err != nil {
		log.Fatalf("Ошибка создания таблицы состава заказа: %v", err)
	}

	err = models.CreatePaymentTable(config.DB)
	if err != nil {
		log.Fatalf("Ошибка создания таблицы платежей: %v", err)
	}

	err = models.CreateProductMovingTable(config.DB)
	if err != nil {
		log.Fatalf("Ошибка создания таблицы движения продукции: %v", err)
	}

	err = models.CreateContractTable(config.DB)
	if err != nil {
		log.Fatalf("Ошибка создания таблицы контрактов: %v", err)
	}

	err = models.CreateContractQuantityTable(config.DB)
	if err != nil {
		log.Fatalf("Ошибка создания таблицы количества контрактов: %v", err)
	}
	return nil
}
