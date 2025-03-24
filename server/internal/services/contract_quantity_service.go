package services

import (
	"net/http"
	"project_backend/internal/repositories"

	"github.com/gin-gonic/gin"
)

type ContractQuantityService struct {
	repo *repositories.ContractQuantityRepository
}

func NewContractQuantityService(repo *repositories.ContractQuantityRepository) *ContractQuantityService {
	return &ContractQuantityService{repo: repo}
}

func (s *ContractQuantityService) GetAll(c *gin.Context) {
	contractQuantities, err := s.repo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить список контрактов",
		})
		return
	}

	c.JSON(http.StatusOK, contractQuantities)
}
