import React, { forwardRef, useContext, useState, useCallback } from 'react';

import { FormContext } from '../Form/FormContext';
import { StyledRangeInput } from './StyledRangeInput';
import { RangeInputPropTypes } from './propTypes';
import { useForwardedRef } from '../../utils';

const RangeInput = forwardRef(
  (
    {
      a11yTitle,
      color,
      name,
      onChange,
      onFocus,
      onBlur,
      value: valueProp,
      step = 1,
      min = 0,
      max = 100,
      ...rest
    },
    ref,
  ) => {
    const formContext = useContext(FormContext);

    const [value, setValue] = formContext.useFormInput({
      name,
      value: valueProp,
    });

    const [focus, setFocus] = useState();
    const rangeInputRef = useForwardedRef(ref);

    const setRangeInputValue = useCallback(
      (nextValue) => {
        if (nextValue > max || nextValue < min) return;
        // Calling set value function directly on input because React library
        // overrides setter `event.target.value =` and loses original event
        // target fidelity.
        // https://stackoverflow.com/a/46012210
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value',
        ).set;
        nativeInputValueSetter.call(rangeInputRef.current, nextValue);
        const event = new Event('input', { bubbles: true });
        rangeInputRef.current.dispatchEvent(event);
      },
      [rangeInputRef, min, max],
    );

    const handleOnWheel = (event) => {
      const newValue = parseFloat(value);
      if (event.deltaY < 0) {
        setRangeInputValue(newValue + step);
      } else {
        setRangeInputValue(newValue - step);
      }
    };
    // This is to make sure scrollbar doesn't move
    // when user changes RangeInput value.
    const handleMouseOver = () => {
      const x = window.scrollX;
      const y = window.scrollY;
      window.onscroll = () => window.scrollTo(x, y);
    };
    const handleMouseOut = () => {
      window.onscroll = null;
    };

    return (
      <StyledRangeInput
        aria-label={a11yTitle}
        ref={rangeInputRef}
        name={name}
        focus={focus}
        value={value}
        {...rest}
        color={color}
        onFocus={(event) => {
          setFocus(true);
          if (onFocus) onFocus(event);
        }}
        onBlur={(event) => {
          setFocus(false);
          if (onBlur) onBlur(event);
        }}
        onChange={(event) => {
          setValue(event.target.value);
          if (onChange) onChange(event);
        }}
        onWheel={handleOnWheel}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        step={step}
        type="range"
        min={min}
        max={max}
      />
    );
  },
);

RangeInput.displayName = 'RangeInput';
RangeInput.propTypes = RangeInputPropTypes;

export { RangeInput };
