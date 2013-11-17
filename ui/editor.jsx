var React = require('react-tools/build/modules/React');
var CodeMirror = require('codemirror');

module.exports = React.createClass({

  componentDidMount: function() {
    this.update();
  },

  componentDidUpdate: function() {
    this.update();
  },

  update: function() {
    if (this.cm) {
      this.cm.setValue(this.props.value);
    } else {
      var node = this.getDOMNode();
      this.cm = new window.CodeMirror(node, {
        value: this.props.value || '',
        tabSize: this.props.tabSize || 2,
        mode: this.props.mode || 'javascript'
      });
      this.cm.on('change', this.onChange);
    }
  },

  componentWillUnmount: function(node) {
    this.cm.off('change');
    this.cm = undefined;
  },

  shouldComponentUpdate: function(props) {
    return props.value !== this.cm.getValue();
  },

  onChange: function() {
    var value = this.cm.getValue();

    if (this.props.onChange)
      this.props.onChange(value);

    if (this.props.validate) {
      var error;
      try {
        this.props.validate(value);
      } catch(err) {
        error = err;
      }
      if (error !== undefined && this.props.onError)
        this.props.onError(error)
      else if (error === undefined && this.props.onUpdate)
        this.props.onUpdate(value);
    }
  },

  render: function() {
    return this.transferPropsTo(<div className="Editor" />);
  }
});
