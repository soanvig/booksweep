package main

type Bookmark struct {
	Guid     string
	Title    string
	Children []Bookmark
	Uri      string
}
