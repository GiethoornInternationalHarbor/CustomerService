package http

import (
	"encoding/json"

	"net/http"

	app "github.com/giethoorninternationalharbor/CustomerService"
	"github.com/gorilla/mux"
)

type CustomerHandler struct {
	customerService app.CustomerService
}

func (h *CustomerHandler) parseCustomer(req *http.Request) (*app.Customer, error) {
	var customer app.Customer
	dec := json.NewDecoder(req.Body)
	err := dec.Decode(&req)

	if err != nil {
		return nil, err
	}

	return &customer, nil
}

func (h *CustomerHandler) GetById(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	key := vars["id"]

	customer, err := h.customerService.Get(key)
	if err != nil {
		switch err {
		case app.ErrNotFound:
			respondWithError(w, http.StatusNotFound, err)
		default:
			respondWithErrorMessage(w, http.StatusInternalServerError, "Something went wrong. Try again later.")
		}

		return
	}

	respondWithJSON(w, http.StatusOK, customer)
}

func (h *CustomerHandler) Create(w http.ResponseWriter, r *http.Request) {
	customer, err := h.parseCustomer(r)

	if err != nil {
		switch err {
		case app.ErrNotFound:
			respondWithError(w, http.StatusNotFound, err)
		default:
			respondWithErrorMessage(w, http.StatusInternalServerError, "Something went wrong. Try again later.")
		}
		return
	}

	err = h.customerService.Create(customer)

	respondWithJSON(w, http.StatusAccepted, customer)

	return
}

func (h *CustomerHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	key := vars["id"]
	customer, err := h.parseCustomer(r)

	err = h.customerService.Update(key, customer)
	if err != nil {
		switch err {
		case app.ErrNotFound:
			respondWithError(w, http.StatusNotFound, err)
		default:
			respondWithErrorMessage(w, http.StatusInternalServerError, "Something went wrong. Try again later.")
		}
		return
	}

	respondEmpty(w, http.StatusNoContent)
}

func (h *CustomerHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	key := vars["id"]

	err := h.customerService.Delete(key)
	if err != nil {
		switch err {
		case app.ErrNotFound:
			respondWithError(w, http.StatusNotFound, err)
		default:
			respondWithErrorMessage(w, http.StatusInternalServerError, "Something went wrong. Try again later.")
		}
		return
	}

	respondEmpty(w, http.StatusNoContent)
}
