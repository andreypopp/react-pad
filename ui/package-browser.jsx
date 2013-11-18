var React       = require('react-tools/build/modules/React');
var cx          = require('react-tools/build/modules/cx');
var map         = require('lodash').map;

module.exports = React.createClass({
  render: function() {
    var proj = this.props.project;
    var active = this.props.active;

    var items = map(proj.files, function(file) {
      var className = cx({
        'PackageBrowser__file': true,
        'PackageBrowser__file--active': file.filename === active
      });
      return (
        <div
            onClick={this.props.onFileClick && this.props.onFileClick.bind(null, file)}
            className={className}>
          {file.filename}
        </div>
      );
    }.bind(this));

    return this.transferPropsTo(
      <div className="PackageBrowser">
        <div className="PackageBrowser__meta">
          <span className="PackageBrowser__name">{proj.meta.name}</span>
          <span className="PackageBrowser__version">{proj.meta.version}</span>
          <div className="PackageBrowser__description">{proj.meta.description}</div>
        </div>
        <div className="PackageBrowser__files">
          {items}
        </div>
        <div className="PackageBrowser__toolbar">
          {this.props.children}
        </div>
      </div>
    );
  }
});
