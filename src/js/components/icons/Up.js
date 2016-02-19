// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';

export default class Up extends Component {
  componentDidMount () {
    console.warn('This icon has been deprecated. Please check http://www.grommet.io/docs/develop/icon for the new set of icons.');
  }

  render () {
    var className = 'control-icon control-icon-up';
    if (this.props.className) {
      className += ' ' + this.props.className;
    }
    return (
      <svg className={className} viewBox="0 0 48 48" version="1.1">
        <g fill="none">
          <polyline strokeWidth="2" points="14,20.9 24,13 34,21 "/>
          <path strokeWidth="2" d="M24,13.3C24,36,24,36,24,36"/>
        </g>
      </svg>
    );
  }
}
