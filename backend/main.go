package main

import (
	"daulay-partners/database"
	"daulay-partners/handlers"
	"fmt"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	database.Connect()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: false,
	}))

	// Serve uploaded files
	r.Static("/uploads", "./uploads")

	// Serve Vue frontend (production build)
	r.Static("/assets", "./frontend/dist/assets")
	r.StaticFile("/favicon.svg", "./frontend/dist/favicon.svg")
	r.NoRoute(func(c *gin.Context) {
		c.File("./frontend/dist/index.html")
	})

	// API routes
	api := r.Group("/api/v1")
	{
		api.GET("/decisions", handlers.GetDecisions)
		api.GET("/decisions/:id", handlers.GetDecision)
		api.GET("/stats", handlers.GetStats)

		admin := api.Group("/admin")
		{
			admin.POST("/decisions", handlers.CreateDecision)
			admin.PUT("/decisions/:id", handlers.UpdateDecision)
			admin.DELETE("/decisions/:id", handlers.DeleteDecision)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Printf("🚀 Server running on port %s\n", port)
	r.Run(":" + port)
}
