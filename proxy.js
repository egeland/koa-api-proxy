var request = require('koa-request');
var _ = require('lodash');

// This function is a proxy to access other APIs
// You define the prefix (in the app.use()) and the target,
// it will match the routes for you and proxy the result back..
module.exports.proxy = function(prefix, target, mustContain) { // Only for GET method
  return function *(next) {
    if (_.startsWith(this.url, prefix)) {
      var CACHETIME = 180; // Set caching to minimise traffic to target
      var TIMEOUT = 5000;  // Set target connections to timeout after this many ms
      var url = this.url.substr(prefix.length);

      // If we have no target, then we expect the target to be supplied, URI encoded
      if ((typeof target !== 'string') || (target === '')){
        url = decodeURIComponent(url);
        url = url.replace(/^\/*/,''); // Strip leading slashes
        target = '';
      }

      // We need to check if there is a mustContain and that we match it if it exists
      if ((typeof mustContain === 'string') && (!_.isEmpty(mustContain)) ) {
        if (url.search(mustContain) === -1) {
          this.body = {
            status: 'error',
            message: "Invalid URI supplied: '" +
                     url +
                     "' - missing '" +
                     mustContain + "'",
            statusCode: 400
          };
          this.status = 400;
          return;
        }
      }

      var proxyRequest = {
        url: target + url,
        headers: { 'User-Agent': 'API-Proxy' },
        encoding: null,
        timeout: TIMEOUT
      };

      var result;
      try {
        result = yield request.get(proxyRequest);
      } catch (err) {
        this.status = err.status || 500;
        this.body = {
          status: 'error',
          statusCode: err.status,
          message: err.message
        };
        this.app.emit('error', err, this);
        return;
      }

      if (result.statusCode !== 200) {
        this.status = result.statusCode || 500;
        this.body = {
          status: 'error',
          statusCode: this.status,
          message: JSON.parse(result.body)
        };
        this.app.emit('error', new Error(this.status), this);
        return;
      }

      this.status = 200;
      var contentType = result.headers['content-type'];
      if (contentType) {
        this.response.set('Content-Type', contentType);
      }
      var contentDisposition = result.headers['content-disposition'];
      if (contentDisposition) {
        this.response.set('Content-Disposition', contentDisposition);
      }
      this.body = {
        data: JSON.parse(result.body),
        status: 'ok',
        statusCode: this.status
      };
      this.response.set('Cache-Control','public, max-age=' + CACHETIME);
      this.response.set('Expires', (new Date((Math.floor(new Date().getTime() / 1000) + CACHETIME) * 1000)).toUTCString() );
      return;
    }
    yield next;
  };
};
