package model

import "time"

// 1. ตาราง User (สร้างใหม่)
type User struct {
	ID uint `json:"id" gorm:"primaryKey"`

	// 👇 แก้บรรทัดนี้: เติม ;size:191 เข้าไปท้าย gorm tag
	Email string `json:"email" gorm:"uniqueIndex;not null;size:191"`

	PasswordHash string    `json:"-" gorm:"not null"`
	Role         string    `json:"role" gorm:"default:'user'"`
	CreatedAt    time.Time `json:"created_at"`

	URLs []URL `json:"urls,omitempty" gorm:"foreignKey:UserID"`
}

// 2. ตาราง URL (เพิ่ม UserID)
type URL struct {
	ID          string     `json:"id" gorm:"primaryKey;size:10"`
	OriginalURL string     `json:"original_url" gorm:"not null"`
	ShortCode   string     `json:"short_code" gorm:"uniqueIndex;not null;size:20"`
	Title       string     `json:"title" gorm:"size:255"`
	CreatedAt   time.Time  `json:"created_at"`
	Clicks      int        `json:"clicks" gorm:"default:0"`
	LastClick   *time.Time `json:"last_click"` // ใช้ pointer เพื่อให้เป็น nullable (nil = ยังไม่เคยคลิก)

	// Foreign Key เชื่อมไปหา User
	UserID uint `json:"user_id"`
}

type CreateURLRequest struct {
	OriginalURL string `json:"original_url"`
	Title       string `json:"title"`
}
