package routes

import (
	"project_backend/internal/controllers"
	"project_backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()

	api := r.Group("/api", middleware.LogMiddleware(), middleware.HeaderAccessAllow())
	{
		api.GET("/products", controllers.GetAllProducts)
		api.POST("/login-customer", controllers.LoginCustomer)

		api.POST("/register", controllers.RegisterCustomer)
		api.POST("/login-worker", controllers.LoginWorker)

		admin := api.Group("", middleware.AuthMiddleware([]string{"admin"}))
		{
			admin.GET("/workers", controllers.GetAllWorkers)
			admin.GET("/workers/:id", controllers.GetWorkerByID)
			admin.POST("/workers", controllers.CreateWorker)
			admin.PATCH("/workers", controllers.UpdateWorker)
			admin.DELETE("/workers/:id", controllers.DeleteWorker)
		}

		protected := api.Group("", middleware.AuthMiddleware([]string{"customer", "manager", "storage"}))
		{
			protected.GET("/orders/:id", controllers.GetOrderByID)

			customer := protected.Group("", middleware.AuthMiddleware([]string{"customer"}))
			{
				customer.GET("/customer-lk", controllers.GetCustomerForLK)
				customer.GET("/customer-lk/orders", controllers.GetOrderByCustomer)
				customer.POST("/orders", controllers.CreateOrder)
			}

			manager_customer := protected.Group("", middleware.AuthMiddleware([]string{"manager", "customer"}))
			{
				manager_customer.GET("/customers/:id", controllers.GetCustomerByID)
			}

			manager_storage := protected.Group("", middleware.AuthMiddleware([]string{"manager", "storage"}))
			{
				manager_storage.GET("/orders", controllers.GetAllOrders)
				manager_storage.PATCH("/orders/:id/status", controllers.UpdateOrderStatus)
				manager_storage.DELETE("/products/:id", controllers.DeleteProduct)

				manager := manager_storage.Group("", middleware.AuthMiddleware([]string{"manager"}))
				{
					manager.GET("/customers", controllers.GetAllCustomers)
					manager.PATCH("/products/:id/price", controllers.UpdatePrice)
					manager.PATCH("/orders/:id/change-price", controllers.UpdateOrderPrices)
					manager.PATCH("/customers", controllers.UpdateCustomer)
					manager.DELETE("/customers/:id", controllers.DeleteCustomer)
				}

				storage := manager_storage.Group("", middleware.AuthMiddleware([]string{"storage"}))
				{
					storage.GET("/orders/in_assembly", controllers.GetAllOrdersInAssembly)
					storage.POST("/products", middleware.UploadImage("../client/public/uploads"), controllers.CreateProduct)
					storage.PATCH("/products", middleware.UploadImage("../client/public/uploads"), controllers.UpdateProduct)
					storage.PATCH("/products/:id/quantity", controllers.UpdateQuantity)
				}
			}

		}

		// api.GET("/products/:id", controllers.GetProductByID) // {?? кто то вообще это юзает?}
		// api.GET("/hello", func(c *gin.Context) { c.String(200, "world") })

	}
	return r
}
