package app

// CustomerService representing actions that can be done on a customer
type CustomerService interface {
	Get(id string) (*Customer, error)
	Create(customer *Customer) error
	Update(id string, customer *Customer) error
	Delete(id string) error
}
