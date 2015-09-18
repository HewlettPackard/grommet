// (C) Copyright 2014-2015 Hewlett-Packard Development Company, L.P.

var React = require('react');
var merge = require('lodash/object/merge');
var pick = require('lodash/object/pick');
var keys = require('lodash/object/keys');
var Box = require('./Box');

var CLASS_ROOT = "header";

var Header = React.createClass({

  propTypes: merge({
    fixed: React.PropTypes.bool,
    float: React.PropTypes.bool,
    fullWidth: React.PropTypes.bool,
    large: React.PropTypes.bool,
    size: React.PropTypes.oneOf(['small', 'medium', 'large']),
    small: React.PropTypes.bool,
    splash: React.PropTypes.bool,
    strong: React.PropTypes.bool,
    tag: React.PropTypes.string
  }, Box.propTypes),

  getDefaultProps: function () {
    return {
      pad: 'none',
      direction: 'row',
      fullWidth: true,
      align: 'center',
      responsive: false,
      tag: 'header'
    };
  },

  getInitialState: function() {
    return this._stateFromProps(this.props);
  },

  componentDidMount: function () {
    if (this.props.fixed) {
      this._alignMirror();
      window.addEventListener('resize', this._onResize);
    }
  },

  componentWillReceiveProps: function (newProps) {
    this.setState(this._stateFromProps(newProps));
  },

  componentDidUpdate: function () {
    if (this.props.fixed) {
      this._alignMirror();
    }
  },

  componentWillUnmount: function () {
    if (this.props.fixed) {
      window.removeEventListener('resize', this._onResize);
    }
  },

  _stateFromProps: function (props) {
    return {size: props.size || (props.small ? 'small' : (props.large ? 'large' : null))};
  },

  _onResize: function () {
    this._alignMirror();
  },

  _alignMirror: function () {
    var contentElement = this.refs.content.getDOMNode();
    var mirrorElement = this.refs.mirror.getDOMNode();

    // constrain fixed content to the width of the mirror
    var mirrorRect = mirrorElement.getBoundingClientRect();
    contentElement.style.width = '' + Math.floor(mirrorRect.width) + 'px';

    // align the mirror height with the content's height
    var contentRect = contentElement.getBoundingClientRect();
    mirrorElement.style.height = '' + Math.floor(contentRect.height) + 'px';
  },

  render: function() {
    var classes = [CLASS_ROOT];
    var containerClasses = [CLASS_ROOT + "__container"];
    var other = pick(this.props, keys(Box.propTypes));
    if (this.props.fixed) {
      containerClasses.push(CLASS_ROOT + "__container--fixed");
    }
    if (this.props.float) {
      classes.push(CLASS_ROOT + "--float");
      containerClasses.push(CLASS_ROOT + "__container--float");
    }
    if (this.props.fullWidth) {
       classes.push(CLASS_ROOT + "--full-width");
     }
    if (this.state.size) {
      classes.push(CLASS_ROOT + "--" + this.state.size);
    }
    if (this.props.splash) {
      classes.push(CLASS_ROOT + "--splash");
    }
    if (this.props.strong) {
      classes.push(CLASS_ROOT + "--strong");
    }
    if (this.props.className) {
      classes.push(this.props.className);
    }

    if (this.props.fixed) {
      return (
        <div className={containerClasses.join(' ')}>
          <div ref="mirror" className={CLASS_ROOT + "__mirror"}></div>
          <div className={CLASS_ROOT + "__wrapper"}>
            <Box ref="content" tag={this.props.header} {...other} className={classes.join(' ')}>
              {this.props.children}
            </Box>
          </div>
        </div>
      );
    } else {
      return (
        <Box tag={this.props.header} {...other} className={classes.join(' ')}
          containerClassName={containerClasses.join(' ')}>
          {this.props.children}
        </Box>
      );
    }
  }

});

module.exports = Header;
