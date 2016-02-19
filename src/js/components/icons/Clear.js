// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';

export default class Clear extends Component {
  componentDidMount () {
    console.warn('This icon has been deprecated. Please check http://www.grommet.io/docs/develop/icon for the new set of icons.');
  }

  render () {
    var className = 'control-icon control-icon-clear';
    if (this.props.className) {
      className += ' ' + this.props.className;
    }
    return (
      <svg className={className} viewBox="0 0 48 48" version="1.1" >
        <g fill="none">
          <line strokeWidth="2" x1="14" y1="14" x2="34" y2="34"/>
          <line strokeWidth="2" x1="14" y1="34" x2="34" y2="14"/>
        </g>
      </svg>
    );
  }
}
