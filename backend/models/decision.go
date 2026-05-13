package models

import "time"

type Decision struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Category    string    `json:"category" gorm:"size:50;not null"`
	Number      string    `json:"number" gorm:"size:255;not null"`
	Title       string    `json:"title" gorm:"size:500;not null"`
	Parties     string    `json:"parties" gorm:"size:500;not null"`
	Date        string    `json:"date" gorm:"size:100;not null"`
	Status      string    `json:"status" gorm:"size:50;not null"`
	StatusLabel string    `json:"status_label" gorm:"size:100;not null"`
	Judge       string    `json:"judge" gorm:"size:255"`
	Court       string    `json:"court" gorm:"size:255"`
	Summary     string    `json:"summary" gorm:"type:text"`
	PdfPath     string    `json:"pdf_path" gorm:"size:500"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
