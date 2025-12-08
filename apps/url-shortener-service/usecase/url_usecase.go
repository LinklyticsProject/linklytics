package usecase

import (
	"math/rand"
	"time"

	"linklytics/apps/url-shortener-service/domain/model"
	"linklytics/apps/url-shortener-service/repository" // เรียกใช้ Repository
)

func CreateShortURL(originalURL string) (*model.URL, error) {

	// ---------------------------------------------------------
	// Loop 1: สุ่ม ID จนกว่าจะไม่ซ้ำ (Collision Check for ID)
	// ---------------------------------------------------------
	var newID string
	for {
		newID = generateRandomString(5)
		if repository.IsIDAvailable(newID) {
			break // เจอว่างแล้ว! ออกจากลูปได้
		}
		// ถ้าซ้ำ ลูปจะวนไปสุ่มใหม่เอง
	}

	// ---------------------------------------------------------
	// Loop 2: สุ่ม ShortCode จนกว่าจะไม่ซ้ำ
	// ---------------------------------------------------------
	var shortCode string
	for {
		shortCode = generateRandomString(6)
		if repository.IsShortCodeAvailable(shortCode) {
			break // เจอว่างแล้ว! ออกจากลูปได้
		}
	}

	// 3. เตรียมข้อมูลบันทึก (ตอนนี้มั่นใจแล้วว่าทั้ง ID และ ShortCode ไม่ซ้ำแน่นอน)
	newURL := model.URL{
		ID:          newID,
		OriginalURL: originalURL,
		ShortCode:   shortCode,
		CreatedAt:   time.Now(),
	}

	err := repository.CreateURL(&newURL)
	if err != nil {
		return nil, err
	}
	// เก็บไว้นาน 7 วัน (7 * 24 ชั่วโมง)
	// ถ้า Redis ล่ม เราแค่อยากให้แจ้งเตือนแต่ไม่ต้องถึงกับ Error ใส่ User ก็ได้ (Optional)
	_ = repository.SaveToCache(shortCode, originalURL, 7*24*time.Hour)

	return &newURL, nil
}

// ฟังก์ชันดึงข้อมูล (Logic อาจจะไม่มีอะไรมาก แค่ส่งต่อ)
func FetchAllURLs() ([]model.URL, error) {
	return repository.GetAllURLs()
}

// Helper Function: การสุ่มตัวเลข (เป็น Logic 100%)
func generateRandomString(n int) string {
	var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}
