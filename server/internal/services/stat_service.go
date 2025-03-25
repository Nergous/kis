package services

import (
	"net/http"
	"project_backend/internal/repositories"

	"github.com/gin-gonic/gin"
)

type StatService struct {
	repo *repositories.StatRepository
}

func NewStatService(repo *repositories.StatRepository) *StatService {
	return &StatService{repo: repo}
}

func (s *StatService) GetOrdersCountByStatus(c *gin.Context) {
	status := c.Query("status")
	count := s.repo.GetOrdersCountByStatus(status)
	c.JSON(http.StatusOK, gin.H{"count": count})
}

func (s *StatService) GetWorkersCount(c *gin.Context) {
	count := s.repo.GetWorkersCount()
	c.JSON(http.StatusOK, gin.H{"count": count})
}

func (s *StatService) GetCustomersCount(c *gin.Context) {
	count := s.repo.GetCustomersCount()
	c.JSON(http.StatusOK, gin.H{"count": count})
}

func (s *StatService) GetProductsCount(c *gin.Context) {
	count := s.repo.GetProductsCount()
	c.JSON(http.StatusOK, gin.H{"count": count})
}
