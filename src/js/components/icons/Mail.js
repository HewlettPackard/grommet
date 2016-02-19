// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';

export default class Mail extends Component {
  componentDidMount () {
    console.warn('This icon has been deprecated. Please check http://www.grommet.io/docs/develop/icon for the new set of icons.');
  }

  render () {
    var className = 'control-icon control-icon-mail';
    if (this.props.className) {
      className += ' ' + this.props.className;
    }
    return (
      <svg className={className} viewBox="0 0 48 48" version="1.1">
        <g fill="none" strokeWidth="2">
          <rect x="12" y="14" width="24" height="19.6"></rect>
          <path d="M12,17.3 L24,27.1 L36,17.3"></path>
          <path d="M12.2,32.3 L20.7,23.8"></path>
          <path d="M35.8,32.3 L27.3,23.8"></path>
        </g>
      </svg>
    );
  }
}
