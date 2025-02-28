import React, { useCallback, isValidElement } from 'react';
import { normalizeColor } from '../../utils';

export const applyKey = (option, key) => {
  if (isValidElement(option)) return option;
  if (option === undefined || option === null) return undefined;
  if (typeof key === 'object') return applyKey(option, key.key);
  if (typeof key === 'function') return key(option);
  if (key !== undefined && typeof option === 'object') return option[key];
  if (typeof option === 'object' && Object.keys(option).length > 0)
    return option[Object.keys(option)[0]];
  return option;
};

export const getOptionLabel = (index, options, labelKey) =>
  applyKey(options[index], labelKey);

export const getOptionValue = (index, options, valueKey) =>
  applyKey(options[index], valueKey);

export const getOptionIndex = (options, i, valueKey) => {
  if (options) {
    if (typeof i === 'object')
      return options.findIndex(
        (x) => applyKey(x, valueKey) === applyKey(i, valueKey),
      );
    return options.indexOf(i);
  }
  return undefined;
};

export const arrayIncludes = (arr, i, valueKey) => {
  if (arr) {
    if (typeof i === 'object')
      return arr.some((x) => applyKey(x, valueKey) === applyKey(i, valueKey));
    return arr.includes(i);
  }
  return undefined;
};

export const useDisabled = (disabled, disabledKey, options, valueKey) =>
  useCallback(
    (index) => {
      const option = options[index];
      let result;
      if (disabledKey) {
        result = applyKey(option, disabledKey);
      } else if (Array.isArray(disabled)) {
        if (typeof disabled[0] === 'number') {
          result = disabled.indexOf(index) !== -1;
        } else {
          const optionVal = getOptionValue(index, options, valueKey);
          result =
            getOptionIndex(disabled, options[index], valueKey) !== -1 ||
            getOptionIndex(disabled, optionVal, valueKey) !== -1;
        }
      }
      return result;
    },
    [disabled, disabledKey, options, valueKey],
  );

export const getNormalizedValue = (value, valueKey) => {
  if (Array.isArray(value))
    return value.map((v) =>
      valueKey && valueKey.reduce ? v : applyKey(v, valueKey),
    );
  return valueKey && valueKey.reduce ? value : applyKey(value, valueKey);
};

export const changeEvent = (inputRef, nextValue) => {
  // Calling set value function directly on input because React library
  // overrides setter `event.target.value =` and loses original event
  // target fidelity.
  // https://stackoverflow.com/a/46012210
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value',
  ).set;
  nativeInputValueSetter.call(inputRef.current, nextValue);
  const event = new Event('input', { bubbles: true });
  inputRef.current.dispatchEvent(event);
};

export const getSelectIcon = (icon, theme, open) => {
  let SelectIcon;
  switch (icon) {
    case false:
      break;
    case true:
    case undefined:
      SelectIcon =
        open && theme.select.icons.up
          ? theme.select.icons.up
          : theme.select.icons.down;
      break;
    default:
      SelectIcon = icon;
  }
  return SelectIcon;
};

// if labelKey is a function and valueLabel is not defined
// we should use the labelKey function to display the
// selected value
export const getDisplayLabelKey = (
  labelKey,
  allOptions,
  optionIndexesInValue,
  selectValue,
) => {
  const optionLabelKey = applyKey(
    allOptions[optionIndexesInValue[0]],
    labelKey,
  );
  if (
    !selectValue &&
    optionIndexesInValue.length === 1 &&
    typeof optionLabelKey === 'object'
  )
    return optionLabelKey;
  return undefined;
};

export const getIconColor = (theme) =>
  normalizeColor(theme.select.icons.color || 'control', theme);

export const formatValueForA11y = (value, labelKey) => {
  if (typeof value === 'string') return value;
  if (isValidElement(value)) return value.toString();
  if (Array.isArray(value)) {
    return value.map((item) => formatValueForA11y(item, labelKey)).join(', ');
  }
  return applyKey(value, labelKey);
};

export const inertTrueValue = React.use ? true : '';
