package middleware

import (
	"errors"
	"os"
	"slices"
	"strings"

	"project_backend/internal/repositories"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

// AuthMiddleware проверяет JWT-токен
func AuthMiddleware(availableRoles []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(401, gin.H{"error": "Требуется токен"})
			c.Abort()
			return
		}

		// Извлекаем токен из заголовка
		tokenString := strings.Split(authHeader, "Bearer ")
		if len(tokenString) != 2 {
			c.JSON(401, gin.H{"error": "Неверный формат токена"})
			c.Abort()
			return
		}

		// Проверяем токен
		token, err := jwt.Parse(tokenString[1], func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("неверный метод подписи")
			}
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.JSON(401, gin.H{"error": "Недействительный токен"})
			c.Abort()
			return
		}

		// Извлекаем claims из токена
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(401, gin.H{"error": "Неверные данные токена"})
			c.Abort()
			return
		}

		workerID := uint(claims["worker_id"].(float64)) // Преобразуем worker_id в uint
		role := claims["role"].(string)

		if !slices.Contains(availableRoles, role) {
			c.JSON(403, gin.H{"error": "Недостаточно прав"})
			c.Abort()
			return
		}

		// Получаем работника из базы данных
		worker, err := repositories.GetWorkerByID(workerID)
		if err != nil {
			c.JSON(401, gin.H{"error": "Работник не найден"})
			c.Abort()
			return
		}

		// Проверяем роль (если нужно)

		// Добавляем работника в контекст
		c.Set("worker", worker)
		c.Next()
	}
}

// GetAuthenticatedWorker возвращает информацию о текущем работнике
func GetAuthenticatedWorker(c *gin.Context) {
	worker, exists := c.Get("worker")
	if !exists {
		c.JSON(401, gin.H{"error": "Неавторизованный доступ"})
		return
	}

	c.JSON(200, gin.H{"worker": worker})
}
