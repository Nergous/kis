package services

import (
	"net/http"
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

	err = s.repo.Delete(uint(contractID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось удалить контракт",
		})
		return
	}

	c.JSON(http.StatusOK, "Контракт успешно удален")
}
