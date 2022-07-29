package handler

import (
	"encoding/json"
	"go-email-service/service"
	"log"
	"mime/multipart"
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

type Email struct {
	To      string               `json:"to" form:"to" binding:"required"`
	Subject string               `json:"subject" form:"subject" binding:"required"`
	File    multipart.FileHeader `json:"file" form:"file"`
}

func (c *emailHandler) SendEmail(payload []byte) {
	//log.Println(fmt.Sprintf("%s", payload))
	var emailData service.EmailData
	if err := json.Unmarshal(payload, &emailData); err != nil {
		log.Fatal(err)
	}

	err := c.emailService.SendWithoutAttachment(emailData)
	if err != nil {
		panic("gagal")
	}
}
