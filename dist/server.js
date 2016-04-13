(function() {
  var app, express, fs, marked, path;

  express = require('express');

  marked = require('marked');

  fs = require('fs');

  path = require('path');

  app = express();

  app.set('views', './dist/');

  app.set('view engine', 'jade');

  app.get('/', function(req, res) {
    fs.readFile('./README.md', function(err, data) {
      if (err != null) {
        res.json(err);
      } else {
        res.render('index', {
          title: 'git notes',
          markdownContent: marked(data.toString())
        });
      }
    });
  });

  app.get('/css', function(req, res) {
    return res.sendFile(__dirname + '/styles.css');
  });

  app.get('/github-css', function(req, res) {
    return res.sendFile(path.resolve(__dirname, '../node_modules/github-markdown-css/github-markdown.css'));
  });

  app.listen(80, function() {
    return console.log('listening');
  });

}).call(this);
