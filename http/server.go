package http

import (
	"net/http"

	app "github.com/giethoorninternationalharbor/CustomerService"
	"github.com/gorilla/mux"
)

// NewServer will construct a Server and apply all of the necessary routes
func NewServer(cs app.CustomerService) *Server {
	server := Server{
		customers: &CustomerHandler{
			customerService: cs,
		},
		router: mux.NewRouter(),
	}
	server.routes()
	return &server
}

// Server is our HTTP server with routes for all our endpoints.
//
// The zero value is NOT useful - you should use the NewServer function
// to create a server.
type Server struct {
	customers *CustomerHandler
	router    *mux.Router
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.router.ServeHTTP(w, r)
}

func (s *Server) routes() {
	apiCustomer := s.router.PathPrefix("/api/customer").Subrouter()

	apiCustomer.HandleFunc("/{id}", s.customers.GetById).Methods(http.MethodGet)
	apiCustomer.HandleFunc("/", s.customers.Create).Methods(http.MethodPost)
	apiCustomer.HandleFunc("/{id}/", s.customers.Update).Methods(http.MethodPut)
	apiCustomer.HandleFunc("/{id}", s.customers.Delete).Methods(http.MethodDelete)
}
