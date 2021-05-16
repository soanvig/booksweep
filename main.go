package main

import "fmt"

func main() {
	input := ReadStdin()
	bookmarks := Parse(input)

	fmt.Printf("%+v", bookmarks)
}
