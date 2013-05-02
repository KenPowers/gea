// Set global __appDir variable
__appDir = __dirname;

// Requirements
var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    st = require('connect-static-transform'),
    CC = require('express-cache-control');

// Create express app
var app = express();

// Stylus config
var stylusConfig = {
  root: path.join(__dirname, 'assets/styl'),
  path: '/css'
};

// General configuration
app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('cc', new CC().middleware);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.set('public', path.join(__dirname, 'public'));
});

// Production configuration
app.configure('production', function () {
  var oneDay = 60 * 60 * 24 * 1000;
  app.use(express.static(app.get('public'), {maxAge: oneDay}));
  app.set('domain', 'gea.kenpowers.net');
  stylusConfig.compress = true;
  stylusConfig.cache = true;
  stylusConfig.maxage = 3600;
  app.use(st.stylus(stylusConfig));
});

// Development configuration
app.configure('development', function () {
  app.use(express.static(app.get('public')));
  app.set('domain', 'localhost');
  app.set('cc', new CC({override: 0}).middleware);
  app.use(express.errorHandler());
  app.use(st.stylus(stylusConfig));
});

// Set up routes
var cache = app.get('cc')('minutes', 5), noCache = app.get('cc')(0);
app.get('/rdio/getPlaybackToken', noCache, routes.service.rdio.getPlaybackToken(app.get('domain')));
app.get('/rdio/search', cache, routes.service.rdio.search);
app.post('/rate', routes.rate.post); // Cannot cache POST anyway
app.get('/rate', cache, routes.rate.get);

// Launch server
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port %d!', app.get('port'));
});
