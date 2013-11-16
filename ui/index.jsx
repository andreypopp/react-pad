var ReactApp = require('react-app');
var React = require('react-tools/build/modules/React');

var MultiEditor= require('./multi-editor.jsx');

require('./index.css');

var Scene = React.createClass({
  render: function() {
    return this.transferPropsTo(
      <div className="Scene">
        <iframe src="/frame" ref="frame"></iframe>
      </div>
    );
  },

  update: function() {
    var frame = this.refs.frame.getDOMNode();
    frame.contentWindow.postMessage(this.props.value, '*');
  },

  componentDidMount: function() {
    this.update();
  },

  componentDidUpdate: function() {
    this.update();
  }
});

var EditorPage = ReactApp.createPage({

  getInitialState: function() {
    return {value: 'var React = require("react-core");'};
  },

  onChange: function(value) {
    this.setState({value: value});
  },

  render: function() {
    var files = [
      {
        filename: 'example.jsx',
        displayName: 'Example',
        content: '<Component>Hello, world</Component>'
      },
      {
        filename: 'index.jsx',
        displayName: 'Component',
        content: "var React = require('react-core');\n\nmodule.exports = React.createClass({});\n"
      },
      {
        filename: 'index.css',
        displayName: 'Styles',
        content: ".Component {\n  font-weight: bold;\n}"
      }
    ];
    return (
      <div className="EditorPage">
        <Scene className="EditorPage__Scene" value={this.state.value || ''} />
        <MultiEditor
          className="EditorPage__Editor"
          files={files}
          value={this.state.value}
          onChange={this.onChange} />
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
