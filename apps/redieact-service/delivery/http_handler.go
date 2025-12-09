package delivery

import (
	"redirect-service/domain"

	"github.com/gofiber/fiber/v2"
)

type httpHandler struct {
	useCase domain.RedirectUseCase
}

func NewHttpHandler(app *fiber.App, u domain.RedirectUseCase) {
	handler := &httpHandler{
		useCase: u,
	}

	// Route: GET /:shortCode
	app.Get("/:shortCode", handler.Redirect)
	app.Get("/health", func(c *fiber.Ctx) error { return c.SendStatus(200) })
}

func (h *httpHandler) Redirect(c *fiber.Ctx) error {
	shortCode := c.Params("shortCode")
	ip := c.IP()
	ua := c.Get("User-Agent")

	// เรียกใช้ Business Logic
	originalURL, err := h.useCase.ExecuteRedirect(shortCode, ip, ua)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Link not found"})
	}

	// 307 Temporary Redirect
	return c.Redirect(originalURL, 307)
}