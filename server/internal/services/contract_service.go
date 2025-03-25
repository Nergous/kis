package services

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"project_backend/internal/models"
	"project_backend/internal/repositories"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ContractService struct {
	repo         *repositories.ContractRepository
	quantityRepo *repositories.ContractQuantityRepository
}

func NewContractService(repo *repositories.ContractRepository, quantityRepo *repositories.ContractQuantityRepository) *ContractService {
	return &ContractService{repo: repo, quantityRepo: quantityRepo}
}

func (s *ContractService) GetAll(c *gin.Context) {
	contracts, err := s.repo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить список контрактов" + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, contracts)
}

func (s *ContractService) GetByOrderID(c *gin.Context) {
	orderIDStr := c.Param("id")
	orderID, err := strconv.ParseUint(orderIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}

	contracts, err := s.repo.GetByOrderID(uint(orderID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить список контрактов",
		})
		return
	}

	c.JSON(http.StatusOK, contracts)
}

func (s *ContractService) GetByID(c *gin.Context) {
	id := c.Param("id")
	contractID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}

	contract, err := s.repo.GetByID(uint(contractID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить контракт",
		})
		return
	}

	c.JSON(http.StatusOK, contract)
}

func (s *ContractService) Create(c *gin.Context) {
	var contract models.Contract
	if err := c.ShouldBindJSON(&contract); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{})
	}

	contractOut, err := s.repo.Create(&contract)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось создать контракт",
		})
		return
	}

	_, err = s.quantityRepo.Create(contract.ContractType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось создать количество контрактов",
		})
		return
	}

	c.JSON(http.StatusOK, contractOut)
}

func (s *ContractService) Delete(c *gin.Context) {
	id := c.Param("id")
	contractID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}

	err = s.repo.DeleteAll(uint(contractID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось удалить контракт",
		})
		return
	}

	c.JSON(http.StatusOK, "Контракт успешно удален")
}

func (s *ContractService) DownloadContractFile(c *gin.Context) {
	idParam := c.Param("id")
	contractID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
	}

	contract, err := s.repo.GetByID(uint(contractID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Контракт не найден",
		})
		return
	}

	// Проверяем наличие пути к файлу
	if contract.FilePath == "" {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Файл контракта не найден",
		})
		return
	}

	// get current directory
	cwd, err := os.Getwd()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{})
	}

	fullPath := filepath.Join(cwd, "..", "client", "public", contract.FilePath)
	// if _, err := os.Stat(fullPath); os.IsNotExist(err) {
	// 	c.JSON(http.StatusNotFound, gin.H{
	// 		"error": "Файл контракта не существует на сервере",
	// 	})
	// 	return
	// }
	c.Header("Content-Disposition", "attachment; filename=contract_"+idParam+".docx")
	c.Header("Cache-Control", "public, max-age=86400") // Кешировать на 1 день
	log.Printf("Serving contract file: %s (ID: %d)", fullPath, contractID)
	c.File(fullPath)
}
