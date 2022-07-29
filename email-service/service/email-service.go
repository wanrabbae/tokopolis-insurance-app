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
	//SendWithAttachment(payload []byte, to string, subject string, filePath string) error
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

type ContentBody struct {
	Body string
}

type EmailData struct {
	Host    string
	Target  string
	Type    string
	Subject string
	Body    map[string]interface{}
}

func NewEmailService() EmailService {
	err := godotenv.Load()
	if err != nil {
		panic("Failed to load env.")
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

	msg := gomail.NewMessage()
	msg.SetHeader("From", c.mailFrom)
	msg.SetHeader("To", emailData.Target)
	msg.SetHeader("Subject", emailData.Subject)

	t := template.Must(template.ParseGlob("email/*.html"))
	result := template.Must(t.ParseGlob("email/section/*.html"))

	buff := new(bytes.Buffer)
	err := result.ExecuteTemplate(buff, emailData.Type+".html", emailData)
	if err != nil {
		panic(err)
	}

	msg.SetBody("text/html", buff.String())
	port, _ := strconv.Atoi(c.mailPort)
	n := gomail.NewDialer(
		c.mailHost,
		port,
		c.mailUsername,
		c.mailPass)

	if err := n.DialAndSend(msg); err != nil {
		panic(err)
	}
	log.Println("Email Sent")

	return nil
}

/*func (c *emailService) SendWithAttachment(payload []byte, to string, subject string, filePath string) error {
	msg := gomail.NewMessage()
	msg.SetHeader("From", c.mailFrom)
	msg.SetHeader("To", to)
	msg.SetHeader("Subject", subject)
	msg.SetBody("text/html", "<b>This is the body of the mail</b>")
	msg.Attach(filePath)

	port, _ := strconv.Atoi(c.mailPort)
	n := gomail.NewDialer(
		c.mailHost,
		port,
		c.mailUsername,
		c.mailPass)

	if err := n.DialAndSend(msg); err != nil {
		panic(err)
	}

	return nil
}
*/

func getEmailContent(emailData *EmailData) (string, error) {
	var emailContent *template.Template
	emailContent, err := emailContent.ParseFiles("email/" + emailData.Type + ".html")
	if err != nil {
		log.Println("Email parse Error a")
		return "Error : ", err
	}
	buff := new(bytes.Buffer)
	err = emailContent.Execute(buff, emailData)
	if err != nil {
		log.Println("Email parse Error")
		return "Error : ", err
	}

	return buff.String(), nil
}

func emailTemplate(emailType string) (string, error) {
	/*var main *template.Template
	main, err := main.ParseFiles("email/default.html")
	if err != nil {
		log.Println("Email parse Error")
		return "", err
	}
	var body *template.Template
	body, err = body.ParseFiles("email/" + emailType + ".html")
	if err != nil {
		log.Println("Email parse Error")
		return "", err
	}

	buff := new(bytes.Buffer)

	return*/
	return "a", nil
}
