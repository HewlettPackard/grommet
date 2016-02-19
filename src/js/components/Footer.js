// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Box from './Box';
import SkipLinkAnchor from './SkipLinkAnchor';
import Props from '../utils/Props';

const CLASS_ROOT = 'footer';

const Footer = props => {

  let classes = classnames(
    CLASS_ROOT,
    props.className,
    {
      [`${CLASS_ROOT}--${props.size}`]: props.size,
      [`${CLASS_ROOT}--float`]: props.float
    }
  );

  let containerClasses = classnames(
    `${CLASS_ROOT}__container`,
    {
      [`${CLASS_ROOT}__container--float`]: props.float
    }
  );

  let footerSkipLink;
  if (props.primary) {
    footerSkipLink = <SkipLinkAnchor label="Footer" />;
  }

  let boxProps = Props.pick(props, Box);

  return (
    <Box {...boxProps} tag="footer" className={classes}
      containerClassName={containerClasses}
      primary={false}>
      {footerSkipLink}
      {props.children}
    </Box>
  );
};

Footer.propTypes = {
  float: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  primary: PropTypes.bool,
  ...Box.propTypes
};

Footer.defaultProps = {
  direction: 'row',
  responsive: false
};

Footer.displayName = 'Footer';

export default Footer;
