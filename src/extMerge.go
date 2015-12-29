package main

import (
  "os"
  "os/exec"
)

func main() {
  exec.Command("kdiff3", os.Args[1:]...).Run()
}
