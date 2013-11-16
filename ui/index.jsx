var ReactApp = require('react-app');
var React = require('react-tools/build/modules/React');

var MultiEditor = require('./multi-editor.jsx');
var Scene = require('./scene.jsx');

require('./index.css');

var EditorPage = ReactApp.createPage({

  getInitialState: function() {
    var files = {
      'example.jsx': {
        filename: 'example.jsx',
        displayName: 'example',
        content: '<Component>Hello, world</Component>'
      },
      'index.jsx': {
        filename: 'index.jsx',
        displayName: 'component',
        content: "var React = require('react-core');\n\nmodule.exports = React.createClass({});\n"
      },
      'index.css': {
        filename: 'index.css',
        displayName: 'styles',
        content: ".Component {\n  font-weight: bold;\n}"
      }
    }
    return {files: files};
  },

  onChange: function(value) {
    this.setState({value: value});
  },

  render: function() {
    return (
      <div className="EditorPage">
        <Scene className="EditorPage__Scene"
          example={this.state.files['example.jsx']}
          component={this.state.files['index.jsx']}
          styles={this.state.files['index.css']}
          value={this.state.value || ''}
          />
        <MultiEditor
          className="EditorPage__Editor"
          files={this.state.files}
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
