var React = require('react-tools/build/modules/React');
var cx    = require('react-tools/build/modules/cx');

module.exports = React.createClass({

  render: function() {
    var className = cx({
      'ShowHide': true,
      'ShowHide--active': this.props.show
    });
    return this.transferPropsTo(
      <div className={className}>{this.props.children}</div>
    );
  }
});
