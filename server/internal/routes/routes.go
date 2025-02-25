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

		api.GET("/login-customer", controllers.LoginCustomer)
		api.POST("/register", controllers.RegisterCustomer)

		api.POST("/login-worker", controllers.LoginWorker)

		api.GET("/customer", controllers.GetAllCustomers)
		api.GET("/customer/:id", controllers.GetCustomerByID)
		api.POST("/customer", controllers.CreateCustomer)
		api.PATCH("/customer", controllers.UpdateCustomer)
		api.DELETE("/customer/:id", controllers.DeleteCustomer)

		api.GET("/workers", controllers.GetAllWorkers)
		api.GET("/workers/:id", controllers.GetWorkerByID)
		api.POST("/workers", controllers.CreateWorker)
		api.PATCH("/workers", controllers.UpdateWorker)
		api.DELETE("/workers/:id", controllers.DeleteWorker)

		api.POST("/products", middleware.UploadImage("../client/public/uploads"), controllers.CreateProduct)
		api.PATCH("/products", middleware.UploadImage("../client/public/uploads"), controllers.UpdateProduct)
		api.DELETE("/products/:id", controllers.DeleteProduct)
		api.PATCH("/products/:id/quantity", controllers.UpdateQuantity)
		protected := api.Group("", middleware.AuthMiddleware([]string{"admin"}))
		{
			protected.GET("/hello", func(c *gin.Context) { c.String(200, "world") })
		}

		// Пояснение тому кто хочет потыкать
		// в группу протектед в мидлвару добавлять те роли доступ которым нужен к эндпойнту

	}
	return r
}
