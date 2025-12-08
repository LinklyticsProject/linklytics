package repository

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
)

// ตัวแปร Global สำหรับเรียกใช้ Redis
var RedisClient *redis.Client

// Context สำหรับ Redis (Go บังคับใช้)
var ctx = context.Background()

// 1. ฟังก์ชันเชื่อมต่อ Redis
func InitRedis(addr string, password string) {
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     addr,     // เช่น "localhost:6379"
		Password: password, // รหัสผ่าน (ถ้าไม่มีใส่ "")
		DB:       0,        // ใช้ DB เบอร์ 0
	})

	// ลอง Ping ดู
	_, err := RedisClient.Ping(ctx).Result()
	if err != nil {
		log.Fatal("❌ เชื่อมต่อ Redis ไม่ได้:", err)
	}
	fmt.Println("✅ Connected to Redis Successfully!")
}

// 2. ฟังก์ชันบันทึกลง Cache (Set)
func SaveToCache(shortCode string, originalURL string, duration time.Duration) error {
	// ตั้งชื่อ Key ให้เป็นมาตรฐาน เช่น "short:AbCd12"
	key := "short:" + shortCode

	// สั่ง Save ลง Redis
	err := RedisClient.Set(ctx, key, originalURL, duration).Err()
	if err != nil {
		fmt.Println("⚠️ Warning: Save to Redis failed:", err)
		return err
	}
	return nil
}

func GetFromCache(shortCode string) (string, error) {
	key := "short:" + shortCode

	// คำสั่ง GET
	val, err := RedisClient.Get(ctx, key).Result()

	if err == redis.Nil {
		// กรณีไม่เจอ key นี้ใน Redis
		return "", nil
	} else if err != nil {
		// กรณี Error อื่นๆ (เช่น Redis ล่ม)
		return "", err
	}

	// กรณีเจอ: ส่ง URL จริงกลับไป
	return val, nil
}
