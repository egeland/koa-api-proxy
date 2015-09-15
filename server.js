var koa = require('koa');
var router = require('koa-router')();
var cors = require('koa-cors');
var _ = require('lodash');
var routes = require('./routes');
var proxy = require('./proxy').proxy;
var config = require('./config.json');

var app = koa();

router.get('/', routes.hello);

// Ensure we allow access
app.use(cors({
  methods: ['GET','HEAD']
}));

// Set up proxies, if any are supplied in config file
if (config.proxy.length > 0) {
  _.forEach(config.proxy, function (prx) {
    app.use(proxy(prx.prefix, prx.target));
  });
}

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000);

console.log('listening on port 3000');
