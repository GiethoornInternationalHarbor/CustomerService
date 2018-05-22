package app

import "gopkg.in/mgo.v2/bson"

// Customer represents the customers that we will create with our app
type Customer struct {
	ID          bson.ObjectId `bson:"_id,omitempty"`
	FirstName   string
	LastName    string
	Gender      string
	HomeAddress struct {
		Street string
		Suite  string
		City   string
		State  string
		Zip    string
	}
}
