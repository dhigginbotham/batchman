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
 
  if (options) {
    _.merge(this, options);
  };
 
  var self = this;
 
  var processRequests = function (reqs, fn) {
 
    var reqs = reqs || null;
 
    var respArray = [];
 
    var i = 0;
 
    var ln = reqs.length;
 
    while (ln--) {

      self.request(reqs[i], function (err, body) {

        respArray.push(body);

        if (respArray.length === reqs.length) {
          return fn(null, respArray);
        };

      });
        
      i++;
      
    };
 
  };
 
  this.batchRequests = function (req, res, next) {
 
    if (req.body) {
 
      processRequests(req.body, function (err, resp) {
 
        req[self.key] = resp;
        
        return next();
 
      });
 
    };
 
  };
 
  if (!this.end) {
 
    this.end = function (req, res) {
 
      res.send(req[self.key]);
 
    };
 
  };
 
  return this;
 
};
 
BatchManager.prototype.request = function (opts, fn) {
 
  var defaults = {
    url: null,
    qs: null,
    method: 'get',
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

      var output = {
        path: defaults.url,
        method: defaults.method,
        body: (body) ? JSON.parse(body) : null,
        status: (resp) ? resp.statusCode : null,
        err: (err) ? err : null
      };

      return fn(null, output);
 
    });
  
  } else {
    return fn('You must provide a url string', null);
  };
 
};
 
BatchManager.prototype.mount = function (app, fn) {
 
  var app = (typeof app != 'undefined') ? app : null;
 
  if (!app) {
    return new Error('You must provide access to express/connect for this to mount routes correctly.');
  };
 
  var self = this;
 
  var prefix = '/' + self.prefix;

  var out = 'Successfully mounted batchman to `' + prefix + '`';
 
  app.post(prefix, self.middleware, self.batchRequests, self.end);
 
  return (typeof fn != 'undefined') ? fn(out) : true;
 
};
 
module.exports = BatchManager;