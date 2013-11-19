var GitHub    = require('github-api');
var isString  = require('lodash').isString;
var kew       = require('kew');

var project   = require('./project');

var LOCALSTORAGE_USER_KEY = 'react-pad.user';

/**
 * Get GitHub user via GitHub OAuth process.
 */
function getUserViaOAuth() {
  var promise = kew.defer();
  var waitForUser = function(e) {
    window.removeEventListener('message', waitForUser);
    var data = e.data;

    if (data.type !== 'auth')
      return;

    if (data.user !== undefined)
      promise.resolve(data.user)
    else
      promise.reject(new Error('missing user: ' + e.data));
  }
  window.addEventListener("message", waitForUser);
  window.open('/auth/github');
  return promise;
}

/**
 * Wrapper around getUserViaOAuth which caches user in localStorage so you don't
 * do GitHub OAuth everytime you need a user.
 *
 * May trigger OAuth authentication process.
 */
function getUser() {
  if (localStorage[LOCALSTORAGE_USER_KEY]) {
    try {
      var promise = kew.resolve(JSON.parse(localStorage['react-pad.user']));
    } catch(err) {
      var promise  = getUserViaOAuth();
    }
  } else {
    var promise = getUserViaOAuth();
  }
  return promise.then(function(user) {
    localStorage.setItem(LOCALSTORAGE_USER_KEY, JSON.stringify(user));
    return user;
  });
}

/**
 * Get authenticated GitHub API interface.
 *
 * May trigger OAuth authentication process.
 */
function getAPI() {
  return getUser().then(function(user) {
    return new GitHub({auth: 'oauth', token: user.accessToken});
  });
}

function getGistID(proj) {
  var url = isString(proj.meta.repository) ?
    proj.meta.repository :
    proj.meta.repository && isString(proj.meta.repository.url) ?
    proj.meta.repository.url :
    undefined;

  if (url === null)
    return undefined;

  var m = /\/([^\.]+)\.git$/.exec(url);

  if (!m)
    return undefined;

  return m[1];
}

/**
 * Save project as gist.
 *
 * May trigger OAuth authentication process.
 */
function saveProjectToGist(proj) {
  return getAPI().then(function(api) {
    var gistID = getGistID(proj);
    var gist = api.getGist(gistID);

    var files = {};
    for (var filename in proj.files) {
      if (proj.files[filename].content.length > 0)
        files[filename] = {
          content: proj.files[filename].content
        }
    }

    var description = proj.meta.description ?
      proj.meta.name + ': ' + proj.meta.description :
      proj.meta.name;

    var data = {
      description: description,
      public: true,
      files: files
    };

    var promise = kew.defer();
    gistID ?
      gist.update(data, promise.makeNodeResolver()) :
      gist.create(data, promise.makeNodeResolver());
    return promise;
  });
}

function getProjectFromGist(id) {
  var promise = kew.defer();
  var api = new GitHub({});
  api.getGist(id).read(function(err, gist) {
    if (err) return promise.reject(err);
    var proj = project.createFromFiles(gist.files);
    promise.resolve(proj);
  });
  return promise;
}

module.exports = {
  getGistID: getGistID,
  saveProjectToGist: saveProjectToGist,
  getProjectFromGist: getProjectFromGist
}

