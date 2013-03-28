// Requirements
var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    st = require('connect-static-transform');

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
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// Production configuration
app.configure('production', function () {
  stylusConfig.compress = true;
  stylusConfig.cache = true;
  stylusConfig.maxage = 3600;
  app.use(st.stylus(stylusConfig));
});

// Development configuration
app.configure('development', function () {
  app.use(express.errorHandler());
  app.use(st.stylus(stylusConfig));
});

// Set up routes
app.get('/song/:id', routes.meta.song);
app.get('/album/:id', routes.meta.album);
app.get('/artist/:id', routes.meta.artist);
app.get('/rdio/getPlaybackToken', routes.service.rdio.getPlaybackToken);
app.get('/rdio/search', routes.service.rdio.search);

// Launch server
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port %d!', app.get('port'));
});
