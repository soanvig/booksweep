package main

import (
	"encoding/json"
	"fmt"
)

type Bookmark struct {
	title    string
	children []Bookmark
}

func Parse(input string) Bookmark {
	var tree Bookmark

	err := json.Unmarshal([]byte(input), &tree)

	if err != nil {
		fmt.Println(err)
	}

	return tree
}
