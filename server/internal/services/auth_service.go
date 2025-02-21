package services

import (
	"errors"
	"fmt"
	"os"
	"time"

	"project_backend/internal/models"
	"project_backend/internal/repositories"
	"project_backend/pkg"

	"github.com/golang-jwt/jwt/v4"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET")) // Замените на ваш секретный ключ

func LoginWorker(login, password string) (string, error) {

	worker, err := repositories.GetWorkerByLogin(login)
	if err != nil {
		return "", errors.New("неправильный логин или пароль")
	}

	if err := pkg.CheckPasswordHash(password, worker.Password); err != nil {
		return "", errors.New("неправильный логин или пароль")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"worker_id": worker.ID,
		"role":      worker.Role,
		"exp":       time.Now().Add(time.Hour * 24).Unix(),
	})

	// Подписываем токен
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func RegisterCustomer(customerIn *models.Customer) (string, error) {
	// paymentOut, err := repositories.CreatePaymentChar(&paymentIn)
	// if err != nil {
	// 	return "", err
	// }
	passw, err := pkg.HashPassword(customerIn.Password)
	if err != nil {
		return "", fmt.Errorf("ошибка при хэшировании пароля: %w", err)
	}
	// customerIn.PaymentCharID = paymentOut.ID
	customerIn.Password = passw
	_, err = repositories.CreateCustomer(customerIn)
	if err != nil {
		return "", fmt.Errorf("ошибка при создании покупателя: %w", err)
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"role": "customer",
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", fmt.Errorf("ошибка при подписи хэша: %w", err)
	}
	return tokenString, nil
}
