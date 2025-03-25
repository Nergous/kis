package config

import (
	"fmt"
	"log"
	"os"
	"project_backend/cmd/cron"

	"strconv"

	"gopkg.in/yaml.v3"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Config struct {
	App struct {
		Port int `yaml:"port"`
	} `yaml:"app"`

	Database struct {
		Host     string `yaml:"host"`
		Port     int    `yaml:"port"`
		Username string `yaml:"username"`
		Password string `yaml:"password"`
		DBName   string `yaml:"dbname"`
		Driver   string `yaml:"driver"`
	} `yaml:"database"`
}

var AppConfig *Config
var DB *gorm.DB

func LoadConfig(path string) {
	data, err := os.ReadFile(path)
	if err != nil {
		log.Fatalf("Failed to read config file: %v", err)
	}

	AppConfig = &Config{}
	err = yaml.Unmarshal(data, AppConfig)
	if err != nil {
		log.Fatalf("Failed to parse config file: %v", err)
	}

	overrideWithEnv()

	fmt.Println("Config loaded:", AppConfig)
}

func overrideWithEnv() {
	if port := os.Getenv("PORT"); port != "" {
		AppConfig.App.Port, _ = strconv.Atoi(port)
	}
	if dbHost := os.Getenv("DB_HOST"); dbHost != "" {
		AppConfig.Database.Host = dbHost
	}
	if dbPort := os.Getenv("DB_PORT"); dbPort != "" {
		AppConfig.Database.Port, _ = strconv.Atoi(dbPort)
	}
	if dbUser := os.Getenv("DB_USER"); dbUser != "" {
		AppConfig.Database.Username = dbUser
	}
	if dbPass := os.Getenv("DB_PASSWORD"); dbPass != "" {
		AppConfig.Database.Password = dbPass
	}
	if dbName := os.Getenv("DB_NAME"); dbName != "" {
		AppConfig.Database.DBName = dbName
	}
	if dbDriver := os.Getenv("DB_DRIVER"); dbDriver != "" {
		AppConfig.Database.Driver = dbDriver
	}
}

func InitDB() error {
	dsnWithoutDB := fmt.Sprintf("%s:%s@tcp(%s:%d)/?charset=utf8mb4&parseTime=True&loc=Local",
		AppConfig.Database.Username,
		AppConfig.Database.Password,
		AppConfig.Database.Host,
		AppConfig.Database.Port,
	)

	// Подключение к серверу MySQL
	db, err := gorm.Open(mysql.Open(dsnWithoutDB), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("не удалось подключиться к серверу MySQL: %w", err)
	}

	// Проверка существования базы данных
	var exists int
	err = db.Raw("SELECT COUNT(*) FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?", AppConfig.Database.DBName).Scan(&exists).Error
	if err != nil {
		return fmt.Errorf("не удалось проверить существование базы данных: %w", err)
	}

	// Создание базы данных, если она не существует
	if exists == 0 {
		err = db.Exec(fmt.Sprintf("CREATE DATABASE %s", AppConfig.Database.DBName)).Error
		if err != nil {
			return fmt.Errorf("не удалось создать базу данных: %w", err)
		}
		log.Printf("База данных %s успешно создана.", AppConfig.Database.DBName)
	}

	// Подключение к конкретной базе данных
	dsn := GetDSN()
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("не удалось подключиться к базе данных: %w", err)
	}

	DB = db
	cron.SetupDebtChecker(db)
	log.Println("Подключение к базе данных успешно установлено.")
	return nil
}

func GetDSN() string {
	return fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		AppConfig.Database.Username,
		AppConfig.Database.Password,
		AppConfig.Database.Host,
		AppConfig.Database.Port,
		AppConfig.Database.DBName,
	)
}
