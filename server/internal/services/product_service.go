package services

import (
	"net/http"
	"os"
	"project_backend/internal/models"
	"project_backend/internal/repositories"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ProductService struct {
	repo *repositories.ProductRepository
	move *repositories.ProductMovingRepository
}

func NewProductService(
	repo *repositories.ProductRepository,
	move *repositories.ProductMovingRepository,
) *ProductService {
	return &ProductService{repo: repo, move: move}
}

func (s *ProductService) GetAll(c *gin.Context) {
	products, err := s.repo.GetAll()
	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить все продукты",
		})
		return
	}
	c.JSON(http.StatusOK, products)
}

func (s *ProductService) GetByID(c *gin.Context) {
	id := c.Param("id")
	productID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}
	product, err := s.repo.GetByID(uint(productID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Продукт не найден",
		})
		return
	}
	c.JSON(http.StatusOK, product)
}

func (s *ProductService) Create(c *gin.Context) {
	var productIn models.Product

	if err := c.ShouldBind(&productIn); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат продукта",
		})
		return
	}
	filePath, exists := c.Get("uploaded_file_path")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Файл не найден",
		})
		return
	}
	productIn.ImgPath = filePath.(string)

	if err := productIn.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Ошибка валидации: " + err.Error(),
		})
	}

	productOut, err := s.repo.Create(&productIn)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось создать продукт: " + err.Error(),
		})
		return
	}

	_, err = s.move.Create(&models.ProductMoving{
		MovingType: "in",
		ProductID:  productOut.ID,
		Count:      uint(productIn.Quantity),
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось создать перемещение продукта: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, productOut)
}

func (s *ProductService) Update(c *gin.Context) {
	var updatedProductIn models.Product

	if err := c.ShouldBind(&updatedProductIn); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	if updatedProductIn.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "ID продукта не указан",
		})
		return
	}

	filePath, exists := c.Get("uploaded_file_path")
	if !exists {
		filePath = updatedProductIn.ImgPath
	}
	updatedProductIn.ImgPath = filePath.(string)

	if err := updatedProductIn.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Ошибка валидации: " + err.Error(),
		})
	}

	existingProduct, err := s.repo.GetByID(updatedProductIn.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить продукт: " + err.Error(),
		})
	}

	if updatedProductIn.ImgPath != existingProduct.ImgPath && existingProduct.ImgPath != "" {
		err = os.Remove(existingProduct.ImgPath)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Не удалось удалить старый файл: " + err.Error(),
			})
		}
	}

	updatedProductOut, err := s.repo.Update(&updatedProductIn)

	difference := updatedProductIn.Quantity - existingProduct.Quantity

	if difference < 0 {
		_, err = s.move.Create(&models.ProductMoving{
			MovingType: "out",
			ProductID:  updatedProductIn.ID,
			Count:      uint(-difference),
		})
	} else if difference > 0 {
		_, err = s.move.Create(&models.ProductMoving{
			MovingType: "in",
			ProductID:  updatedProductIn.ID,
			Count:      uint(difference),
		})
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось обновить продукт: " + err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, updatedProductOut)
}

func (s *ProductService) Delete(c *gin.Context) {
	id := c.Param("id")
	productID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}
	product, err := s.repo.GetByID(uint(productID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить продукт: " + err.Error(),
		})
	}
	if product.ImgPath != "" {
		err := os.Remove(product.ImgPath)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Не удалось удалить файл: " + err.Error(),
			})
		}
	}
	err = s.repo.Delete(uint(productID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось удалить продукт: " + err.Error(),
		})
	}
	c.JSON(http.StatusOK, "Продукт успешно удален")
}

func (s *ProductService) UpdateQuantity(c *gin.Context) {
	id := c.Param("id")
	productID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}
	var request struct {
		Quantity int `json:"quantity" binding:"required,min=1"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат запроса",
		})
		return
	}
	product, err := s.repo.GetByID(uint(productID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить продукт: " + err.Error(),
		})
	}

	product.Quantity += request.Quantity
	_, err = s.repo.Update(product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось обновить количество продукта",
		})
		return
	}

	_, err = s.move.Create(&models.ProductMoving{
		MovingType: "in",
		ProductID:  uint(productID),
		Count:      uint(request.Quantity),
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось создать перемещение продукта",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Количество продукта успешно обновлено",
	})
}

func (s *ProductService) UpdatePrice(c *gin.Context) {
	id := c.Param("id")
	productID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}
	var request struct {
		Price float64 `json:"price" binding:"required,min=0.01"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат запроса",
		})
		return
	}
	product, err := s.repo.GetByID(uint(productID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить продукт: " + err.Error(),
		})
	}

	product.Price = request.Price
	_, err = s.repo.Update(product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось обновить цену продукта",
		})
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Цена продукта успешно обновлена",
	})
}
