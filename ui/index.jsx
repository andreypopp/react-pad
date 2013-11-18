var ReactApp    = require('react-app');
var React       = require('react-tools/build/modules/React');
var detective   = require('detective');
var assign      = require('lodash').assign;

var project     = require('../project');
var makeLogger  = require('./logger');
var MultiEditor = require('./multi-editor.jsx');
var Scene       = require('./scene.jsx');

require('./index.css');

var EditorPage = ReactApp.createPage({
  mixins: [makeLogger('EditorPage')],

  getInitialState: function() {
    var proj = project.create('unnamed');
    return {errors: {}, project: proj};
  },

  onUpdate: function(file) {
    this.debug('onUpdate', file.filename);

    var proj = this.state.project;
    proj = project.fileChanged(proj, file);
    this.setState({project: proj});
  },

  render: function() {
    return (
      <div className="EditorPage">
        <Scene className="EditorPage__Scene"
          project={this.state.project}
          errors={this.state.errors}
          />
        <MultiEditor
          className="EditorPage__Editor"
          files={this.state.project.files}
          onUpdate={this.onUpdate} />
      </div>
    );
  }
});

module.exports = ReactApp.createApp({
  routes: {
    '/': EditorPage
  },

  appDidStart: function() {
    window.addEventListener('message', function(ev) {
      var token = event.data;
      localStorage.setItem('react-pad.github.token', token);
    });
  }
});
