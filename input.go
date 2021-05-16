package main

import (
	"bufio"
	"os"
	"strings"
)

func ReadStdin() string {
	input := make([]string, 0)
	scanner := bufio.NewScanner(os.Stdin)
	buffer := make([]byte, 0, 1024*1024)
	scanner.Buffer(buffer, 2*1024*1024) // 2MB

	for scanner.Scan() {
		text := scanner.Text()
		input = append(input, text)
	}

	return strings.Join(input, "\n")
}
