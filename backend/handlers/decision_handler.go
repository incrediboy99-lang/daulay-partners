package handlers

import (
	"daulay-partners/database"
	"daulay-partners/models"
	"fmt"
	"net/http"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GET /api/v1/decisions
func GetDecisions(c *gin.Context) {
	var decisions []models.Decision
	query := database.DB.Order("id DESC")

	// Filter by category
	if cat := c.Query("category"); cat != "" && cat != "all" {
		query = query.Where("category = ?", cat)
	}

	// Search
	if search := c.Query("search"); search != "" {
		like := "%" + search + "%"
		query = query.Where("number ILIKE ? OR title ILIKE ? OR parties ILIKE ?", like, like, like)
	}

	query.Find(&decisions)
	c.JSON(http.StatusOK, gin.H{"data": decisions, "total": len(decisions)})
}

// GET /api/v1/decisions/:id
func GetDecision(c *gin.Context) {
	id := c.Param("id")
	var decision models.Decision
	if err := database.DB.First(&decision, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Putusan tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": decision})
}

// GET /api/v1/stats
func GetStats(c *gin.Context) {
	var total, won int64
	database.DB.Model(&models.Decision{}).Count(&total)
	database.DB.Model(&models.Decision{}).Where("status = ?", "won").Count(&won)

	winRate := 0
	if total > 0 {
		winRate = int(float64(won) / float64(total) * 100)
	}

	c.JSON(http.StatusOK, gin.H{
		"total":    total,
		"win_rate": winRate,
		"years":    15,
	})
}

// POST /api/v1/admin/decisions
func CreateDecision(c *gin.Context) {
	var decision models.Decision
	decision.Category = c.PostForm("category")
	decision.Number = c.PostForm("number")
	decision.Title = c.PostForm("title")
	decision.Parties = c.PostForm("parties")
	decision.Date = c.PostForm("date")
	decision.Status = c.PostForm("status")
	decision.StatusLabel = c.PostForm("status_label")
	decision.Judge = c.PostForm("judge")
	decision.Court = c.PostForm("court")
	decision.Summary = c.PostForm("summary")

	// Handle PDF upload
	file, err := c.FormFile("pdf")
	if err == nil {
		ext := filepath.Ext(file.Filename)
		filename := uuid.New().String() + ext
		savePath := filepath.Join("../uploads", filename)
		if err := c.SaveUploadedFile(file, savePath); err == nil {
			decision.PdfPath = "/uploads/" + filename
		}
	}

	if err := database.DB.Create(&decision).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": decision, "message": "Putusan berhasil ditambahkan"})
}

// PUT /api/v1/admin/decisions/:id
func UpdateDecision(c *gin.Context) {
	id := c.Param("id")
	var decision models.Decision
	if err := database.DB.First(&decision, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Putusan tidak ditemukan"})
		return
	}

	// Update fields from form data
	if v := c.PostForm("category"); v != "" { decision.Category = v }
	if v := c.PostForm("number"); v != "" { decision.Number = v }
	if v := c.PostForm("title"); v != "" { decision.Title = v }
	if v := c.PostForm("parties"); v != "" { decision.Parties = v }
	if v := c.PostForm("date"); v != "" { decision.Date = v }
	if v := c.PostForm("status"); v != "" { decision.Status = v }
	if v := c.PostForm("status_label"); v != "" { decision.StatusLabel = v }
	if v := c.PostForm("judge"); v != "" { decision.Judge = v }
	if v := c.PostForm("court"); v != "" { decision.Court = v }
	if v := c.PostForm("summary"); v != "" { decision.Summary = v }

	// Handle PDF upload
	file, err := c.FormFile("pdf")
	if err == nil {
		ext := filepath.Ext(file.Filename)
		filename := uuid.New().String() + ext
		savePath := filepath.Join("../uploads", filename)
		if err := c.SaveUploadedFile(file, savePath); err == nil {
			decision.PdfPath = "/uploads/" + filename
		}
	}

	decision.UpdatedAt = time.Now()
	database.DB.Save(&decision)
	c.JSON(http.StatusOK, gin.H{"data": decision, "message": "Putusan berhasil diupdate"})
}

// DELETE /api/v1/admin/decisions/:id
func DeleteDecision(c *gin.Context) {
	id := c.Param("id")
	idNum, _ := strconv.Atoi(id)
	if err := database.DB.Delete(&models.Decision{}, idNum).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Putusan tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("Putusan #%s berhasil dihapus", id)})
}
