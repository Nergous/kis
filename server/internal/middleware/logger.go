package middleware

import (
	"fmt"
	"os"
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
	appEncoderConfig := zap.NewProductionEncoderConfig()
	appEncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	// check if app.log and error.log exist and create them if they don't
	if _, err := os.Stat("logs/app.log"); os.IsNotExist(err) {
		file, err := os.Create("logs/app.log")
		if err != nil {
			panic(err)
		}
		file.Close()
	}

	if _, err := os.Stat("logs/error.log"); os.IsNotExist(err) {
		file, err := os.Create("logs/error.log")
		if err != nil {
			panic(err)
		}
		file.Close()
	}
	appCore := zapcore.NewCore(
		zapcore.NewJSONEncoder(appEncoderConfig),
		zapcore.NewMultiWriteSyncer(
			zapcore.AddSync(os.Stdout),
			zapcore.AddSync(getFile("logs/app.log")),
		),
		parseLogLevel(level),
	)

	errorEncoderConfig := zap.NewProductionEncoderConfig()
	errorEncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	errorCore := zapcore.NewCore(
		zapcore.NewJSONEncoder(errorEncoderConfig),
		zapcore.NewMultiWriteSyncer(
			zapcore.AddSync(os.Stderr),
			zapcore.AddSync(getFile("logs/error.log")),
		),
		zap.ErrorLevel,
	)

	core := zapcore.NewTee(appCore, errorCore)

	// Создаем логгер
	logger := zap.New(core)
	defer logger.Sync()

	// Устанавливаем SugaredLogger для более простого синтаксиса
	Logger = logger.Sugar()

	Logger.Infow("Логгер инициализирован",
		"level", level,
		"time", time.Now().Format(time.RFC3339),
	)

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

func getFile(filename string) *os.File {
	f, err := os.OpenFile(filename, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err != nil {
		panic(fmt.Sprintf("Не удалось создать файл логов %s: %v", filename, err))
	}
	return f
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
