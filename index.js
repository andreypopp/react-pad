var fs = require('fs');
var ReactApp = require('react-app');
var express = require('express');

function createAuth(options) {
  var app = express();
  app.get('/callback', function(req, res, next) {
    var code = req.query.code;
    if (!code) return res.send(401);
    res.send([
      '<!doctype html>',
      '<script>',
      '  window.opener.postMessage(code, window.location);',
      '  window.close();',
      '</script>'
    ].join('\n'));
  });
  return app;
}

function createAPI(options) {
  var app = express();

  app.get('/components', function(req, res, next) {

  });

  app.get('/components/:user/:name', function(req, res, next) {

  });

  return app;
}

function createUI(options) {
  return ReactApp(require.resolve('./ui/index.jsx'), options);
}

function createApp(options) {
  var app = express();

  app.get('/frame', function(req, res, next) {
    fs.readFile(require.resolve('./ui/agent.js'), 'utf8', function(err, src) {
      if (err) return next(err);
      res.send('<!doctype html><script>' + src + '</script>');
    })
  });

  app.use(createUI(options));
  app.use('/api', createAPI(options));
  app.use('/auth', createAuth(options));
  return app;
}

module.exports = createApp;
