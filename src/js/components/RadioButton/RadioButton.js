import React, { forwardRef, useState } from 'react';

import { normalizeColor, removeUndefined, useKeyboard } from '../../utils';

import {
  StyledRadioButton,
  StyledRadioButtonContainer,
  StyledRadioButtonIcon,
  StyledRadioButtonInput,
  StyledRadioButtonLabel,
  StyledRadioButtonBox,
} from './StyledRadioButton';
import { RadioButtonPropTypes } from './propTypes';
import { useThemeValue } from '../../utils/useThemeValue';

const RadioButton = forwardRef(
  (
    {
      a11yTitle,
      checked,
      children,
      disabled,
      focus: focusProp,
      focusIndicator = true,
      id,
      label,
      name,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const { theme, passThemeFlag } = useThemeValue();
    const [hover, setHover] = useState();
    const [focus, setFocus] = useState(focusProp);
    const usingKeyboard = useKeyboard();
    const normalizedLabel =
      typeof label === 'string' ? (
        <StyledRadioButtonLabel {...passThemeFlag}>
          {label}
        </StyledRadioButtonLabel>
      ) : (
        label
      );

    const Icon = theme.radioButton.icons.circle;
    let borderColor = normalizeColor(theme.radioButton.border.color, theme);
    let backgroundColor = normalizeColor(
      theme.radioButton.background?.color,
      theme,
    );

    if (checked) {
      borderColor = normalizeColor(theme.radioButton.color || 'control', theme);

      if (theme.radioButton.check?.background?.color) {
        backgroundColor = normalizeColor(
          theme.radioButton.check.background.color,
          theme,
        );
      }
    }

    return (
      <StyledRadioButtonContainer
        {...removeUndefined({ htmlFor: id, disabled })}
        onClick={(event) => {
          // prevents clicking on the label trigging the event twice
          // https://stackoverflow.com/questions/24501497/why-the-onclick-element-will-trigger-twice-for-label-element
          if (event.target.type !== 'radio') {
            event.stopPropagation();
          }
        }}
        focus={focus}
        focusIndicator={focusIndicator}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        {...passThemeFlag}
      >
        <StyledRadioButton
          flex={false}
          margin={
            label ? { right: theme.radioButton.gap || 'small' } : undefined
          }
          {...passThemeFlag}
        >
          <StyledRadioButtonInput
            aria-label={a11yTitle}
            {...rest}
            ref={ref}
            type="radio"
            {...removeUndefined({
              id,
              name,
              checked,
              disabled,
              onChange,
            })}
          />
          {children ? (
            children({
              checked,
              focus: focus && focusIndicator,
              hover,
              usingKeyboard,
            })
          ) : (
            <StyledRadioButtonBox
              focus={focus && focusIndicator && usingKeyboard}
              align="center"
              justify="center"
              width={theme.radioButton.size}
              height={theme.radioButton.size}
              border={{
                size: theme.radioButton.border.width,
                color: borderColor,
              }}
              backgroundColor={backgroundColor}
              round={theme.radioButton.check.radius}
              {...passThemeFlag}
            >
              {checked &&
                (Icon ? (
                  <Icon theme={theme} as={StyledRadioButtonIcon} />
                ) : (
                  <StyledRadioButtonIcon
                    viewBox="0 0 24 24"
                    preserveAspectRatio="xMidYMid meet"
                    {...passThemeFlag}
                  >
                    <circle cx={12} cy={12} r={6} />
                  </StyledRadioButtonIcon>
                ))}
            </StyledRadioButtonBox>
          )}
        </StyledRadioButton>
        {normalizedLabel}
      </StyledRadioButtonContainer>
    );
  },
);

RadioButton.displayName = 'RadioButton';
RadioButton.propTypes = RadioButtonPropTypes;

export { RadioButton };
