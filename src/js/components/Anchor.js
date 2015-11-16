// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

var React = require('react');
var RightIcon = require('./icons/Right');

var CLASS_ROOT = "anchor";

var Anchor = React.createClass({

  propTypes: {
    href: React.PropTypes.string,
    id: React.PropTypes.string,
    onClick: React.PropTypes.func,
    primary: React.PropTypes.bool,
    tag: React.PropTypes.string,
    target: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {tag: 'a'};
  },

  render: function () {
    var classes = [CLASS_ROOT];
    var icon;
    if (this.props.primary) {
      classes.push(CLASS_ROOT + "--primary");
      icon = <RightIcon />;
    }
    if (! this.props.onClick) {
      classes.push(CLASS_ROOT + "--disabled");
    }
    if (this.props.className) {
      classes.push(this.props.className);
    }

    return (
      <this.props.tag id={this.props.id} className={classes.join(' ')}
        href={this.props.href}
        target={this.props.target}
        onClick={this.props.onClick}>
        {icon}
        {this.props.children}
      </this.props.tag>
    );
  }

});

module.exports = Anchor;
