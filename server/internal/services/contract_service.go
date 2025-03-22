package services

import (
	"net/http"
	"project_backend/internal/models"
	"project_backend/internal/repositories"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ContractService struct {
	repo *repositories.ContractRepository
}

func NewContractService(repo *repositories.ContractRepository) *ContractService {
	return &ContractService{repo: repo}
}

func (s *ContractService) GetAll(c *gin.Context) {
	contracts, err := s.repo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить список контрактов",
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

	c.JSON(http.StatusOK, contractOut)
}

func (s *ContractService) Update(c *gin.Context) {
	id := c.Param("id")
	contractID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}

	_, err = s.repo.GetByID(uint(contractID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить контракт",
		})
		return
	}

	var contract models.Contract
	if err := c.ShouldBindJSON(&contract); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{})
	}

	contractOut, err := s.repo.Update(&contract)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось обновить контракт",
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

	err = s.repo.Delete(uint(contractID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось удалить контракт",
		})
		return
	}

	c.JSON(http.StatusOK, "Контракт успешно удален")
}
