package delivery

import (
	"encoding/json"
	"fmt"
	"net/http"

	"linklytics/apps/url-shortener-service/domain/model"
	"linklytics/apps/url-shortener-service/usecase" // 👈 เปลี่ยนมาเรียก usecase
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

	createdURL, err := usecase.CreateShortURL(req.OriginalURL)

	if err != nil {
		http.Error(w, "Error creating URL: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// สร้าง Response
	fullShortURL := fmt.Sprintf("%s/%s", FriendBaseURL, createdURL.ShortCode)
	response := map[string]string{
		"short_url": fullShortURL,
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
