package app

type MessageType string

const (
	CustomerCreated MessageType = "CustomerCreatedEvent"
	CustomerUpdated MessageType = "CustomerUpdatedEvent"
	CustomerDeleted MessageType = "CustomerDeletedEvent"
)

const MessagePublisherExchange = "GiethoornInternationalHarbor"

// MessagePublisher representing actions that can be published
type MessagePublisher interface {
	Publish(messageType MessageType, body interface{}) error
}
