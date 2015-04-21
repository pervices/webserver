var express = require('express');
var app = express();

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index', {
     title: "Crimson"
  });
});

app.get('/rx', function (req, res) {
  res.render('rx', {
     title: "RX Chain"
  });
});

app.get('/tx', function (req, res) {
  res.render('tx', {
     title: "TX Chain"
  });
});

app.get('/clock', function (req, res) {
  res.render('clock', {
     title: "Clock"
  });
});

app.get('/config', function (req, res) {
  res.render('config', {
     title: "Configuration"
  });
});

app.get('/debug', function (req, res) {
  res.render('debug', {
     title: "Debug"
  });
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
