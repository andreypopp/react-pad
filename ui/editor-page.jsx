var React           = require('react-tools/build/modules/React');
var kew             = require('kew');

var project         = require('../project');
var github          = require('../github');
var makeLogger      = require('./logger');
var PackageEditor   = require('./package-editor.jsx');
var PackageBrowser  = require('./package-browser.jsx');
var Scene           = require('./scene.jsx');
var ShowHide        = require('./show-hide.jsx');
var Button          = require('./button.jsx');

var EditorAPI = {

  showBrowser: function() {
    this.setState({browserShown: true});
  },

  hideBrowser: function() {
    this.setState({browserShown: false});
  },

  edit: function(file) {
    this.setState({active: file.filename});
  },

  exportToGist: function() {
    github.saveProjectToGist(this.state.project)
      .then(function(gist) {
        var proj = this.state.project;

        if (!proj.meta.repository) {
          proj.meta.repository = {
            type: 'git',
            url: gist.git_pull_url
          };
          project.metaChanged(proj);
          this.setState({project: proj});
          setTimeout(function() {
            github.saveProjectToGist(proj).end();
          }, 1000);
        }
      }.bind(this))
      .end();
  }

};

module.exports = React.createClass({
  mixins: [makeLogger('EditorPage'), EditorAPI],

  getInitialState: function() {
    var proj = this.props.data || project.create('unnamed');
    return {
      errors: {},
      project: proj,
      active: project.getExample(proj).filename,
      browserShown: false
    };
  },

  getData: function() {
    if (this.props.request.params.id) {
      return github.getProjectFromGist(this.props.request.params.id);
    } else {
      return kew.resolve(undefined);
    }
  },

  onUpdate: function(file) {
    var proj = this.state.project;
    proj = project.fileChanged(proj, file);
    this.setState({project: proj});
  },

  render: function() {
    var gistID = github.getGistID(this.state.project);
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
            <Button
              label={gistID ? "Save revision" : "Save as gist"}
              icon="github"
              onClick={this.exportToGist} />
            <Button
              href="/"
              label="Create new component"
              icon="pencil" />
          </PackageBrowser>
        </ShowHide>
      </div>
    );
  }
});
