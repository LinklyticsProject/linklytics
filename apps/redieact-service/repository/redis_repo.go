package repository

import (
	"log"
	"redirect-service/domain"
)

type mockRedisRepo struct {
	store map[string]string
}

func NewMockRedisRepo() domain.CacheRepository {
	return &mockRedisRepo{
		store: map[string]string{
			"AbC12": "https://www.google.com", // ข้อมูลตัวอย่าง
		},
	}
}

func (r *mockRedisRepo) Get(shortCode string) (string, bool) {
	val, ok := r.store[shortCode]
	return val, ok
}

func (r *mockRedisRepo) Set(shortCode string, url string) {
	r.store[shortCode] = url
	log.Printf("💾 [Redis] Cached: %s -> %s", shortCode, url)
}