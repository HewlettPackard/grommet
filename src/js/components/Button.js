// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

var React = require('react');

var CLASS_ROOT = "button";

var Button = React.createClass({

  propTypes: {
    accent: React.PropTypes.bool,
    fill: React.PropTypes.bool,
    icon: React.PropTypes.bool,
    id: React.PropTypes.string,
    label: React.PropTypes.node,
    onClick: React.PropTypes.func,
    primary: React.PropTypes.bool,
    secondary: React.PropTypes.bool,
    type: React.PropTypes.oneOf(['button', 'reset', 'submit', 'icon'])
  },

  getDefaultProps: function () {
    return {
      type: "button"
    };
  },

  render: function () {
    var classes = [CLASS_ROOT];
    if (this.props.primary) {
      classes.push(CLASS_ROOT + "--primary");
    }
    if (this.props.secondary) {
      classes.push(CLASS_ROOT + "--secondary");
    }
    if (this.props.accent) {
      classes.push(CLASS_ROOT + "--accent");
    }
    if (! this.props.onClick) {
      classes.push(CLASS_ROOT + "--disabled");
    }
    if (this.props.fill) {
      classes.push(CLASS_ROOT + "--fill");
    }
    if (this.props.className) {
      classes.push(this.props.className);
    }

    var content = this.props.label;
    var type = this.props.type;
    if (this.props.type === 'icon') {
      classes.push(CLASS_ROOT + "--icon");
      content = this.props.children;
      type = 'button';
    }

    return (
      <button id={this.props.id} type={type} className={classes.join(' ')}
        onClick={this.props.onClick} disabled={! this.props.onClick}>
        {content}
      </button>
    );
  }

});

module.exports = Button;
