package main

import (
	"go-email-service/config"
	"go-email-service/handler"
	"go-email-service/service"
	"log"
)

var (
	emailService service.EmailService = service.NewEmailService()
	emailHandler handler.EmailHandler = handler.NewEmailHandler(emailService)
)

func main() {
	connection, channel, queue := config.SetupMessageBrokerConnection()
	defer channel.Close()
	defer connection.Close()

	payload, err := channel.Consume(
		queue.Name, // queue
		"",         // consumer
		true,       // auto-ack
		false,      // exclusive
		false,      // no-local
		false,      // no-wait
		nil,        // args
	)
	config.FailOnError("Register consumer failed : ", err)

	var forever chan struct{}
	go func() {
		for d := range payload {
			// Handling new request to send email
			emailHandler.SendEmail(d.Body)
		}
	}()
	log.Printf(" [*] Waiting for messages. To exit press CTRL+C")
	<-forever
}
