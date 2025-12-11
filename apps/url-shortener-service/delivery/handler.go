package delivery

import (
	"encoding/json"
	"fmt"
	"net/http"

	"linklytics/apps/url-shortener-service/domain/model"
	"linklytics/apps/url-shortener-service/usecase"
)

const FriendBaseURL = "http://localhost:3003"

func CreateURLHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req model.CreateURLRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// ------------------------------------------------
	// 🔥 Mock User ID: สมมติว่าเป็น User ID 1 สร้าง
	// ------------------------------------------------
	mockUserID := uint(1)

	// ส่ง mockUserID เข้าไปในฟังก์ชัน
	createdURL, err := usecase.CreateShortURL(req.OriginalURL, req.Title, mockUserID)

	if err != nil {
		http.Error(w, "Error creating URL: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// สร้าง Response
	fullShortURL := fmt.Sprintf("%s/%s", FriendBaseURL, createdURL.ShortCode)

	// ส่งข้อมูลกลับไปให้ครบๆ เผื่อ Frontend อยากใช้
	response := map[string]interface{}{
		"short_url":    fullShortURL,
		"short_code":   createdURL.ShortCode,
		"original_url": createdURL.OriginalURL,
		"id":           createdURL.ID,
		"clicks":       createdURL.Clicks,
		"created_at":   createdURL.CreatedAt,
		"last_click":   createdURL.LastClick, // nil ถ้ายังไม่เคยคลิก
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func GetURLsHandler(w http.ResponseWriter, r *http.Request) {
	urls, err := usecase.FetchAllURLs()
	if err != nil {
		http.Error(w, "Error fetching data", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(urls)
}
