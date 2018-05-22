package publishers

import (
	"encoding/json"

	app "github.com/giethoorninternationalharbor/CustomerService"
	"github.com/streadway/amqp"
)

// MessagePublisher is a RabbitMQ specific implementation of the message publisher.
type MessagePublisher struct {
	Channel *amqp.Channel
}

func (publisher *MessagePublisher) Publish(messageType app.MessageType, body interface{}) error {
	var jsonBody, err = json.Marshal(body)

	if err != nil {
		return err
	}

	return publisher.Channel.Publish(
		app.MessagePublisherExchange, // exchange
		"",    // routing key
		false, // mandatory
		false, // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Type:        string(messageType),
			Body:        jsonBody,
		})

}
