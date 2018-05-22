package services

import (
	app "github.com/giethoorninternationalharbor/CustomerService"
	"gopkg.in/mgo.v2/bson"
)

type CustomerService struct {
	Store            app.CustomerStore
	MessagePublisher app.MessagePublisher
}

// Get returns a customer based on its id.
func (c *CustomerService) Get(id string) (*app.Customer, error) {
	var cus, err = c.Store.FindByID(id)
	if err != nil {
		return &app.Customer{}, err
	}

	return cus, nil
}

func (c *CustomerService) Create(customer *app.Customer) error {
	err := c.Store.Insert(customer)

	if err != nil {
		return err
	}

	err = c.MessagePublisher.Publish(app.CustomerCreated, &customer)
	return err
}

func (c *CustomerService) Delete(id string) error {
	err := c.Store.Delete(id)

	if err != nil {
		return err
	}

	customer := app.Customer{
		ID: bson.ObjectIdHex(id),
	}

	err = c.MessagePublisher.Publish(app.CustomerDeleted, &customer)

	return nil
}

func (c *CustomerService) Update(id string, customer *app.Customer) error {
	err := c.Store.Update(id, customer)

	if err != nil {
		return err
	}

	err = c.MessagePublisher.Publish(app.CustomerUpdated, &customer)

	return nil
}
