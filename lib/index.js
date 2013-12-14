var _ = require('lodash');
var request = require('request');
 
var BatchManager = function (opts) {
  
  // http xhr request batch api handler for outbound rest/rpc like calls
  // (c) 2013 davehigginbotham@gmail.com
 
  var options = opts || null;
 
  this.prefix = 'batchman';
 
  this.middleware = [];
 
  this.key = 'batchman';
 
  this.end = null;

  this.auth = {};
 
  if (options) {
    _.merge(this, options);
  };
 
  var self = this;

  // private fn to process requests, this is blocking -- fyi. 
  var processRequests = function (reqs, fn) {
 
    var reqs = reqs || null,
        respArray = [],
        i = 0,
        ln = reqs.length;
 
    while (ln--) {

      self.request(reqs[i], function (err, body) {

        respArray.push(body);

        // because we're cute.
        if (respArray.length === reqs.length) {
          return fn(null, respArray);
        };

      });
        
      i++;
      
    };
 
  };

  // public api wiring
  this.mount = function (app, fn) {
 
    var app = (typeof app != 'undefined') ? app : null;

    if (!app) {
      return new Error('You must provide access to express/connect for this to mount routes correctly.');
    };
   
    var self = this,
        prefix = '/' + self.prefix,
        out = 'Successfully mounted batchman to `' + prefix + '`';
   
    // assign our route
    app.post(prefix, self.middleware, self.batchRequests, self.end);
   
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
BatchManager.prototype.request = function (opts, fn) {
 
  var defaults = {
    url: null,
    qs: null,
    method: 'get',
    headers: {},
    form: {}
  };
 
  var options = opts || null;
 
  if (options) {
    _.merge(defaults, options);
  } else {
    return fn('You must provide options for request to work properly.', null);
  };
 
  if (defaults.url) {
 
    request(defaults, function (err, resp, body) {

      var output = {};

      // build our output object
      if (!err) {
        output = {
          path: defaults.url,
          method: defaults.method,
          body: (body) ? (typeof body == 'string') ? JSON.parse(body) : body : null,
          status: (resp) ? resp.statusCode : null
        };
      } else {
        output = {
          error: err,
          status: (rest) ? resp.statusCode : null
        };
      };

      return fn(null, output);
 
    });
  
  } else {
    return fn('You must provide a url string', null);
  };
 
};
 
module.exports = BatchManager;