var ReactApp    = require('react-app');
var React       = require('react-tools/build/modules/React');
var EditorPage  = require('./editor-page.jsx');

require('./index.css');

module.exports = ReactApp.createApp({
  routes: {
    '/': EditorPage,
    '/component/:id': EditorPage
  },

  appDidStart: function() {
    window.addEventListener('message', function(ev) {
      var token = event.data;
      localStorage.setItem('react-pad.github.token', token);
    });
  }
});
