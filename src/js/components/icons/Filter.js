// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
var FormattedMessage = require('../FormattedMessage');

export default class Filter extends Component {
  componentDidMount () {
    console.warn('This icon has been deprecated. Please check http://www.grommet.io/docs/develop/icon for the new set of icons.');
  }

  render () {
    var className = 'control-icon control-icon-filter';
    var a11yTitle = (
      <FormattedMessage id={this.props.a11yTitle} defaultMessage={this.props.a11yTitle} />
    );

    if (this.props.className) {
      className += ' ' + this.props.className;
    }

    if (typeof this.props.a11yTitle === "undefined") {
      // this.props.a11yTitle emplty string is an acceptable value only if undefined
      // should it use the default title value
      a11yTitle = (
        <FormattedMessage id="Filter" defaultMessage="Filter" />
      );
    }
    var filterTitleId = 'ok-title';

    var badge = null;
    if (this.props.notifications) {
      badge = (
        <g className="control-icon__badge">
          <circle stroke="none" cx="37" cy="11" r="10"/>
          <text x="33.5" y="16" fontSize={16}>{this.props.notifications}</text>
        </g>
      );
    }

    return (
      <svg role="image" className={className} aria-labelledby={filterTitleId} viewBox="0 0 48 48" version="1.1">
        <title id={filterTitleId}>{a11yTitle}</title>
        <g fill="none">
          <polygon role="presentation" strokeWidth="2" points="14,15 24,27 34,15 	"/>
          <line strokeWidth="2" x1="24" y1="27" x2="24" y2="34"/>
        </g>
        {badge}
      </svg>
    );
  }
}

Filter.propTypes = {
  a11yTitle: PropTypes.string,
  notifications: PropTypes.number
};
