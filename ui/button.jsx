var React = require('react-tools/build/modules/React');

module.exports = React.createClass({
  render: function() {
    var iconClassName = this.props.icon ?
      "Button__icon fa fa-" + this.props.icon :
      null;
    return this.transferPropsTo(
      <a className="Button">
        {this.props.icon ? <i className={iconClassName} /> : null}
        {this.props.label}
      </a>
    );
  }
});
