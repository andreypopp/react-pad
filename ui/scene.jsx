var React = require('react-tools/build/modules/React');

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
  render: function() {
    return this.transferPropsTo(
      <div className="Scene">
        <iframe src="/frame" ref="frame"></iframe>
        <Errors errors={this.props.errors} />
      </div>
    );
  },

  update: function() {
    var msg = JSON.stringify({
      example: this.props.example,
      component: this.props.component,
      styles: this.props.styles
    });
    var frame = this.refs.frame.getDOMNode();
    frame.contentWindow.postMessage(msg, '*');
  },

  componentDidMount: function() {
    this.update();
  },

  componentDidUpdate: function() {
    this.update();
  }
});
