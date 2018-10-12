import React, { cloneElement, Children, Component } from 'react';
import { compose } from 'recompose';

import { Box } from '../Box';
import { withFocus, withForwardRef, withTheme } from '../hocs';
import {
  colorIsDark, colorForName, normalizeBackground, normalizeColor,
} from '../../utils';

import { StyledButton } from './StyledButton';

const isDarkBackground = (props) => {
  const backgroundColor = normalizeBackground(normalizeColor(
    props.color || props.theme.button.primary.color
    || props.theme.global.control.color || 'brand',
    props.theme
  ), props.theme);

  return colorIsDark(colorForName(backgroundColor, props.theme));
};

class Button extends Component {
  static defaultProps = {
    type: 'button',
    focusIndicator: true,
  };

  constructor(props) {
    super(props);

    const { children, icon, label } = props;
    if ((icon || label) && children) {
      console.warn('Button should not have children if icon or label is provided');
    }
  }

  render() {
    const {
      a11yTitle,
      color, // munged to avoid styled-components putting it in the DOM
      forwardRef,
      children,
      disabled,
      icon,
      fill, // munged to avoid styled-components putting it in the DOM
      focus,
      href,
      label,
      onClick,
      plain,
      primary,
      reverse,
      theme,
      type,
      ...rest
    } = this.props;

    let buttonIcon = icon;
    // only change color if user did not specify the color themselves...
    if (primary && icon && !icon.props.color) {
      buttonIcon = cloneElement(
        icon, {
          color: theme.global.text.color[isDarkBackground(this.props) ? 'dark' : 'light'],
        }
      );
    }
    const first = reverse ? label : buttonIcon;
    const second = reverse ? buttonIcon : label;

    return (
      <StyledButton
        {...rest}
        as={href ? 'a' : undefined}
        ref={forwardRef}
        aria-label={a11yTitle}
        colorValue={color}
        disabled={disabled}
        hasIcon={!!icon}
        hasLabel={!!label}
        fillContainer={fill}
        focus={focus}
        href={href}
        onClick={onClick}
        plain={typeof plain !== 'undefined' ? (
          plain
        ) : (
          (Children.count(children) > 0 || (icon && !label))
        )}
        primary={primary}
        theme={theme}
        type={!href ? type : undefined}
      >
        {(first || second) ? (
          <Box
            direction='row'
            align='center'
            justify='center'
            gap='small'
          >
            {first}
            {second}
          </Box>
        ) : children}
      </StyledButton>
    );
  }
}

let ButtonDoc;
if (process.env.NODE_ENV !== 'production') {
  ButtonDoc = require('./doc').doc(Button); // eslint-disable-line global-require
}
const ButtonWrapper = compose(
  withFocus,
  withTheme,
  withForwardRef,
)(ButtonDoc || Button);

export { ButtonWrapper as Button };
