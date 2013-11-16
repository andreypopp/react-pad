var GitHub = require('github-api');

var GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize' +
                      '?client_id=58a3dcf21a0bae21db44&scope=gist';

var LOCALSTORAGE_KEY = 'react-pad.github.token';

function getToken(cb) {
  var token = localStorage.getItem(LOCALSTORAGE_KEY) || null;
  if (token !== null) return cb(null, token);
  window.open(GITHUB_AUTH_URL);
  var onMessage = function(ev) {
    var token = event.data;
    localStorage.setItem(LOCALSTORAGE_KEY, token);
    window.removeEventListener('message', onMessage);
    cb(null, token);
  }
  window.addEventListener('message', onMessage);
}


function getAPI(cb) {
  getToken(function(err, token) {
    if (err) return cb(err);
    cb(null, new GitHub({token: token}));
  });
}

module.exports = getAPI;
module.exports.getToken = getToken;
