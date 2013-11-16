var React = require('react-tools/build/modules/React');

module.exports = React.createClass({
  render: function() {
    return this.transferPropsTo(
      <div className="Scene">
        <iframe src="/frame" ref="frame"></iframe>
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
