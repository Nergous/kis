package repositories

import "gorm.io/gorm"

type ReposContainer struct {
	PaymentCharRepository      *PaymentCharRepository
	CustomerRepository         *CustomerRepository
	WorkerRepository           *WorkerRepository
	ProductRepository          *ProductRepository
	OrderRepository            *OrderRepository
	PaymentRepository          *PaymentRepository
	ProductMovingRepository    *ProductMovingRepository
	StatRepository             *StatRepository
	ContractRepository         *ContractRepository
	ContractQuantityRepository *ContractQuantityRepository
}

func InitRepos(DB *gorm.DB) *ReposContainer {
	return &ReposContainer{
		PaymentCharRepository:      NewPaymentCharRepository(DB),
		CustomerRepository:         NewCustomerRepository(DB),
		WorkerRepository:           NewWorkerRepository(DB),
		ProductRepository:          NewProductRepository(DB),
		OrderRepository:            NewOrderRepository(DB),
		PaymentRepository:          NewPaymentRepository(DB),
		ProductMovingRepository:    NewProductMovingRepository(DB),
		StatRepository:             NewStatRepository(DB),
		ContractRepository:         NewContractRepository(DB),
		ContractQuantityRepository: NewContractQuantityRepository(DB),
	}
}
