package config

import (
	"fmt"
	amqp091 "github.com/rabbitmq/amqp091-go"
	"log"
	"os"
)

func SetupMessageBrokerConnection() (*amqp091.Connection, *amqp091.Channel, amqp091.Queue) {
	username := os.Getenv("MESSAGE_BROKER_USER")
	password := os.Getenv("MESSAGE_BROKER_PASSWORD")
	host := os.Getenv("MESSAGE_BROKER_HOST")
	port := os.Getenv("MESSAGE_BROKER_PORT")

	connectionString := fmt.Sprintf("amqp://%s:%s@%s:%s/", username, password, host, port)

	// Setting up message broker connection
	connection, err := amqp091.Dial(connectionString)
	FailOnError("Connection failed : ", err)

	// Setting up message broker channel
	channel, err := connection.Channel()
	FailOnError("Creating channel failed : ", err)

	// Creating queue
	queue := queueSetup(channel, "hello", false, false, false, false, nil)

	return connection, channel, queue
}

func FailOnError(msg string, err error) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}

// Declaring queue function
func queueSetup(
	ch *amqp091.Channel,
	name string,
	durable bool,
	autoDelete bool,
	exclusive bool,
	noWait bool,
	args amqp091.Table,
) amqp091.Queue {

	q, err := ch.QueueDeclare(
		name,       // name
		durable,    // durable
		autoDelete, // delete when unused
		exclusive,  // exclusive
		noWait,     // no-wait
		args,       // arguments
	)
	FailOnError("Declare queue failed : ", err)
	return q
}
