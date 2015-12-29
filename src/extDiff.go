package main

import (
  "os"
  "os/exec"
  "regexp"
)

func main() {
  newFile, oldFile := os.Args[5], os.Args[2]

  replaceUnixNulls(&newFile)
  replaceUnixNulls(&oldFile)

  exec.Command("extMerge", newFile, oldFile).Run()
}

func replaceUnixNulls(str *string) {
  if ok, _ := regexp.MatchString(".*\\/dev\\/null.*", *str); ok {
    *str = "src/blank"
  }
}
