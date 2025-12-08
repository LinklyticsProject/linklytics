package model

import "time"

type URL struct {
	// ID ก็ควรใส่ size ด้วยครับ เพื่อความชัวร์ (Primary Key)
	ID string `json:"id" gorm:"primaryKey;size:10"`

	// OriginalURL ปล่อยเป็น Text ได้ เพราะไม่ได้ทำ Index ห้ามซ้ำ
	OriginalURL string `json:"original_url" gorm:"not null"`

	// MySQL จะได้สร้างเป็น VARCHAR(20) แทน LONGTEXT
	ShortCode string `json:"short_code" gorm:"uniqueIndex;not null;size:20"`

	CreatedAt time.Time `json:"created_at"`
}

type CreateURLRequest struct {
	OriginalURL string `json:"original_url"`
}
