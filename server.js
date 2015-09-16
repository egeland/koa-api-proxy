var koa = require('koa');
var router = require('koa-router')();
var cors = require('koa-cors');
var _ = require('lodash');
var routes = require('./routes');
var proxy = require('./proxy').proxy;
var config = require('./config.json');

var app = koa();

// Ensure we allow access
app.use(cors({
  methods: ['GET','HEAD']
}));

// Routes
router.get('/', routes.hello);

// Set up proxies, if any are supplied in config file
if ((config.proxy) && (config.proxy.length > 0)) {
  _.forEach(config.proxy, function (prx) {
    app.use(proxy(prx.prefix, prx.target, prx.mustContain));
  });
}

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(config.port);

console.log('listening on port ' + config.port);
