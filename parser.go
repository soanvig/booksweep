package main

import (
	"encoding/json"
	"log"
)

func Unwind(bookmark Bookmark) []Bookmark {
	if len(bookmark.Children) == 0 {
		return []Bookmark{bookmark}
	}

	unwindedChildren := make([]Bookmark, 0)

	for _, child := range bookmark.Children {
		unwindedChildren = append(unwindedChildren, Unwind(child)...)
	}

	return append([]Bookmark{bookmark}, unwindedChildren...)
}

func Parse(input string) Bookmark {
	var tree Bookmark

	err := json.Unmarshal([]byte(input), &tree)

	if err != nil {
		log.Fatalf(err.Error())
	}

	return tree
}
