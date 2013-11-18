var ReactApp        = require('react-app');
var React           = require('react-tools/build/modules/React');

var project         = require('../project');
var makeLogger      = require('./logger');
var PackageEditor   = require('./package-editor.jsx');
var PackageBrowser  = require('./package-browser.jsx');
var Scene           = require('./scene.jsx');

var EditorAPI = {

  showBrowser: function() {
    var node = this.refs.browser.getDOMNode();
    node.classList.add('EditorPage__Browser--active');
  },

  hideBrowser: function() {
    var node = this.refs.browser.getDOMNode();
    node.classList.remove('EditorPage__Browser--active');
  },

  edit: function(file) {
    this.debug('edit', file.filename);
    this.setState({active: file.filename});
  }

};

module.exports = ReactApp.createPage({
  mixins: [makeLogger('EditorPage'), EditorAPI],

  getInitialState: function() {
    var proj = project.create('unnamed');
    return {
      errors: {},
      project: proj,
      active: 'example.jsx'
    };
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
        <PackageEditor
          active={this.state.active}
          className="EditorPage__Editor"
          files={this.state.project.files}
          onUpdate={this.onUpdate} />
        <PackageBrowser ref="browser"
          onMouseEnter={this.showBrowser}
          onMouseLeave={this.hideBrowser}

          active={this.state.active}
          onFileClick={this.edit}
          className="EditorPage__Browser"
          project={this.state.project} />
      </div>
    );
  }
});
