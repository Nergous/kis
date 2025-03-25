package services

import (
	"net/http"
	"project_backend/internal/models"
	"project_backend/internal/repositories"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ProductMovingService struct {
	productMovingRepository *repositories.ProductMovingRepository
}

func NewProductMovingService(productMovingRepository *repositories.ProductMovingRepository) *ProductMovingService {
	return &ProductMovingService{productMovingRepository: productMovingRepository}
}

func (s *ProductMovingService) GetAll(c *gin.Context) {
	productMovings, err := s.productMovingRepository.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить список перемещений продуктов",
		})
		return
	}

	c.JSON(http.StatusOK, productMovings)
}

func (s *ProductMovingService) GetByID(c *gin.Context) {
	id := c.Param("id")
	productMovingID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}

	productMoving, err := s.productMovingRepository.GetByID(uint(productMovingID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Перемещение продукта не найдено",
		})
		return
	}

	c.JSON(http.StatusOK, productMoving)
}

func (s *ProductMovingService) Create(c *gin.Context) {
	var productMoving models.ProductMoving
	if err := c.ShouldBindJSON(&productMoving); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{})
	}

	productMovingOut, err := s.productMovingRepository.Create(&productMoving)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось создать перемещение продукта",
		})
		return
	}

	c.JSON(http.StatusCreated, productMovingOut)
}

func (s *ProductMovingService) Update(c *gin.Context) {
	var productMoving models.ProductMoving
	if err := c.ShouldBindJSON(&productMoving); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{})
	}

	productMovingOut, err := s.productMovingRepository.Update(&productMoving)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось обновить перемещение продукта",
		})
		return
	}

	c.JSON(http.StatusOK, productMovingOut)
}

func (s *ProductMovingService) Delete(c *gin.Context) {
	id := c.Param("id")
	productMovingID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}

	err = s.productMovingRepository.Delete(uint(productMovingID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось удалить перемещение продукта",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Перемещение продукта успешно удалено",
	})
}
