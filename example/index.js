var express = require('express');
var app = express();

var server = require('http').createServer(app);

app.set('port', 1337);

app.use(express.json());
app.use(express.urlencoded());

var Batchman = require('../lib');
var batch = new Batchman();

batch.mount(app, function (msg) {
  // do stuff here
});

app.get('/', function (req, res) {
  res.send('hello guv');
});


server.listen(app.get('port'), function () {
  console.log('listening on port ' + app.get('port'));
});