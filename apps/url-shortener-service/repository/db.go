// ไฟล์: repository/db.go
package repository

import (
	"fmt"
	"log"

	"linklytics/apps/url-shortener-service/domain/model"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// ตัวแปร Global สำหรับเรียกใช้ DB ใน Package นี้
var DB *gorm.DB

// ฟังก์ชันเชื่อมต่อ Database
func InitDB(dsn string) {
	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ เชื่อมต่อ MySQL ไม่ได้:", err)
	}

	// Auto Migrate สร้างตารางให้อัตโนมัติ
	err = DB.AutoMigrate(
		&model.User{},
		&model.URL{},
	)
	if err != nil {
		log.Fatal("❌ สร้างตารางไม่สำเร็จ:", err)
	}

	fmt.Println("✅ Connected to MySQL & Migrated Successfully!")
}

// ฟังก์ชันบันทึกข้อมูล (Save)
func CreateURL(url *model.URL) error {
	result := DB.Create(url)
	return result.Error
}

// ฟังก์ชันดึงข้อมูลทั้งหมด (FindAll)
func GetAllURLs() ([]model.URL, error) {
	var urls []model.URL
	result := DB.Find(&urls)
	return urls, result.Error
}

func IsShortCodeAvailable(code string) bool {
	var count int64

	DB.Model(&model.URL{}).Where("short_code = ?", code).Count(&count)

	return count == 0
}

func IsIDAvailable(id string) bool {
	var count int64
	DB.Model(&model.URL{}).Where("id = ?", id).Count(&count)
	return count == 0
}
