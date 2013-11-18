var React = require('react-tools/build/modules/React');
var cx = require('react-tools/build/modules/cx');
var map = require('lodash').map;
var Editor = require('./editor.jsx');

module.exports = React.createClass({
  getInitialState: function() {
    return {active: null};
  },

  onActivate: function(id) {
    this.setState({active: id});
  },

  onChange: function(file, content) {
    file.content = content;
    if (this.props.onChange) this.props.onChange(file);
  },

  render: function() {
    var active = this.state.active ||
      this.props.active ||
      'example.jsx';

    var tabs = map(this.props.files, function(file) {
      return {
        id: file.filename,
        name: file.displayName ? (file.displayName + ' (' + file.filename + ')') : file.filename
      };
    });

    var editors = map(this.props.files, function(file) {
      var className = cx({
        'PackageEditor__Editor': true,
        'PackageEditor__Editor--active': active === file.filename
      });
      return (
        <div className={className}>
          <div className="PackageEditor__Editor__filename">
            {file.filename}
          </div>
          <Editor value={file.content || ''}
            validate={this.props.validate && this.props.validate.bind(null, file)}
            onError={this.props.onError && this.props.onError.bind(null, file)}
            onUpdate={this.props.onUpdate && this.props.onUpdate.bind(null, file)}
            onChange={this.onChange.bind(null, file)} />
        </div>
      );
    }.bind(this));

    return this.transferPropsTo(
      <div className="PackageEditor">
        <div className="PackageEditor__Editors">{editors}</div>
      </div>
    );
  }
});
