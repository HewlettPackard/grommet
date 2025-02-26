import React, { forwardRef, useContext, useRef, useState } from 'react';

import { FormContext } from '../Form/FormContext';
import { Keyboard } from '../Keyboard';
import { Box } from '../Box';
import { RadioButton } from '../RadioButton';
import { RadioButtonGroupPropTypes } from './propTypes';
import { useThemeValue } from '../../utils/useThemeValue';

const RadioButtonGroup = forwardRef(
  (
    {
      children,
      defaultValue,
      disabled,
      focusIndicator = true,
      gap,
      name,
      onChange,
      options: optionsProp,
      trapFocus = false,
      value: valueProp,
      ...rest
    },
    ref,
  ) => {
    const formContext = useContext(FormContext);
    const { theme } = useThemeValue();

    // normalize options to always use an object
    const options = optionsProp.map((o) =>
      typeof o !== 'object'
        ? {
            disabled,
            id: rest.id ? `${rest.id}-${o}` : `${o}`, // force string
            label: typeof o !== 'string' ? JSON.stringify(o) : o,
            value: o,
          }
        : { disabled, ...o },
    );

    const [value, setValue] = formContext.useFormInput({
      name,
      value: valueProp,
      initialValue: defaultValue ?? '',
    });

    // track if focus is on one of the radio buttons
    const [focus, setFocus] = useState();

    const optionRefs = useRef([]);

    const valueIndex = React.useMemo(() => {
      let result;
      options.some((option, index) => {
        if (option.value === value) {
          result = index;
          return true;
        }
        return false;
      });
      return result;
    }, [options, value]);

    const onNext = () => {
      if (valueIndex !== undefined && valueIndex < options.length - 1) {
        const nextIndex = valueIndex + 1;
        // ensure change event occurs
        optionRefs.current[nextIndex].click();
      }
    };

    const onPrevious = () => {
      if (valueIndex > 0) {
        const nextIndex = valueIndex - 1;
        // ensure change event occurs
        optionRefs.current[nextIndex].click();
      }
    };

    const onFocus = () => {
      // Delay just a wee bit so Chrome doesn't missing turning the button on.
      // Chrome behaves differently in that focus is given to radio buttons
      // when the user selects one, unlike Safari and Firefox.
      setTimeout(() => {
        // In case the focus needs to be trapped inside the input instead of the
        // Box wrapper
        if (trapFocus) {
          // console.log('optionRefs.current[0]', optionRefs.current[0]);
          setFocus(optionRefs.current[0]);
        } else setFocus(true);
      }, 1);
    };

    const onRadioButtonChange = (event, optionValue) => {
      setValue(optionValue);
      if (onChange) {
        event.persist(); // extract from React synthetic event pool
        // event.target.value gives value as a string which needs to be
        // manually typecasting according to the type of original option value.
        // return the original option value attached with the event.
        const adjustedEvent = event;
        adjustedEvent.value = optionValue;
        onChange(adjustedEvent);
      }
    };

    const onBlur = () => setFocus(false);

    return (
      <Keyboard
        target="document"
        onUp={focus ? onPrevious : undefined}
        onDown={focus ? onNext : undefined}
        onLeft={focus ? onPrevious : undefined}
        onRight={focus ? onNext : undefined}
      >
        <Box
          ref={ref}
          role="radiogroup"
          {...theme.radioButtonGroup.container}
          gap={
            gap ||
            (theme.radioButtonGroup.container &&
            theme.radioButtonGroup.container.gap
              ? theme.radioButtonGroup.container.gap
              : 'small')
          }
          {...rest}
        >
          {options.map(
            (
              {
                disabled: optionDisabled,
                id,
                label,
                value: optionValue,
                ...optionRest
              },
              index,
            ) => {
              // if focus is within the RadioButtonGroup, determine
              // which radio button should be the active one
              const focusable =
                optionValue === value ||
                (value === undefined && !index) ||
                // when nothing has been selected, show focus
                // on the first radio-button
                (value === '' && index === 0);

              if (optionRest.checked) {
                console.warn(
                  // eslint-disable-next-line max-len
                  `'checked' prop of an individual RadioButton shouldn't be used in a RadioButtonGroup component. Use the RadioButtonGroup 'value' prop instead.`,
                );
              }

              return (
                <RadioButton
                  ref={(aRef) => {
                    optionRefs.current[index] = aRef;
                  }}
                  key={optionValue}
                  name={name}
                  label={!children ? label : undefined}
                  disabled={optionDisabled}
                  checked={optionValue === value}
                  focus={focus && focusable}
                  // when contained in a FormField, focusIndicator = false,
                  // so that the FormField has focus style. However, we still
                  // need to visually indicate when a RadioButton is active.
                  // In RadioButton, if focus = true but focusIndicator = false,
                  // we will apply the hover treatment.
                  focusIndicator={focusIndicator}
                  id={id}
                  value={optionValue}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onChange={(event) => onRadioButtonChange(event, optionValue)}
                  tabIndex={focusable ? '0' : '-1'} // necessary for Firefox
                  {...optionRest}
                >
                  {children
                    ? (state) => children(optionsProp[index], state)
                    : null}
                </RadioButton>
              );
            },
          )}
        </Box>
      </Keyboard>
    );
  },
);

RadioButtonGroup.displayName = 'RadioButtonGroup';
RadioButtonGroup.propTypes = RadioButtonGroupPropTypes;

export { RadioButtonGroup };
