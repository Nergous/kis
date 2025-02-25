package middleware

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func UploadImage(saveDir string) gin.HandlerFunc {
	return func(c *gin.Context) {
		file, header, err := c.Request.FormFile("product_image")
		// if no image in request then skip
		if err == http.ErrMissingFile || c.Request.MultipartForm == nil {
			c.Next()
			return
		}
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			c.Abort()
			return
		}
		defer file.Close()

		fileType := header.Header.Get("Content-Type")
		if !isValidImage(fileType) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный формат изображения"})
			c.Abort()
			return
		}

		fileExt := strings.ToLower(filepath.Ext(header.Filename))
		fileName := fmt.Sprintf("%d%s", time.Now().UnixNano(), fileExt)
		filePath := filepath.Join(saveDir, fileName)

		err = os.MkdirAll(saveDir, os.ModePerm)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось сохранить файл"})
			c.Abort()
			return
		}

		out, err := os.Create(filePath)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось сохранить файл"})
			c.Abort()
			return
		}
		defer out.Close()

		_, err = io.Copy(out, file)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось сохранить файл"})
			c.Abort()
			return
		}

		c.Set("uploaded_file_path", filePath)
		c.Next()
	}
}

func isValidImage(fileType string) bool {
	validTypes := []string{"image/jpeg", "image/png", "image/gif"}
	for _, vt := range validTypes {
		if vt == fileType {
			return true
		}
	}
	return false
}
