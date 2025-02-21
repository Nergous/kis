package middleware

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// Logger представляет глобальный экземпляр логгера
var Logger *zap.SugaredLogger

// InitLogger инициализирует логгер с заданным уровнем логирования
func InitLogger(level string) {
	// Конфигурация логгера
	config := zap.NewProductionConfig()
	config.Encoding = "console" // Используем консольный формат для удобства разработки
	config.Level.SetLevel(parseLogLevel(level))
	config.OutputPaths = []string{"stdout", "logs/app.log"} // Логи будут записываться в stdout и файл
	config.ErrorOutputPaths = []string{"stderr", "logs/error.log"}

	// Создаем логгер
	logger, err := config.Build()
	if err != nil {
		panic(err)
	}

	// Устанавливаем SugaredLogger для более простого синтаксиса
	Logger = logger.Sugar()

	// Очистка ресурсов при завершении программы
	defer func() {
		_ = logger.Sync()
	}()

}

// parseLogLevel преобразует строку уровня логирования в zapcore.Level
func parseLogLevel(level string) zapcore.Level {
	switch level {
	case "debug":
		return zap.DebugLevel
	case "info":
		return zap.InfoLevel
	case "warn":
		return zap.WarnLevel
	case "error":
		return zap.ErrorLevel
	case "dpanic":
		return zap.DPanicLevel
	case "panic":
		return zap.PanicLevel
	case "fatal":
		return zap.FatalLevel
	default:
		return zap.InfoLevel
	}
}

// LogMiddleware создает middleware для логирования HTTP-запросов
func LogMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path

		c.Next()

		// Логирование деталей запроса
		latency := time.Since(start)
		status := c.Writer.Status()
		clientIP := c.ClientIP()
		userAgent := c.Request.UserAgent()

		logMessage := fmt.Sprintf(
			"HTTP request: %-7v %-25v | Status: %-3v | Latency: %-10v | IP: %-15v | User-Agent: %v",
			c.Request.Method,
			path,
			status,
			latency,
			clientIP,
			userAgent,
		)

		Logger.Infof(logMessage)
	}
}
