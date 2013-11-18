var React       = require('react-tools/build/modules/React');

var makeLogger  = require('./logger');
var project     = require('../project');

var Errors = React.createClass({
  render: function() {
    var errors = [];
    for (var filename in this.props.errors)
      errors.push(
        <li className="Errors__Error">
          <span className="Errors__filename">{filename}: </span>
          <span className="Errors__desc">{this.props.errors[filename].toString()}</span>
        </li>
      );
    var style = {display: errors.length > 0 ? 'block' : 'none'};
    return <ul style={style} className="Errors">{errors}</ul>;
  }
});

module.exports = React.createClass({
  mixins: [makeLogger('Scene')],

  render: function() {
    return this.transferPropsTo(
      <div className="Scene">
        <iframe src="/frame" ref="frame"></iframe>
        <Errors errors={this.props.errors} />
      </div>
    );
  },

  update: function() {
    var frame = this.refs.frame.getDOMNode();
    var proj = this.props.project;
    this.debug('composing message');
    var msg = {
      main: project.getMain(proj),
      example: project.getExample(proj),
      style: project.getStyle(proj),
      dependencies: proj.meta.dependencies
    };
    this.debug('ready to send a message', msg);
    frame.contentWindow.postMessage(JSON.stringify(msg), '*');
  },

  componentDidMount: function() {
    this.update();
  },

  componentDidUpdate: function() {
    this.update();
  }
});
