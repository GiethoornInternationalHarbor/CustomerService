package datastores

import (
	app "github.com/giethoorninternationalharbor/CustomerService"
	mgo "gopkg.in/mgo.v2"
)

// CustomerStore is a MongoDB specific implementation of the customer datastore.
type CustomerStore struct {
	DB *mgo.Database
}

const collection = "customer"

func (s *CustomerStore) FindByID(id string) (*app.Customer, error) {
	customer := app.Customer{}
	err := s.DB.C(collection).FindId(id).One(&customer)

	if customer.FirstName == "" {
		return &customer, app.ErrNotFound
	}

	return &customer, err
}

func (s *CustomerStore) Insert(customer *app.Customer) error {
	err := s.DB.C(collection).Insert(&customer)
	return err
}

func (s *CustomerStore) Delete(id string) error {
	err := s.DB.C(collection).RemoveId(id)
	return err
}

func (s *CustomerStore) Update(id string, customer *app.Customer) error {
	err := s.DB.C(collection).UpdateId(id, &customer)

	return err
}
