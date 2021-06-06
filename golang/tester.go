package main

import (
	"net/http"
)

func Test(url string) bool {
	_, err := http.Get(url)

	if err != nil {
		return false
	} else {
		return true
	}
}
