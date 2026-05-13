package main

import (
	"daulay-partners/database"
	"daulay-partners/handlers"
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Connect to database
	database.Connect()

	// Setup router
	r := gin.Default()

	// CORS for Vue frontend
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
	}))

	// Serve uploaded files
	r.Static("/uploads", "../uploads")

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

	fmt.Println("🚀 Backend running on http://localhost:8080")
	r.Run(":8080")
}
