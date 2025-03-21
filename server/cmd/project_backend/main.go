package main

import (
	"fmt"
	"log"

	"project_backend/config"
	"project_backend/internal/middleware"
	"project_backend/internal/repositories"
	"project_backend/internal/routes"
	"project_backend/internal/services"
	"project_backend/migration"

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

	err = migration.Migrate()
	if err != nil {
		log.Fatalf("Ошибка миграции базы данных: %v", err)
	}

	repos := repositories.InitRepos(config.DB)
	services := services.InitServices(repos)

	r := routes.SetupRoutes(services)

	r.Use(middleware.LogMiddleware())
	r.Use(middleware.CorsMiddleware())

	port := fmt.Sprintf(":%d", config.AppConfig.App.Port)
	addr := "127.0.0.1" + port

	log.Printf("Сервер запущен на порту %d", config.AppConfig.App.Port)
	if err := r.Run(addr); err != nil {
		log.Fatalf("Ошибка запуска сервера: %v", err)
	}

}
