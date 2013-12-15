var _ = require('lodash'),
    request = require('request'),
    sloth = require('sloth');
 
var Batchman = function (opts) {
  
  // http xhr request batch api handler for outbound rest/rpc like calls
  // (c) 2013 davehigginbotham@gmail.com
 
  var options = opts || null;
 
  // prefix for your endpoint
  this.prefix = 'batchman';

  this.delay = '20ms';
 
  // regular express like middleare
  this.middleware = [];

  // filter your response
  this.filter = [];
 
  // key that gets added to the request object
  this.key = null;
 
  // endpoint for your api, helpful if you want
  // to do things specific to the model response
  this.end = null;

  // merge some options
  if (options) {
    _.merge(this, options);
  };
 
  var self = this;

  var s = new sloth({
    delay: self.delay
  });

  var processRequests = function (reqs, fn) {
 
    var reqs = reqs || null,
        respArray = [],
        ln = reqs.length;

    reqs.forEach(function (request, i) {

      s.mon(function (callback) {

        callback(request, function (err, body) {

          respArray.push(body);

          // because we're cute.
          if (respArray.length === ln) {
            return fn(null, respArray);
          };

        });

      }, self.request);
        
    });
 
  };

  // use `batch.mount(app)` to build an endpoint and get all
  // the functionality of the module
  this.mount = function (app, fn) {
 
    var app = (typeof app != 'undefined') ? app : null;

    if (!app) {
      return new Error('You must provide access to express/connect for this to mount routes correctly.');
    };
   
    var self = this,
        prefix = '/' + self.prefix,
        out = 'Successfully mounted batchman to `' + prefix + '`';
   
    // assign our route
    app.post(prefix, self.middleware, self.batchRequests, self.filter, self.end);
   
    return (typeof fn != 'undefined') ? fn(out) : true;
   
  };
 
  // semi public api middleware, useable outside of the module
  this.batchRequests = function (req, res, next) {
 
    if (req.body) {
 
      processRequests(req.body, function (err, resp) {
 
        req[self.key] = resp;
        
        return next();
 
      });
 
    };
 
  };

  // if you dont assign a key, we'll set it to the
  // prefix.
  if (!this.key) {

    this.key = this.prefix;

  }
 
  // allows you to set your own endpoint, otherwise
  // we quickly add one for you.
  if (!this.end) {
 
    this.end = function (req, res) {
 
      res.send(req[self.key]);
 
    };
 
  };

  return this;
 
};
 
// use publically at your own risk, alternatively just use
// [request](https://www.github.com/mikael/request).
Batchman.prototype.request = function (opts, fn) {
 
  var args = {
    url: null,
    qs: null,
    method: 'get',
    headers: {},
    form: {}
  };
 
  var options = opts || null,
      ms = Date.now();
 
  if (options) {
    _.merge(args, options);
  } else {
    return fn('You must provide options for request to work properly.', null);
  };

 
  if (args.url) {
    
    args.method = args.method.toUpperCase();
 
    request(args, function (err, resp, body) {

      var output = {};

      // build our output object
      if (!err) {
        output = {
          body: (body) ? (typeof body == 'string') ? JSON.parse(body) : body : null,
          path: args.url,
          method: args.method,
          status: (resp) ? resp.statusCode : null,
          time: Date.now() - ms + 'ms'
        };
      } else {
        output = {
          error: err,
          status: (resp) ? resp.statusCode : null,
          time: Date.now() - ms + 'ms'
        };
      };

      return fn(null, output);
 
    });
  
  } else {
    return fn('You must provide a url string', null);
  };
 
};
 
module.exports = Batchman;