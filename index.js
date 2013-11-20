"use strict";

var fs        = require('fs');
var ReactApp  = require('react-app');
var express   = require('express');
var passport  = require('passport');
var auth      = require('./auth');

function createUI(opts) {
  opts.style = require.resolve('./ui/index.css');
  opts.cssTransform = []
    .concat(opts.cssTransform)
    .concat([
      'xcss/transforms/autoprefixer',
      'xcss/transforms/vars',
      'rework-macro',
      'xcss/transforms/extend',
      'xcss-inline-woff'
    ]);
  return ReactApp(require.resolve('./ui/index.jsx'), opts);
}

function createApp(opts) {
  var app = express();

  if (!opts.secret) {
    console.warn('warning: no secret provided in config, on will be generated');
    var rng = require('crypto').rng;
    opts.secret = rng(32).toString('hex');
  }

  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.session({secret: opts.secret}));
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/frame', function(req, res, next) {
    fs.readFile(require.resolve('./ui/agent.js'), 'utf8', function(err, src) {
      if (err) return next(err);
      res.send('<!doctype html><script>' + src + '</script>');
    })
  });

  app.use('/auth', auth(opts.auth));
  app.use(createUI(opts));

  return app;
}

module.exports = createApp;
