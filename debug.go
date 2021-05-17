package main

import (
	"encoding/json"
	"fmt"
	"log"
)

func PrettyPrint(v interface{}) {
	output, err := json.MarshalIndent(v, "", "  ")

	if err != nil {
		log.Fatalf(err.Error())
	}

	fmt.Printf("%s\n", string(output))
}
