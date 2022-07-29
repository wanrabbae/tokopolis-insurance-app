package service

import (
	"bytes"
	"github.com/joho/godotenv"
	"gopkg.in/gomail.v2"
	"html/template"
	"log"
	"os"
	"strconv"
)

type EmailService interface {
	SendWithoutAttachment(emailData EmailData) error
}

type emailService struct {
	mailFrom       string
	mailUsername   string
	mailPass       string
	mailMailer     string
	mailHost       string
	mailPort       string
	mailEncryption string
}

// EmailData Email interface
type EmailData struct {
	Host    string
	Target  string
	Type    string
	Subject string
	Body    map[string]interface{}
}

func NewEmailService() EmailService {
	// Loading env file.
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Failed to load env : ", err)
	}
	return &emailService{
		mailHost:       os.Getenv("MAIL_HOST"),
		mailUsername:   os.Getenv("MAIL_USERNAME"),
		mailPass:       os.Getenv("MAIL_PASSWORD"),
		mailMailer:     os.Getenv("MAIL_MAILER"),
		mailFrom:       os.Getenv("MAIL_FROM"),
		mailEncryption: os.Getenv("MAIL_ENCRYPTION"),
		mailPort:       os.Getenv("MAIL_PORT"),
	}
}

func (c *emailService) SendWithoutAttachment(emailData EmailData) error {

	// Setting up header for email
	msg := gomail.NewMessage()
	msg.SetHeader("From", c.mailFrom)
	msg.SetHeader("To", emailData.Target)
	msg.SetHeader("Subject", emailData.Subject)

	// Email template parsing
	t := template.Must(template.ParseGlob("email/*.html"))
	result := template.Must(t.ParseGlob("email/section/*.html"))

	// Execute template parsing and add data
	buff := new(bytes.Buffer)
	err := result.ExecuteTemplate(buff, emailData.Type+".html", emailData)
	if err != nil {
		log.Fatal(err)
	}

	// Add email body, initialize smtp port, email dialer, send the email.
	msg.SetBody("text/html", buff.String())
	port, _ := strconv.Atoi(c.mailPort)
	n := gomail.NewDialer(
		c.mailHost,
		port,
		c.mailUsername,
		c.mailPass)

	if err := n.DialAndSend(msg); err != nil {
		log.Fatal(err)
	}
	log.Println("Email Sent")

	return nil
}
