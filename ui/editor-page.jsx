var ReactApp        = require('react-app');
var React           = require('react-tools/build/modules/React');

var project         = require('../project');
var github          = require('../github');
var makeLogger      = require('./logger');
var PackageEditor   = require('./package-editor.jsx');
var PackageBrowser  = require('./package-browser.jsx');
var Scene           = require('./scene.jsx');
var ShowHide        = require('./show-hide.jsx');

var EditorAPI = {

  showBrowser: function() {
    this.setState({browserShown: true});
  },

  hideBrowser: function() {
    this.setState({browserShown: false});
  },

  edit: function(file) {
    this.debug('edit', file.filename);
    this.setState({active: file.filename});
  },

  exportToGist: function() {
    github.projectToGist(this.state.project, function(err, gist) {
      if (err) throw err;

      var proj = this.state.project;

      if (!proj.meta.repository) {
        proj.meta.repository = {
          type: 'git',
          url: gist.git_pull_url
        };
        project.metaChanged(proj);
        this.setState({project: proj});
        setTimeout(function() {
          github.projectToGist(proj, function(err) { if (err) throw err; });
        }, 5000);
      }
    }.bind(this));
  }

};

module.exports = ReactApp.createPage({
  mixins: [makeLogger('EditorPage'), EditorAPI],

  getInitialState: function() {
    var proj = project.create('unnamed');
    return {
      errors: {},
      project: proj,
      active: project.getExample(proj).filename,
      browserShown: false
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
        <ShowHide
          className="EditorPage__Browser"
          show={this.state.browserShown}
          onMouseEnter={this.showBrowser}
          onMouseLeave={this.hideBrowser}>
          <PackageBrowser
            active={this.state.active}
            onFileClick={this.edit}
            project={this.state.project}>
            <div className="EditorPage__ExportToGist" onClick={this.exportToGist}>
              Save as Gist
            </div>
          </PackageBrowser>
        </ShowHide>
      </div>
    );
  }
});
