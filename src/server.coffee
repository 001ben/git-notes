express = require 'express'
marked = require 'marked'
fs = require 'fs'
path = require 'path'

app = express()

app.set 'views', './dist/'
app.set 'view engine', 'jade'

app.get '/', (req, res) ->
  fs.readFile './git-things.md', (err, data) ->
    if err?
      res.json(err);
    else
      res.render 'index', {title: 'Hey', message: 'Welcome to ben', markdownContent: marked(data.toString())}
    return
  return

app.get '/css', (req, res) ->
  res.sendFile __dirname + '/styles.css'

app.get '/github-css', (req, res) ->
  res.sendFile path.resolve __dirname, '../node_modules/github-markdown-css/github-markdown.css'

app.listen 80, ->
  console.log 'listening'
