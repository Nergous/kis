package routes

import (
	"project_backend/internal/middleware"
	"project_backend/internal/services"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(services *services.ServicesContainer) *gin.Engine {
	r := gin.Default()

	authRepo := &middleware.AuthRepos{
		Customer: services.CustomerService.Repo,
		Worker:   services.WorkerService.Repo,
	}

	api := r.Group("/api", middleware.LogMiddleware(), middleware.HeaderAccessAllow())
	{
		api.GET("/products", services.ProductService.GetAll)
		api.POST("/login-customer", services.AuthService.LoginCustomer)

		api.POST("/register", services.AuthService.RegisterCustomer)
		api.POST("/login-worker", services.AuthService.LoginWorker)

		admin := api.Group("", middleware.AuthMiddleware(
			authRepo,
			[]string{"admin"}))
		{
			admin.GET("/workers", services.WorkerService.GetAll)
			admin.GET("/workers/:id", services.WorkerService.GetByID)
			admin.POST("/workers", services.WorkerService.Create)
			admin.PATCH("/workers", services.WorkerService.Update)
			admin.DELETE("/workers/:id", services.WorkerService.Delete)
		}

		director := api.Group("", middleware.AuthMiddleware(
			authRepo,
			[]string{"director", "manager", "storage", "accountant"}))
		{
			director.GET("/docs-count", services.ContractQuantityService.GetAll)

			director.GET("/docs", services.ContractService.GetAll)

			director.GET("/order-by-status", services.StatService.GetOrdersCountByStatus)
			director.GET("/workers-count", services.StatService.GetWorkersCount)
			director.GET("/customers-count", services.StatService.GetCustomersCount)
			director.GET("/products-count", services.StatService.GetProductsCount)
			director.GET("/payments", services.PaymentService.GetAll)
			director.GET("/payments/:id", services.PaymentService.GetByID)
		}

		protected := api.Group("", middleware.AuthMiddleware(
			authRepo,
			[]string{"customer", "manager", "storage"}))
		{
			protected.GET("/orders/:id", services.OrderService.GetByID)

			customer := protected.Group("", middleware.AuthMiddleware(
				authRepo,
				[]string{"customer"}))
			{
				customer.GET("/customer-lk", services.CustomerService.GetForLK)
				customer.GET("/customer-lk/orders", services.OrderService.GetByCustomerID)
				customer.POST("/orders", services.OrderService.Create)

				customer.POST("/payment", services.PaymentService.Create)
			}

			manager_customer := protected.Group("", middleware.AuthMiddleware(
				authRepo,
				[]string{"manager", "customer"}))
			{
				manager_customer.GET("/customers/:id", services.CustomerService.GetByID)
			}

			manager_storage := protected.Group("", middleware.AuthMiddleware(
				authRepo,
				[]string{"manager", "storage", "customer"}))
			{
				manager_storage.GET("/orders", services.OrderService.GetAll)
				manager_storage.PATCH("/orders/:id/status", services.OrderService.UpdateStatus)
				manager_storage.DELETE("/products/:id", services.ProductService.Delete)

				manager := manager_storage.Group("", middleware.AuthMiddleware(
					authRepo,
					[]string{"manager"}))
				{
					manager.GET("/customers", services.CustomerService.GetAll)
					manager.PATCH("/products/:id/price", services.ProductService.UpdatePrice)
					manager.PATCH("/orders/:id/change-price", services.OrderService.UpdatePrices)
					manager.PATCH("/customers", services.CustomerService.Update)
					manager.DELETE("/customers/:id", services.CustomerService.Delete)
				}

				storage := manager_storage.Group("", middleware.AuthMiddleware(
					authRepo,
					[]string{"storage"}))
				{
					storage.GET("/orders/in_assembly", services.OrderService.GetAllInAssembly)
					storage.POST("/products", middleware.UploadImage("../client/public/uploads"), services.ProductService.Create)
					storage.PATCH("/products", middleware.UploadImage("../client/public/uploads"), services.ProductService.Update)
					storage.PATCH("/products/:id/quantity", services.ProductService.UpdateQuantity)
				}
			}

		}
	}
	return r
}
