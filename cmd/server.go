package main

import (
	"log"

	"github.com/streadway/amqp"

	"github.com/giethoorninternationalharbor/CustomerService/datastores/mongodb"
	"github.com/giethoorninternationalharbor/CustomerService/publishers/rabbitmq"
	"github.com/giethoorninternationalharbor/CustomerService/services"

	app "github.com/giethoorninternationalharbor/CustomerService"
	"github.com/giethoorninternationalharbor/CustomerService/http"
	mgo "gopkg.in/mgo.v2"
)

var (
	customerService app.CustomerService
)

func main() {
	session, err := mgo.Dial("mongodb://localhost:27017/customers")
	failOnError(err, "Failed to connect to mongodb")

	defer session.Close()
	db := session.DB("customerservice")

	customerStore := &datastores.CustomerStore{DB: db}

	amqpConn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	failOnError(err, "Failed to connect to RabbitMQ")
	defer amqpConn.Close()

	ch, err := amqpConn.Channel()
	failOnError(err, "Failed to open a channel")

	err = ch.ExchangeDeclare(
		app.MessagePublisherExchange, // name
		"fanout",                     // type
		true,                         // durable
		false,                        // auto-deleted
		false,                        // internal
		false,                        // no-wait
		nil,                          // arguments
	)
	failOnError(err, "Failed to declare an exchange")

	messagePublisher := &publishers.MessagePublisher{Channel: ch}

	customerService = &services.CustomerService{Store: customerStore, MessagePublisher: messagePublisher}

	server := http.NewServer(customerService)
	log.Print("Starting server on port 3000")
	log.Fatal(http.ListenAndServe(":3000", server))
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}
