package main

import (
	"fmt"
	"log"

	"project_backend/config"
	"project_backend/internal/middleware"
	"project_backend/internal/models"
	"project_backend/internal/routes"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	configPath := "config/config.yaml"
	config.LoadConfig(configPath)

	middleware.InitLogger(config.AppConfig.Logging.Level)

	err = config.InitDB()
	if err != nil {
		log.Fatalf("Ошибка инициализации базы данных: %v", err)
	}

	err = models.CreateProductsTable(config.DB)
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

	r := routes.SetupRoutes()
	r.Use(middleware.LogMiddleware())

	r.Use(middleware.CorsMiddleware())

	port := fmt.Sprintf(":%d", config.AppConfig.App.Port)
	addr := "127.0.0.1" + port

	log.Printf("Сервер запущен на порту %d", config.AppConfig.App.Port)
	if err := r.Run(addr); err != nil {
		log.Fatalf("Ошибка запуска сервера: %v", err)
	}

}
