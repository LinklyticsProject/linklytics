package repository

import (
	"log"
	"redirect-service/domain"
)

type mockLinkServiceRepo struct{}

func NewMockLinkServiceRepo() domain.LinkServiceRepository {
	return &mockLinkServiceRepo{}
}

func (r *mockLinkServiceRepo) FetchOriginalURL(shortCode string) (string, bool) {
	log.Printf("🔌 [HTTP Client] GET http://link-service/api/%s", shortCode)
	
	// จำลองว่า Link Service ตอบกลับมา
	if shortCode == "new-link" {
		return "https://www.youtube.com", true
	}
	return "", false
}