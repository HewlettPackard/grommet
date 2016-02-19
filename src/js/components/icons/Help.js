// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';

export default class Help extends Component {
  componentDidMount () {
    console.warn('This icon has been deprecated. Please check http://www.grommet.io/docs/develop/icon for the new set of icons.');
  }

  render () {
    var className = 'control-icon control-icon-help';
    if (this.props.className) {
      className += ' ' + this.props.className;
    }
    return (
      <svg className={className} viewBox="0 0 48 48" version="1.1">
        <g fill="none">
          <path strokeWidth="2" d="M17,18c0-4,3.4-7,7-7c3.5,0,7,2.7,7,7s-3.6,7-7,7v6" />
          <line strokeWidth="2" x1="24" y1="37" x2="24" y2="35"/>
        </g>
      </svg>
    );
  }
}
