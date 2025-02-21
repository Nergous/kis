package routes

import (
	"project_backend/internal/controllers"
	"project_backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()

	api := r.Group("/api", middleware.LogMiddleware())
	{
		api.GET("/hello", func(c *gin.Context) { c.String(200, "world") })

		api.GET("/products", controllers.GetAllProducts)
		api.GET("/products/:id", controllers.GetProductByID)

		api.POST("/login-worker", controllers.LoginWorker)
		api.POST("/register", controllers.RegisterCustomer)

		api.POST("/workers", controllers.CreateWorker)
		protected := api.Group("", middleware.AuthMiddleware([]string{"admin", "worker"}))
		{
			protected.POST("/products", controllers.CreateProduct)
			protected.PATCH("/products", controllers.UpdateProduct)
			protected.DELETE("/products/:id", controllers.DeleteProduct)
			protected.PATCH("/products/:id/quantity", controllers.UpdateQuantity)
		}

	}
	return r
}
