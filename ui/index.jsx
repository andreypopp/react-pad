var ReactApp    = require('react-app');
var React       = require('react-tools/build/modules/React');
var EditorPage  = require('./editor-page.jsx');

module.exports = ReactApp.createApp({
  '/': EditorPage,
  '/component/:id': EditorPage
}, {
  started: function() {
    window.addEventListener('message', function(ev) {
      var token = event.data;
      localStorage.setItem('react-pad.github.token', token);
    });
  }
});
