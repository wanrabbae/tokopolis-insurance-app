package handler

import (
	"email-service/service"
	"encoding/json"
	"log"
)

type EmailHandler interface {
	SendEmail(payload []byte)
}

type emailHandler struct {
	emailService service.EmailService
}

func NewEmailHandler(emailService service.EmailService) EmailHandler {
	return &emailHandler{
		emailService: emailService,
	}
}

func (c *emailHandler) SendEmail(payload []byte) {
	var emailData service.EmailData
	if err := json.Unmarshal(payload, &emailData); err != nil {
		log.Fatal(err)
	}

	err := c.emailService.SendWithoutAttachment(emailData)
	if err != nil {
		log.Fatal(err)
	}
}
