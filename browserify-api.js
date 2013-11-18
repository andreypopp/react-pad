"use strict";

var path = require('path');
var crypto = require('crypto');
var fs = require('fs');
var kew = require('kew');
var express = require('express');
var browserify = require('browserify');
var mktemp = require('mktemp');
var npm = require('npm');

function createApp(opts) {
  var directory = path.resolve(
                    opts.directory ||
                    path.join(process.cwd(), '.browserify-api'));

  var builds = {};

  var app = express();

  app.get('/partial', function(req, res, next) {
    var modules = parseModules(req.query.modules);

    buildPartial(modules).then(function(bundle) {
      res.send(bundle);
    }, next);
  });

  return app;

  function buildPartial(modules) {
    var key = getKey(modules);
    var build = builds[key] || kew.resolve();

    return build
      .then(function() {
        return checkCache(key).then(function(maybeBundle) {
          if (maybeBundle !== null)
            return maybeBundle;

          return ensureModulesInstalled(modules)
            .then(bundlePartial.bind(null, modules))
            .then(cacheBundle.bind(null, key));
        });
      })
      .then(function(val) {
        delete builds[key];
        return val;
      }, function(err) {
        delete builds[key];
        throw err;
      });
  }

  function parseModules(value) {
    var modules = value
      .split(' ')
      .filter(function(mod) {
        return Boolean(mod) && mod[0] !== '-';
      });
    modules.sort();
    return modules;
  }

  function getKey(modules) {
    return crypto.createHash('sha1')
      .update(modules.join('_'))
      .digest('hex');
  }

  function checkCache(key) {
    var filename = path.join(directory, key);
    var promise = kew.defer();
    fs.exists(filename, function(exists) {
      if (!exists) return promise.resolve(null);
      fs.readFile(filename, 'utf8', promise.makeNodeResolver());
    });
    return promise;
  }

  function cacheBundle(key, code) {
    var filename = path.join(directory, key);
    return writeFileTransaction(filename, code, 'utf8')
      .then(function() { return code; });
  }

  function ensureModulesInstalled(modules) {
    var promise = kew.defer();
    var npmConfig = {
      global: true,
      prefix: directory
    };
    npm.load(npmConfig, function(err) {
      if (err) return promise.reject(err);
      npm.commands.install(modules, promise.makeNodeResolver());
    });
    return promise;
  }

  function bundlePartial(modules) {
    var promise = kew.defer();
    var b = browserify({basedir: path.join(directory, 'lib')});

    modules.forEach(function(mod) {
      b.require(mod, {expose: mod});
    });
    b.bundle(null, promise.makeNodeResolver());

    return promise;
  }
}

function promisify(func) {
  return function() {
    var promise = kew.defer();
    Array.prototype.push.call(arguments, promise.makeNodeResolver());
    try {
      func.apply(this, arguments);
    } catch(err) {
      promise.reject(err);
    }
    return promise;
  };
}

var createTempFile = promisify(mktemp.createFile);
var writeFile = promisify(fs.writeFile);
var rename = promisify(fs.rename);

function writeFileTransaction() {
  var args = Array.prototype.slice.call(arguments, 0);
  var filename = args.shift();
  return createTempFile('browserify-api-XXXXXX')
    .then(function(tempfile) {
      args.unshift(tempfile);
      return writeFile.apply(null, args).then(function(value) {
        return rename(tempfile, filename).then(function() {
          return value;
        });
      })
      .then(null, function(err) {
        fs.unlink(tempfile);
        throw err;
      });
    });
}

module.exports = createApp;
