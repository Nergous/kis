package services

import "project_backend/internal/repositories"

type ServicesContainer struct {
	CustomerService      *CustomerService
	WorkerService        *WorkerService
	AuthService          *AuthService
	ProductService       *ProductService
	ProductMovingService *ProductMovingService
	OrderService         *OrderService
	PaymentService       *PaymentService
	StatService          *StatService
	ContractService      *ContractService
}

func InitServices(repos *repositories.ReposContainer) *ServicesContainer {
	return &ServicesContainer{
		CustomerService:      NewCustomerService(repos.CustomerRepository),
		WorkerService:        NewWorkerService(repos.WorkerRepository),
		AuthService:          NewAuthService(repos.CustomerRepository, repos.WorkerRepository),
		ProductService:       NewProductService(repos.ProductRepository, repos.ProductMovingRepository),
		ProductMovingService: NewProductMovingService(repos.ProductMovingRepository),
		OrderService:         NewOrderService(repos.OrderRepository, repos.ProductRepository, repos.ProductMovingRepository),
		PaymentService:       NewPaymentService(repos.PaymentRepository),
		StatService:          NewStatService(repos.StatRepository),
		ContractService:      NewContractService(repos.ContractRepository),
	}
}
