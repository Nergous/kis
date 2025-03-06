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
		api.GET("/products/:id", controllers.GetProductByID)
		api.POST("/products", middleware.UploadImage("../client/public/uploads"), controllers.CreateProduct)
		api.PATCH("/products", middleware.UploadImage("../client/public/uploads"), controllers.UpdateProduct)
		api.PATCH("/products/:id/quantity", controllers.UpdateQuantity)
		api.PATCH("/products/:id/price", controllers.UpdatePrice)
		api.DELETE("/products/:id", controllers.DeleteProduct)

		api.GET("/login-customer", controllers.LoginCustomer)
		api.POST("/register", controllers.RegisterCustomer)

		api.POST("/login-worker", controllers.LoginWorker)

		api.GET("/orders", controllers.GetAllOrders)
		api.GET("/orders/:id", controllers.GetOrderByID)
		api.PATCH("/orders/:id/change-price", controllers.UpdateOrderPrices)
		p := api.Group("", middleware.AuthMiddleware([]string{"customer"}))
		{
			p.POST("/orders", controllers.CreateOrder)
		}

		api.GET("/customers", controllers.GetAllCustomers)
		api.GET("/customers/:id", controllers.GetCustomerByID)
		api.POST("/customers", controllers.CreateCustomer)
		api.PATCH("/customers", controllers.UpdateCustomer)
		api.DELETE("/customers/:id", controllers.DeleteCustomer)

		api.GET("/workers", controllers.GetAllWorkers)
		api.GET("/workers/:id", controllers.GetWorkerByID)
		api.POST("/workers", controllers.CreateWorker)
		api.PATCH("/workers", controllers.UpdateWorker)
		api.DELETE("/workers/:id", controllers.DeleteWorker)

		protected := api.Group("", middleware.AuthMiddleware([]string{"admin"}))
		{
			protected.GET("/hello", func(c *gin.Context) { c.String(200, "world") })
		}

		// Пояснение тому кто хочет потыкать
		// в группу протектед в мидлвару добавлять те роли доступ которым нужен к эндпойнту

	}
	return r
}
