var ReactApp = require('react-app');
var React = require('react-tools/build/modules/React');
var detective = require('detective');

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
    return {files: files, errors: {}};
  },

  onUpdate: function(file, content) {
    console.log('onUpdate');
    var errors = this.state.errors;
    if (errors[file.filename] !== undefined) {
      delete errors[file.filename];
      this.setState({errors: errors});
    }
  },

  onError: function(file, err) {
    console.log('onError');
    var errors = this.state.errors;
    errors[file.filename] = err;
    this.setState({errors: errors});
  },

  validate: function(file, content) {
    if (/\.jsx?$/.exec(file.filename)) {
      var deps = detective(content);
      console.log(file.filename, deps);
    }
  },

  render: function() {
    return (
      <div className="EditorPage">
        <Scene className="EditorPage__Scene"
          errors={this.state.errors}
          example={this.state.files['example.jsx']}
          component={this.state.files['index.jsx']}
          styles={this.state.files['index.css']}
          value={this.state.value || ''}
          />
        <MultiEditor
          className="EditorPage__Editor"
          files={this.state.files}
          validate={this.validate}
          onError={this.onError}
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
