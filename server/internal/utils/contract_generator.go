package utils

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"project_backend/internal/models"
	"time"
)

type ContractData struct {
	Address        string         `json:"address"`
	DeliveryDate   string         `json:"delivery_date"`
	PaymentTerms   string         `json:"payment_terms"`
	TotalPrice     float64        `json:"total_price"`
	RecipientPhone string         `json:"recipient_phone"`
	OrderContent   []OrderContent `json:"order_content"`
}

type InvoiceData struct {
	OrderID        string         `json:"order_id"`
	Address        string         `json:"address"`
	DeliveryDate   string         `json:"delivery_date"`
	RecipientPhone string         `json:"recipient_phone"`
	TotalPrice     float64        `json:"total_price"`
	OrderContent   []OrderContent `json:"order_content"`
}

type OrderContent struct {
	ProductID         uint    `json:"product_id"`
	ProductName       string  `json:"product_name"`
	Quantity          int     `json:"quantity"`
	Price             float64 `json:"price"`
	TotalProductPrice float64 `json:"total_product_price"`
}

type ReceiptData struct {
	OrderID      string                `json:"order_id"`
	Customer     models.Customer       `json:"customer"`
	PaymentTime  string                `json:"payment_time"`
	Amount       float64               `json:"amount"`
	PaymentTerms string                `json:"payment_terms"`
	TotalPrice   float64               `json:"total_price"`
	OrderContent []models.OrderContent `json:"order_content"`
}

type AcceptanceActData struct {
	OrderID        string          `json:"order_id"`
	Customer       models.Customer `json:"customer"`
	Address        string          `json:"address"`
	DeliveryDate   string          `json:"delivery_date"`
	RecipientPhone string          `json:"recipient_phone"`
	PaymentTerms   string          `json:"payment_terms"`
	TotalPrice     float64         `json:"total_price"`
	OrderContent   []OrderContent  `json:"order_content"`
	AcceptanceDate string          `json:"acceptance_date"`
}

// GenerateContract создает договор поставки
func GenerateContract(data ContractData) (string, error) {
	deliveryTime, err := time.Parse(time.RFC3339, data.DeliveryDate)
	if err != nil {
		return "", fmt.Errorf("failed to parse payment time: %v", err)
	}
	data.DeliveryDate = deliveryTime.UTC().Format("2006-01-02T15:04:05Z")
	return generateDocument(
		"generate_contract.py",
		"contracts/orders",
		"contract",
		data,
	)
}

// GenerateInvoice создает товарную накладную
func GenerateInvoice(data InvoiceData) (string, error) {
	return generateDocument(
		"generate_invoice.py",
		"contracts/invoices",
		"invoice",
		data,
	)
}

func GenerateReceipt(data ReceiptData) (string, error) {
	paymentTime, err := time.Parse(time.RFC3339, data.PaymentTime)
	if err != nil {
		return "", fmt.Errorf("failed to parse payment time: %v", err)
	}
	data.PaymentTime = paymentTime.UTC().Format("2006-01-02T15:04:05Z")
	return generateDocument(
		"generate_receipt.py",
		"contracts/receipts",
		"receipt",
		data,
	)
}
func GenerateAcceptanceAct(data AcceptanceActData) (string, error) {
	return generateDocument(
		"generate_acceptance_act.py",
		"contracts/acceptance_acts",
		"acceptance_act",
		data,
	)
}

// generateDocument общая функция для генерации документов
func generateDocument(
	scriptName string, // название python-скрипта
	subDir string, // подпапка для сохранения (относительно client/public/contracts)
	filePrefix string, // префикс имени файла
	data interface{}, // данные для документа
) (string, error) {
	// Получаем текущую рабочую директорию (server/internal/utils)
	currentDir, err := os.Getwd()
	if err != nil {
		return "", fmt.Errorf("failed to get current directory: %v", err)
	}

	// Путь к скрипту (server/scripts)
	scriptPath := filepath.Join(
		currentDir, // поднимаемся на два уровня вверх (server)
		"scripts",
		scriptName,
	)

	// Путь для сохранения (client/public/contracts/[subDir])
	outputDir := filepath.Join(
		filepath.Dir(currentDir), // поднимаемся до корня проекта
		"client",
		"public",
		"uploads",
		subDir,
	)

	// Создаем директорию если ее нет
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		return "", fmt.Errorf("failed to create output directory: %v", err)
	}

	// Генерируем уникальное имя файла
	filename := fmt.Sprintf("%s_%d.docx", filePrefix, time.Now().Unix())
	fullOutputPath := filepath.Join(outputDir, filename)

	// Конвертируем данные в JSON
	jsonData, err := json.Marshal(data)
	if err != nil {
		return "", fmt.Errorf("failed to marshal document data: %v", err)
	}

	// Выполняем python-скрипт
	cmd := exec.Command("python", scriptPath, string(jsonData), fullOutputPath)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf(
			"failed to generate document: %v, output: %s",
			err,
			string(output),
		)
	}

	// Возвращаем относительный путь от public
	return filepath.Join("uploads", subDir, filename), nil
}
