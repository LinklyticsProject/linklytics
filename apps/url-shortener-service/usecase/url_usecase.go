package usecase

import (
	"math/rand"
	"time"

	"linklytics/apps/url-shortener-service/domain/model"
	"linklytics/apps/url-shortener-service/repository" // เรียกใช้ Repository
)

func CreateShortURL(originalURL string, title string, userID uint) (*model.URL, error) {

	// Loop 1: สุ่ม ID (เหมือนเดิม)
	var newID string
	for {
		newID = generateRandomString(5)
		if repository.IsIDAvailable(newID) {
			break
		}
	}

	// Loop 2: สุ่ม ShortCode (เหมือนเดิม)
	var shortCode string
	for {
		shortCode = generateRandomString(6)
		if repository.IsShortCodeAvailable(shortCode) {
			break
		}
	}

	// 3. เตรียมข้อมูลบันทึก
	newURL := model.URL{
		ID:          newID,
		OriginalURL: originalURL,
		ShortCode:   shortCode,
		Title:       title,
		CreatedAt:   time.Now(),
		UserID:      userID,
	}

	err := repository.CreateURL(&newURL)
	if err != nil {
		return nil, err
	}

	// Save Redis (เหมือนเดิม)
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
