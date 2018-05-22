package http

import (
	"encoding/json"
	"net/http"
)

func respondWithErrorMessage(w http.ResponseWriter, code int, message string) {
	respondWithJSON(w, code, map[string]string{"error": message})
}

func respondWithError(w http.ResponseWriter, code int, err error) {
	respondWithErrorMessage(w, code, err.Error())
}

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

func respondEmpty(w http.ResponseWriter, code int) {
	w.WriteHeader(code)
}

var ListenAndServe = http.ListenAndServe
