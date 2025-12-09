package main

import (
	"log"
	"os"
	"redirect-service/delivery"
	"redirect-service/repository"
	"redirect-service/usecase"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	// 1. Init App
	app := fiber.New(fiber.Config{DisableStartupMessage: true})
	app.Use(logger.New())

	// 2. Prepare Adapters (สร้าง Mock ขึ้นมา)
	// ถ้าจะใช้ของจริง ให้เปลี่ยนบรรทัดพวกนี้เป็น NewRedisReal(), NewRabbitReal()
	_redisRepo := repository.NewMockRedisRepo()
	_linkServiceRepo := repository.NewMockLinkServiceRepo()
	_rabbitRepo := repository.NewMockRabbitRepo()

	// 3. Init UseCase (เอา Adapters ยัดใส่สมอง)
	_redirectUseCase := usecase.NewRedirectUseCase(_redisRepo, _linkServiceRepo, _rabbitRepo)

	// 4. Init Handler (เอาสมองยัดใส่ Web Server)
	delivery.NewHttpHandler(app, _redirectUseCase)

	// 5. Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	log.Printf("⚡ Redirect Service (Clean Arch) running on port %s", port)
	log.Fatal(app.Listen(":" + port))
}