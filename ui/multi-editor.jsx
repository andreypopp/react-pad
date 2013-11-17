var React = require('react-tools/build/modules/React');
var cx = require('react-tools/build/modules/cx');
var map = require('lodash').map;
var Editor = require('./editor.jsx');

var Button = React.createClass({
  render: function() {
    return this.transferPropsTo(<a className="Button">{this.props.label}</a>);
  }
});

var TabBar = React.createClass({
  render: function() {
    var active = this.props.active;
    var tabs = this.props.tabs.map(function(tab, idx) {
      var className = cx({
        'TabBar__Button': true,
        'TabBar__Button--active': !active && idx === 0 || active === tab.id
      })
      return <Button
        onClick={this.props.onActivate && this.props.onActivate.bind(null, tab.id)}
        className={className}
        label={tab.name} />
    }.bind(this));
    return this.transferPropsTo(<div className="TabBar">{tabs}</div>);
  }
});

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
        'MultiEditor__Editor': true,
        'MultiEditor__Editor--active': active === file.filename
      });
      return (
        <div className={className}>
          <div className="MultiEditor__Editor__filename">
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
      <div className="MultiEditor">
        <TabBar className="MultiEditor__Toolbar"
          active={active}
          onActivate={this.onActivate}
          tabs={tabs} />
        <div className="MultiEditor__Editors">{editors}</div>
      </div>
    );
  }
});
