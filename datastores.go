package app

import "errors"

var (
	// ErrNotFound is an implementation agnostic error that should be returned
	// by any service implementation when a record was not located.
	ErrNotFound = errors.New("app: resource requested could not be found")
)

// CustomerStore defines the interface used to interact with the customers datastore.
type CustomerStore interface {
	// FindByID will return a customer that was found using the specified id
	FindByID(id string) (*Customer, error)

	// Insert will create a new customer
	Insert(customer *Customer) error

	// Delete will remove a customer from the store
	Delete(id string) error

	// Update will update a customer in the store that has the id
	Update(id string, customer *Customer) error
}
