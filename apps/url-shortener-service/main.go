package main

import (
	"fmt"
	"net/http"

	"linklytics/apps/url-shortener-service/delivery"
	"linklytics/apps/url-shortener-service/repository"
)

func main() {
	// 1. ต่อ MySQL (แก้รหัสผ่านให้ตรงเครื่องคุณ)
	dsn := "root:025098200Save@tcp(127.0.0.1:3306)/url_shortener_db?charset=utf8mb4&parseTime=True&loc=Local"
	repository.InitDB(dsn)

	// 2. ต่อ Redis
	redisAddr := "127.0.0.1:6379"
	repository.InitRedis(redisAddr, "")

	// 3. Setup Route + CORS
	// ใช้ enableCORS ครอบ handler ไว้ เพื่อให้ Frontend ยิงเข้ามาได้
	http.HandleFunc("/api/urls", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			delivery.CreateURLHandler(w, r)
		} else if r.Method == http.MethodGet {
			delivery.GetURLsHandler(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}))

	fmt.Println("🚀 Service running on :8080...")
	http.ListenAndServe(":8080", nil)
}

// 🔥 ฟังก์ชันแก้ CORS (สำคัญมาก!)
func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// อนุญาตให้ทุกที่ยิงเข้ามาได้
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// ถ้า Browser ส่ง OPTIONS มาถามก่อน ให้ตอบ OK กลับไปเลย
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}
