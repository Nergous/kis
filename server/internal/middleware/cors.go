package middleware

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// CorsMiddleware настраивает правила CORS
func CorsMiddleware() gin.HandlerFunc {
	config := cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},                            // Разрешенные домены
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}, // Разрешенные HTTP-методы
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},          // Разрешенные заголовки
		ExposeHeaders:    []string{"Content-Length"},                                   // Заголовки, доступные клиенту
		AllowCredentials: true,                                                         // Разрешить передачу cookies и авторизационных данных
		MaxAge:           12 * time.Hour,                                               // Максимальный возраст кэшированных предварительных запросов (preflight requests)
	}

	return cors.New(config)
}
