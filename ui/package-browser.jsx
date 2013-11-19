var React       = require('react-tools/build/modules/React');
var cx          = require('react-tools/build/modules/cx');
var map         = require('lodash').map;
var github      = require('../github');

var FileBrowser = React.createClass({
  render: function() {
    var onFileClick = this.props.onFileClick;
    var items = map(this.props.files, function(file) {
      var className = cx({
        'Button': true,
        'Button--active': file.filename === this.props.active
      });
      var onClick = onFileClick && onFileClick.bind(null, file);
      return <div onClick={onClick} className={className}>{file.filename}</div>;
    }.bind(this));

    return this.transferPropsTo(<div className="FileBrowser">{items}</div>);
  }
});

module.exports = React.createClass({
  render: function() {
    var proj = this.props.project;
    var gistID = github.getGistID(proj);
    var gistURL = gistID ? 'https://gist.github.com/' + gistID : null;

    return this.transferPropsTo(
      <div className="PackageBrowser">
        <div className="PackageBrowser__meta">
          <span className="PackageBrowser__name">{proj.meta.name}</span>
          <span className="PackageBrowser__version">{proj.meta.version}</span>
          <div className="PackageBrowser__description">{proj.meta.description}</div>
          {gistURL ?
            <a target="_blank" href={gistURL} className="PackageBrowser__gist">{gistURL}</a> :
            null}
        </div>
        <FileBrowser
          className="PackageBrowser__files"
          files={proj.files}
          active={this.props.active}
          onFileClick={this.props.onFileClick}
          />
        <div className="PackageBrowser__toolbar">
          {this.props.children}
        </div>
      </div>
    );
  }
});
