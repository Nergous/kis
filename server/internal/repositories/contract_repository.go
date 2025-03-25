package repositories

import (
	"fmt"
	"project_backend/internal/models"
	"sort"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ContractRepository struct {
	db *gorm.DB
}

func NewContractRepository(db *gorm.DB) *ContractRepository {
	return &ContractRepository{db: db}
}

func (r *ContractRepository) GetAll() (gin.H, error) {
	// Получаем контракты с предзагруженной информацией о заказе
	var contracts []struct {
		models.Contract
		OrderIDUnique uint `gorm:"column:order_id_unique" json:"-"`
	}

	if err := r.db.
		Model(&models.Contract{}).
		Joins("JOIN orders ON contracts.order_id = orders.id").
		Select("contracts.*, orders.order_id as order_id_unique").
		Order("orders.order_id, contracts.id").
		Find(&contracts).Error; err != nil {
		return nil, err
	}

	// Группируем контракты по order_id_unique
	grouped := make(map[uint][]gin.H)
	for _, contract := range contracts {
		doc := gin.H{
			"ID":        fmt.Sprintf("%d", contract.ID),
			"type":      contract.ContractType,
			"file_path": contract.FilePath,
		}

		grouped[contract.OrderIDUnique] = append(grouped[contract.OrderIDUnique], doc)
	}

	// Преобразуем в нужную структуру ответа
	var result []gin.H
	for orderIDUnique, docs := range grouped {
		result = append(result, gin.H{
			"order_id": fmt.Sprintf("%d", orderIDUnique), // Используем order_id_unique из таблицы orders
			"docs":     docs,
		})
	}

	// Сортируем результат по order_id_unique
	sort.Slice(result, func(i, j int) bool {
		orderID1, _ := strconv.Atoi(result[i]["order_id"].(string))
		orderID2, _ := strconv.Atoi(result[j]["order_id"].(string))
		return orderID1 < orderID2
	})

	return gin.H{"docs": result}, nil
}

func (r *ContractRepository) GetByID(id uint) (*models.Contract, error) {
	var contract models.Contract
	if err := r.db.First(&contract, id).Error; err != nil {
		return nil, err
	}
	return &contract, nil
}

func (r *ContractRepository) GetByOrderID(orderID uint) ([]models.Contract, error) {
	var contracts []models.Contract
	if err := r.db.Where("order_id = ?", orderID).Find(&contracts).Error; err != nil {
		return nil, err
	}
	return contracts, nil
}

func (r *ContractRepository) Create(contract *models.Contract) (*models.Contract, error) {
	return contract, r.db.Create(contract).Error
}

func (r *ContractRepository) Update(contract *models.Contract) (*models.Contract, error) {
	return contract, r.db.Save(contract).Error
}

func (r *ContractRepository) Delete(order_id uint, doc_type string) error {
	return r.db.Where("order_id = ? AND contract_type = ?", order_id, doc_type).Delete(&models.Contract{}).Error
}

func (r *ContractRepository) DeleteAll(order_id uint) error {
	return r.db.Where("order_id = ?", order_id).Delete(&models.Contract{}).Error
}
