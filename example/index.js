var express = require('express'),
    app = express(),
    server = require('http').createServer(app);

app.set('port', 1337);
app.use(express.json());
app.use(express.urlencoded());

var Batchman = require('../lib');

var addGitHubUserAgent = function (req, res, next) {

  var ln = req.body.length;

  if (ln) {

    for (var i=0;i<ln;++i) {

      var bod = req.body[i];

      if (bod.hasOwnProperty('url') && /github.com/gi.test(bod.url)) {

        bod.headers = {
          "User-Agent": "dhigginbotham"
        };

      }

    };

  };

  return next();

};

var batch = new Batchman({
  middleware: [addGitHubUserAgent] // just like adding middleware into anything, accepts an array
});

batch.mount(app, function (msg) {
  // do stuff here if you want to wait 
  // for this to mount before doing 
  // anything else, maybe you're doing
  // some hot code swapping on the fly, idk
});

app.get('/', function (req, res) {
  res.send('hello guv');
});

server.listen(app.get('port'), function () {
  console.log('listening on port ' + app.get('port'));
});