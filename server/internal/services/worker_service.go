package services

import (
	"net/http"
	"strconv"

	"project_backend/internal/models"
	"project_backend/internal/repositories"
	"project_backend/pkg"

	"github.com/gin-gonic/gin"
)

type WorkerService struct {
	Repo *repositories.WorkerRepository
}

func NewWorkerService(repo *repositories.WorkerRepository) *WorkerService {
	return &WorkerService{Repo: repo}
}

// GetAllWorkers обрабатывает запрос на получение всех работников
func (s *WorkerService) GetAll(c *gin.Context) {
	workers, err := s.Repo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось получить всех работников",
		})
		return
	}
	c.JSON(http.StatusOK, workers)
}

// GetWorkerByID обрабатывает запрос на получение работника по ID
func (s *WorkerService) GetByID(c *gin.Context) {
	id := c.Param("id")
	workerID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}

	worker, err := s.Repo.GetByID(uint(workerID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Работник не найден",
		})
		return
	}
	c.JSON(http.StatusOK, worker)
}

// CreateWorker обрабатывает запрос на создание работника
func (s *WorkerService) Create(c *gin.Context) {
	var input struct {
		Login    string `json:"login" binding:"required,min=1"`
		Password string `json:"password" binding:"required,min=1"`
		Name     string `json:"name" binding:"required,min=1"`
		Role     string `json:"role" binding:"required,oneof=admin storage intern manager director"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат запроса",
		})
		return
	}

	workerIn := models.Worker{
		Login:    input.Login,
		Password: input.Password,
		Name:     input.Name,
		Role:     input.Role,
	}

	if err := workerIn.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Ошибка валидации: " + err.Error(),
		})
		return
	}

	if workerIn.Role == "admin" {
		workers, err := s.Repo.GetAll()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Ошибка при получении всех работников",
			})
			return
		}
		for _, w := range workers {
			if w.Role == "admin" {
				c.JSON(http.StatusBadRequest, gin.H{
					"error": "Уже есть администратор",
				})
				return
			}
		}
	}

	hashedPassword, err := pkg.HashPassword(workerIn.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Ошибка при хешировании пароля",
		})
		return
	}
	workerIn.Password = hashedPassword

	_, err = s.Repo.Create(&workerIn)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось создать работника: " + err.Error(),
		})
		return
	}
	c.JSON(http.StatusCreated, "Работник успешно создан")
}

// UpdateWorker обрабатывает запрос на обновление работника
func (s *WorkerService) Update(c *gin.Context) {
	var updatedWorkerIn models.Worker
	if err := c.ShouldBindJSON(&updatedWorkerIn); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат работника",
		})
		return
	}

	if updatedWorkerIn.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "ID работника не указан",
		})
		return
	}

	if err := updatedWorkerIn.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Ошибка валидации: " + err.Error(),
		})
		return
	}

	updatedWorkerOut, err := s.Repo.Update(&updatedWorkerIn)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось обновить работника",
		})
		return
	}
	c.JSON(http.StatusOK, updatedWorkerOut)
}

// DeleteWorker обрабатывает запрос на удаление работника
func (s *WorkerService) Delete(c *gin.Context) {
	id := c.Param("id")
	workerID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат ID",
		})
		return
	}

	err = s.Repo.Delete(uint(workerID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось удалить работника",
		})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}
