package repository

import (
	"log"
	"redirect-service/domain"
	"time"
)

type mockRabbitRepo struct{}

func NewMockRabbitRepo() domain.EventQueue {
	return &mockRabbitRepo{}
}

func (r *mockRabbitRepo) Publish(event domain.AnalyticsEvent) {
	// จำลองการส่ง
	time.Sleep(10 * time.Millisecond) 
	log.Printf("🐇 [RabbitMQ] Published Event: %s clicked by %s", event.ShortCode, event.IP)
}