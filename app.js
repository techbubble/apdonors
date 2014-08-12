'use strict';

//dependencies
var Config = require('./config'),
    express = require('express'),
    mongoStore = require('connect-mongo')(express),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    mongoose = require('mongoose');

var config = new Config();
//create express app
var app = express();

//setup the web server
app.server = http.createServer(app);

//setup mongoose
app.db = mongoose.createConnection(config.mongodb.uri);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
  //and... we have a data store
});

//config data models
require('./models')(app, mongoose);

//setup the session store
app.sessionStore = new mongoStore({ url: config.mongodb.uri });

//config express in all environments
app.configure(function(){
  //settings
  app.disable('x-powered-by');
  app.set('port', config.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('strict routing', true);
  app.set('project-name', config.projectName);
  app.set('company-name', config.companyName);
  app.set('system-email', config.systemEmail);
  app.set('crypto-key', config.cryptoKey);
  app.set('require-account-verification', config.requireAccountVerification);

  //smtp settings
  if(config.smtp && config.smtp.from && config.smtp.from.name)
  	app.set('smtp-from-name', config.smtp.from.name);

  if(config.smtp && config.smtp.from && config.smtp.from.address)
    app.set('smtp-from-address', config.smtp.from.address);

  if(config.smtp && config.smtp.credentials)
    app.set('smtp-credentials', config.smtp.credentials);


  //twitter settings
  if(config.oauth && config.oauth.twitter && config.oauth.twitter.key)
    app.set('twitter-oauth-key', config.oauth.twitter.key);

  if(config.oauth && config.oauth.twitter && config.oauth.twitter.secret)
  	app.set('twitter-oauth-secret', config.oauth.twitter.secret);

  //github settings
  if(config.oauth && config.oauth.github && config.oauth.github.key)
    app.set('github-oauth-key', config.oauth.github.key);

  if(config.oauth && config.oauth.github && config.oauth.github.secret)
  	app.set('github-oauth-secret', config.oauth.github.secret);

  //facebook settings
  if(config.oauth && config.oauth.facebook && config.oauth.facebook.key)
  	app.set('facebook-oauth-key', config.oauth.facebook.key);

  if(config.oauth && config.oauth.facebook && config.oauth.facebook.secret)
  	app.set('facebook-oauth-secret', config.oauth.facebook.secret);

  //middleware
  app.use(express.favicon(__dirname + '/public/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.static(path.join(__dirname, 'public')));
  //Static route so that Angular JS files can be accessed
  app.use('/angular/js', express.static(path.join(__dirname, 'angular/js')));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: config.cryptoKey,
    store: app.sessionStore
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);

  //error handler
  app.use(require('./views/http/index').http500);

  //global locals
  app.locals.projectName = app.get('project-name');
  app.locals.copyrightYear = new Date().getFullYear();
  app.locals.copyrightName = app.get('company-name');
  app.locals.cacheBreaker = 'br34k-01';
});

//config express in dev environment
app.configure('development', function(){
  app.use(express.errorHandler());
});

//setup passport
require('./passport')(app, passport);

//route requests
require('./routes')(app, passport);

//setup utilities
app.utility = {};
app.utility.sendmail = require('drywall-sendmail');
app.utility.slugify = require('drywall-slugify');
app.utility.workflow = require('drywall-workflow');

//listen up
app.server.listen(app.get('port'), function(){
  //and... we're live
});
