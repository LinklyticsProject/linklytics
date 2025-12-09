package main

import (
	"fmt"
	"net/http"

	"linklytics/apps/url-shortener-service/delivery"
	"linklytics/apps/url-shortener-service/repository"
)

func main() {
	// 1. ต่อ MySQL
	dsn := "root:025098200Save@tcp(127.0.0.1:3306)/url_shortener_db?charset=utf8mb4&parseTime=True&loc=Local"
	repository.InitDB(dsn)

	// -----------------------------------------------------------
	// 2. 🔥 ต่อ Redis (ต้องเพิ่มตรงนี้ครับ!)
	// -----------------------------------------------------------
	redisAddr := "127.0.0.1:6379"
	redisPass := "" // Docker ปกติไม่มีรหัส ถ้าไม่ได้ตั้งไว้ให้ใส่ว่างๆ

	// สั่งเชื่อมต่อก่อน ถึงจะเรียกใช้ GetFromCache ได้
	repository.InitRedis(redisAddr, redisPass)
	// -----------------------------------------------------------

	http.HandleFunc("/api/urls", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			delivery.CreateURLHandler(w, r)
		} else if r.Method == http.MethodGet {
			delivery.GetURLsHandler(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// 3. โซนทดสอบ (Test Code)
	// ตอนนี้เรียกได้แล้ว เพราะ InitRedis ไปแล้วข้างบน
	url, err := repository.GetFromCache("Rt7qch")
	if err != nil {
		fmt.Println("Error:", err)
	} else if url == "" {
		fmt.Println("⚠️ ไม่เจอใน Cache (Cache Miss) -> ปกติครับ เพราะเรายังไม่ได้สร้างลิงก์นี้")
	} else {
		fmt.Println("✅ เจอใน Cache แล้ว! (Cache Hit) -> URL คือ:", url)
	}

	fmt.Println("🚀 Service running on :8080...")
	http.ListenAndServe(":8080", nil)
}
