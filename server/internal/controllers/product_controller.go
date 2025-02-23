package controllers

import (
	"fmt"
	"net/http"
	"project_backend/internal/models"
	"project_backend/internal/services"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetAllProducts(c *gin.Context) {
	products, err := services.GetAllProducts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить все продукты",
		})
		return
	}
	c.JSON(http.StatusOK, products)
}

func GetProductByID(c *gin.Context) {
	id := c.Param("id")
	productID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}
	product, err := services.GetProductByID(uint(productID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Продукт не найден",
		})
		return
	}
	c.JSON(http.StatusOK, product)
}

func CreateProduct(c *gin.Context) {
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
	fmt.Printf("productIn: %+v\n", productIn)
	productOut, err := services.CreateProduct(&productIn)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось создать продукт: " + err.Error(),
		})
		return
	}
	c.JSON(http.StatusCreated, productOut)
}

func UpdateProduct(c *gin.Context) {

	var updatedProductIn models.Product
	if err := c.ShouldBind(&updatedProductIn); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат продукта",
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

	updatedProductOut, err := services.UpdateProduct(&updatedProductIn)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось обновить продукт: " + err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, updatedProductOut)
}

func DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	productID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}

	err = services.DeleteProduct(uint(productID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось удалить продукт",
		})
		return
	}
	c.JSON(http.StatusOK, "Продукт успешно удален")
}

func UpdateQuantity(c *gin.Context) {
	id := c.Param("id")
	productID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}
	// quantity from body as json
	var request struct {
		Quantity int `json:"quantity" binding:"required,min=1"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат запроса",
		})
		return
	}
	err = services.UpdateQuantity(uint(productID), request.Quantity)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось обновить количество продукта",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Количество продукта успешно обновлено",
	})
}
