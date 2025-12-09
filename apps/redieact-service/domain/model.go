package domain

import "time"

// Link คือ Object หลักของระบบนี้
type Link struct {
	ShortCode   string
	OriginalURL string
}

// AnalyticsEvent คือข้อมูลที่จะส่งไปเก็บสถิติ
type AnalyticsEvent struct {
	ShortCode string    `json:"short_code"`
	IP        string    `json:"ip"`
	UserAgent string    `json:"user_agent"`
	Timestamp time.Time `json:"timestamp"`
}