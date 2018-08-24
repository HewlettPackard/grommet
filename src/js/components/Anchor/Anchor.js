import React, { Component } from 'react';
import { compose } from 'recompose';

import { Box } from '../Box';
import { Text } from '../Text';
import { withFocus, withForwardRef, withTheme } from '../hocs';

import { StyledAnchor } from './StyledAnchor';
import { doc } from './doc';

class Anchor extends Component {
  constructor(props) {
    super(props);

    const { children, icon, label } = props;
    if ((icon || label) && children) {
      console.warn('Anchor should not have children if icon or label is provided');
    }
  }

  render() {
    const {
      a11yTitle,
      children,
      disabled,
      forwardRef,
      href,
      icon,
      focus,
      label,
      primary,
      onClick,
      reverse,
      theme,
      ...rest
    } = this.props;

    const anchorLabel = typeof label === 'string' ? (
      <Text>
        <strong>{label}</strong>
      </Text>
    ) : label;

    const first = reverse ? anchorLabel : icon;
    const second = reverse ? icon : anchorLabel;

    return (
      <StyledAnchor
        {...rest}
        innerRef={forwardRef}
        aria-label={a11yTitle}
        disabled={disabled}
        icon={icon}
        focus={focus}
        label={label}
        primary={primary}
        reverse={reverse}
        theme={theme}
        href={!disabled ? href : undefined}
        onClick={!disabled ? onClick : undefined}
      >
        {(first || second) ? (
          <Box tag='span' direction='row' align='center' gap='small' style={{ display: 'inline-flex' }}>
            {first}
            {second}
          </Box>
        ) : children}
      </StyledAnchor>
    );
  }
}

let AnchorWrapper = Anchor;
if (process.env.NODE_ENV !== 'production') {
  AnchorWrapper = doc(Anchor);
}

AnchorWrapper = compose(
  withFocus,
  withTheme,
  withForwardRef,
)(AnchorWrapper);

export { AnchorWrapper as Anchor };
