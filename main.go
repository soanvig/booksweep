package main

import "fmt"

func main() {
	input := ReadStdin()
	bookmarks := Unwind(Parse(input))
	notWorkingBookmarks := make([]Bookmark, 0)

	for _, bookmark := range bookmarks {
		if bookmark.Uri != "" && !Test(bookmark.Uri) {
			notWorkingBookmarks = append(notWorkingBookmarks, bookmark)
		}
	}

	fmt.Println("All bookmarks")
	PrettyPrint(bookmarks)

	fmt.Println("Not working bookmarks:")
	PrettyPrint(notWorkingBookmarks)
}
