package usecase

import (
	"errors"
	"log"
	"redirect-service/domain"
	"time"
)

type redirectUseCase struct {
	cache       domain.CacheRepository
	linkService domain.LinkServiceRepository
	queue       domain.EventQueue
}

// ฟังก์ชันสร้าง UseCase (Constructor)
func NewRedirectUseCase(c domain.CacheRepository, l domain.LinkServiceRepository, q domain.EventQueue) domain.RedirectUseCase {
	return &redirectUseCase{
		cache:       c,
		linkService: l,
		queue:       q,
	}
}

// Logic หลักของ Flow 3 อยู่ที่นี่!
func (u *redirectUseCase) ExecuteRedirect(shortCode, ip, userAgent string) (string, error) {
	
	// 1. ลองหาใน Cache ก่อน (Redis)
	url, found := u.cache.Get(shortCode)

	// 2. ถ้าไม่เจอ -> ไปถาม Link Service
	if !found {
		log.Println("⚠️ Cache Miss! Asking Link Service...")
		var foundInService bool
		url, foundInService = u.linkService.FetchOriginalURL(shortCode)

		if !foundInService {
			return "", errors.New("link not found")
		}

		// เจอแล้วรีบยัดลง Cache ครั้งหน้าจะได้เร็ว
		u.cache.Set(shortCode, url)
	}

	// 3. ส่ง Event ไปเก็บสถิติ (Fire & Forget)
	// ทำเป็น Go Routine เพื่อไม่ให้ User ต้องรอ
	go func() {
		event := domain.AnalyticsEvent{
			ShortCode: shortCode,
			IP:        ip,
			UserAgent: userAgent,
			Timestamp: time.Now(),
		}
		u.queue.Publish(event)
	}()

	// 4. คืนค่า URL ปลายทาง
	return url, nil
}