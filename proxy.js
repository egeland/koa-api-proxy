var request = require('koa-request');
var _ = require('lodash');

// This function is a proxy to access other APIs
// You define the prefix (in the app.use()) and the target,
// it will match the routes for you and proxy the result back..
module.exports.proxy = function(prefix, target) { // Only for GET method
  return function *(next) {
    if (_.startsWith(this.url, prefix)) {
      var CACHETIME = 180; // Set caching to minimise traffic to target
      var url = this.url.substr(prefix.length);
      url = target + url;
      var result = yield request.get({
        url: url,
        headers: { 'User-Agent': 'UCMS-Dash-API-Proxy' },
        encoding: null
      });
      if (result.statusCode !== 200) this.throw(result.statusCode);
      this.status = 200;
      var contentType = result.headers['content-type'];
      if (contentType) {
        this.response.set('Content-Type', contentType);
      }
      var contentDisposition = result.headers['content-disposition'];
      if (contentDisposition) {
        this.response.set('Content-Disposition', contentDisposition);
      }
      this.body = result.body;
      this.response.set('Cache-Control','public, max-age=' + CACHETIME);
      this.response.set('Expires', (new Date((Math.floor(new Date().getTime() / 1000) + CACHETIME) * 1000)).toUTCString() );
      return;
    }
    yield next;
  };
};
