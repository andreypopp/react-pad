"use strict";

var express = require('express');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

function message(msg) {
  return [
    '<!doctype html>',
    '<script>',
    '(function() {',
    '  window.opener.postMessage(' + JSON.stringify(msg) + ', "*");',
    '  setTimeout(window.close, 10);',
    '})();',
    '</script>'
  ].join('\n');
}

function createApp(opts) {
  var app = express();

  passport.serializeUser(function(user, done) {
    done(null, JSON.stringify(user));
  });

  passport.deserializeUser(function(data, done) {
    try {
      var user = JSON.parse(data);
    } catch (err) {
      return done(err);
    }
    done(null, user);
  });

  passport.use(new GitHubStrategy({
    clientID: opts.clientID,
    clientSecret: opts.clientSecret,
    callbackURL: opts.callbackURL,
    scope: ['user', 'gist']
  },function(accessToken, refreshToken, profile, done) {
    done(null, {profile: profile, accessToken: accessToken});
  }));

  app.get('/github',
    passport.authenticate('github'));

  app.get('/github/callback', 
    passport.authenticate('github', {failureRedirect: '/'}),
    function(req, res) {
      res.send(message({user: req.user, type: 'auth'}));
    });

  return app;
}

module.exports = createApp;
