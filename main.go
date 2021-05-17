package main

func main() {
	input := ReadStdin()
	bookmarks := Parse(input)

	PrettyPrint(Unwind(bookmarks))
}
