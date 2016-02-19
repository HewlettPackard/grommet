// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

import React, { PropTypes } from 'react';
import classnames from 'classnames';

const CLASS_ROOT = 'form';

const Form = props => {
  let { className, compact, fill, pad } = props;
  let classes = classnames(
    CLASS_ROOT,
    className,
    {
      [`${CLASS_ROOT}--compact`]: compact,
      [`${CLASS_ROOT}--fill`]: fill,
      [`${CLASS_ROOT}--pad-${pad}`]: typeof pad === 'string',
      [`${CLASS_ROOT}--pad-horizontal-${pad.horizontal}`]: typeof pad === 'object' && 'horizontal' in pad,
      [`${CLASS_ROOT}--pad-vertical-${pad.vertical}`]: typeof pad === 'object' && 'vertical' in pad
    }
  );

  return (
    <form className={classes} onSubmit={props.onSubmit}>
      {props.children}
    </form>
  );
};

Form.propTypes = {
  compact: PropTypes.bool,
  fill: PropTypes.bool,
  onSubmit: PropTypes.func,
  pad: PropTypes.oneOfType([
    PropTypes.oneOf(['none', 'small', 'medium', 'large']),
    PropTypes.shape({
      horizontal: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
      vertical: PropTypes.oneOf(['none', 'small', 'medium', 'large'])
    })
  ])
};

Form.defaultProps = {
  compact: false,
  fill: false,
  pad: 'none'
};

Form.displayName = 'Form';

export default Form;
