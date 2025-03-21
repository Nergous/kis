package main

import (
	"flag"
	"log"

	"project_backend/config"
	"project_backend/internal/models"
	"project_backend/internal/repositories"

	"github.com/joho/godotenv"
)

func main() {

	// Парсим флаги командной строки
	login := flag.String("login", "", "Логин администратора")
	password := flag.String("password", "", "Пароль администратора")
	name := flag.String("name", "", "Имя администратора")

	flag.Parse()

	// Проверяем обязательные параметры
	if *login == "" || *password == "" || *name == "" {
		log.Fatal("Ошибка: Не указаны обязательные параметры --login, --password или --name")
	}

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	configPath := "config/config.yaml"
	config.LoadConfig(configPath)

	err = config.InitDB()
	if err != nil {
		log.Fatalf("Ошибка инициализации базы данных: %v", err)
	}
	err = models.CreateWorkersTable(config.DB)
	if err != nil {
		log.Fatalf("Ошибка создания таблицы работников: %v", err)
	}

	if config.DB == nil {
		log.Fatal("Подключение к БД не установлено")
	}

	// Создаем экземпляр администратора
	admin := models.Worker{
		Login:    *login,
		Password: *password,
		Name:     *name,
		Role:     "admin",
	}

	repos := repositories.InitRepos(config.DB)

	_, err = repos.WorkerRepository.Create(&admin)

	if err != nil {
		log.Fatalf("Не удалось создать администратора: %v", err)
	}

	log.Println("Администратор успешно создан!")
}
