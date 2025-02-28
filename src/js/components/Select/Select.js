import React, {
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useState,
  useRef,
  useEffect,
} from 'react';

import { useKeyboard } from '../../utils';

import { Box } from '../Box';
import { Keyboard } from '../Keyboard';
import { FormContext } from '../Form/FormContext';

import { SelectContainer } from './SelectContainer';
import { HiddenInput, StyledSelectDropButton } from './StyledSelect';
import {
  applyKey,
  getNormalizedValue,
  changeEvent,
  getSelectIcon,
  getDisplayLabelKey,
  getIconColor,
  formatValueForA11y,
  inertTrueValue,
} from './utils';
import { DefaultSelectTextInput } from './DefaultSelectTextInput';
import { MessageContext } from '../../contexts/MessageContext';
import { SelectPropTypes } from './propTypes';
import { useThemeValue } from '../../utils/useThemeValue';

const defaultDropAlign = { top: 'bottom', left: 'left' };

const Select = forwardRef(
  (
    {
      a11yTitle,
      'aria-label': ariaLabel,
      alignSelf,
      children,
      clear = false,
      closeOnChange = true,
      defaultValue,
      disabled,
      disabledKey,
      dropAlign = defaultDropAlign,
      dropHeight,
      dropProps,
      dropTarget,
      emptySearchMessage,
      focusIndicator,
      gridArea,
      id,
      icon,
      labelKey: labelKeyProp,
      margin,
      messages,
      multiple,
      name,
      onBlur,
      onChange,
      onClick,
      onClose,
      onFocus,
      onKeyDown,
      onMore,
      onOpen,
      onSearch,
      open: propOpen,
      options: optionsProp,
      placeholder,
      plain,
      replace,
      searchPlaceholder,
      selected,
      size,
      value: valueProp,
      valueKey: valueKeyProp,
      valueLabel,
      ...rest
    },
    ref,
  ) => {
    const { theme } = useThemeValue();
    const inputRef = useRef();
    const formContext = useContext(FormContext);
    const { format } = useContext(MessageContext);
    // For greater resilience, use labelKey if valueKey isn't provided and
    // vice versa. https://github.com/grommet/grommet/pull/6299
    const valueKey = valueKeyProp || labelKeyProp;
    const labelKey = labelKeyProp || valueKeyProp;

    // Determine if the Select is opened with the keyboard. If so,
    // focus should be set on the first option when the drop opens
    // see set initial focus code in SelectContainer.js
    const usingKeyboard = useKeyboard();

    // value is used for what we receive in valueProp and the basis for
    // what we send with onChange
    // When 'valueKey' sets 'reduce', the value(s) here should match
    // what the 'valueKey' would return for the corresponding
    // selected option object.
    // Otherwise, the value(s) should match the selected options.

    const [value, setValue] = formContext.useFormInput({
      name,
      value: valueProp,
      initialValue: defaultValue || '',
    });

    // normalizedValue is the value mapped with any valueKey applied
    // When the options array contains objects, this property indicates how
    // to retrieve the value of each option.
    // If a string is provided, it is used as the key to retrieve a
    // property of an option object.
    // If a function is provided, it is called with the option and should
    // return the value.
    // If reduce is true, this value will be used for the 'value'
    // delivered via 'onChange'.
    const normalizedValue = useMemo(
      () => getNormalizedValue(value, valueKey),
      [value, valueKey],
    );
    // search input value
    const [search, setSearch] = useState();
    // All select option indices and values
    const [allOptions, setAllOptions] = useState(optionsProp);
    // Track changes to options property, except when options are being
    // updated due to search activity. Allows option's initial index value
    // to be referenced when filtered by search.
    useEffect(() => {
      if (!search) setAllOptions(optionsProp);
    }, [optionsProp, search]);

    // the option indexes present in the value
    const optionIndexesInValue = useMemo(() => {
      const result = [];
      if (selected !== undefined) {
        if (Array.isArray(selected)) {
          const validSelections = selected.filter((i) => i in allOptions);
          result.push(...validSelections);
        } else if (selected in allOptions) {
          result.push(selected);
        }
      } else if (Array.isArray(normalizedValue)) {
        normalizedValue.forEach((v) => {
          const index = allOptions
            .map((option) => applyKey(option, valueKey))
            .indexOf(v);
          if (index !== -1) result.push(index);
        });
      } else {
        const index = allOptions
          .map((option) => applyKey(option, valueKey))
          .indexOf(normalizedValue);
        if (index !== -1) {
          result.push(index);
        }
      }
      return result;
    }, [allOptions, selected, valueKey, normalizedValue]);

    const [open, setOpen] = useState(propOpen);
    useEffect(() => setOpen(propOpen), [propOpen]);

    const onRequestOpen = useCallback(() => {
      if (open) return;
      setOpen(true);
      if (onOpen) onOpen();
    }, [onOpen, open]);

    const onRequestClose = useCallback(() => {
      setOpen(false);
      if (onClose) onClose();
      setSearch();
    }, [onClose]);

    const triggerChangeEvent = useCallback(
      (nextValue) => changeEvent(inputRef, nextValue),
      [],
    );

    const onSelectChange = useCallback(
      (event, { option, value: nextValue, selected: nextSelected }) => {
        if (closeOnChange) onRequestClose();
        // nextValue must not be of type object to set value directly on the
        // input. if it is an object, then the user has not provided necessary
        // props to reduce object option
        if (
          (typeof nextValue !== 'object' || multiple) &&
          nextValue !== event.target.value &&
          inputRef.current
        ) {
          // select registers changing option as a click event or keydown.
          // when in a form, we need to programatically trigger a change
          // event in order for the change event to be registered upstream
          // necessary for change validation in form
          triggerChangeEvent(nextValue);
        }
        setValue(nextValue);
        if (onChange) {
          event.persist();
          let adjustedEvent;
          // support for native event used by Preact
          if (event instanceof Event) {
            adjustedEvent = new event.constructor(event.type, event);
            Object.defineProperties(adjustedEvent, {
              target: { value: inputRef.current },
              value: { value: nextValue },
              option: { value: option },
              selected: { value: nextSelected },
            });
          } else {
            adjustedEvent = event;
            adjustedEvent.target = inputRef.current;
            adjustedEvent.value = nextValue;
            adjustedEvent.option = option;
            adjustedEvent.selected = nextSelected;
          }
          onChange(adjustedEvent);
        }
      },
      [
        closeOnChange,
        multiple,
        onChange,
        onRequestClose,
        setValue,
        triggerChangeEvent,
      ],
    );

    const SelectIcon = getSelectIcon(icon, theme, open);

    // element to show, trumps inputValue
    const selectValue = useMemo(() => {
      if (valueLabel instanceof Function) {
        if (value || value === 0 || value === false) return valueLabel(value);
      } else if (valueLabel) return valueLabel;
      else if (React.isValidElement(value)) return value; // deprecated
      return undefined;
    }, [value, valueLabel]);

    const displayLabelKey = useMemo(
      () =>
        getDisplayLabelKey(
          labelKey,
          allOptions,
          optionIndexesInValue,
          selectValue,
        ),
      [labelKey, allOptions, optionIndexesInValue, selectValue],
    );

    // text to show
    // When the options array contains objects, this property indicates how
    // to retrieve the value of each option.
    // If a string is provided, it is used as the key to retrieve a
    // property of an option object.
    // If a function is provided, it is called with the option and should
    // return the value.
    // If reduce is true, this value will be used for the 'value'
    // delivered via 'onChange'.
    const inputValue = useMemo(() => {
      if (!selectValue) {
        if (optionIndexesInValue.length === 0) return '';
        if (optionIndexesInValue.length === 1)
          return applyKey(allOptions[optionIndexesInValue[0]], labelKey);
        return format({ id: 'select.multiple', messages });
      }
      return undefined;
    }, [
      labelKey,
      messages,
      format,
      optionIndexesInValue,
      allOptions,
      selectValue,
    ]);

    const iconColor = getIconColor(theme);

    return (
      <Keyboard onDown={onRequestOpen} onUp={onRequestOpen}>
        <StyledSelectDropButton
          ref={ref}
          a11yTitle={`${ariaLabel || a11yTitle || placeholder || 'Open Drop'}${
            value
              ? format({
                  id: 'select.selected',
                  messages,
                  values: {
                    currentSelectedValue: formatValueForA11y(value, labelKey),
                  },
                })
              : ''
          }`}
          aria-expanded={Boolean(open)}
          aria-haspopup="listbox"
          id={id}
          disabled={disabled === true || undefined}
          dropAlign={dropAlign}
          dropTarget={dropTarget}
          open={open}
          alignSelf={alignSelf}
          focusIndicator={plain ? focusIndicator : true}
          onFocus={onFocus}
          onBlur={onBlur}
          gridArea={gridArea}
          margin={margin}
          onOpen={onRequestOpen}
          onClose={onRequestClose}
          onClick={onClick}
          dropContent={
            <SelectContainer
              clear={clear}
              disabled={disabled}
              disabledKey={disabledKey}
              dropHeight={dropHeight}
              emptySearchMessage={emptySearchMessage}
              id={id}
              labelKey={labelKey}
              multiple={multiple}
              name={name}
              onChange={onSelectChange}
              onKeyDown={onKeyDown}
              onMore={onMore}
              onSearch={onSearch}
              options={optionsProp}
              allOptions={allOptions}
              optionIndexesInValue={optionIndexesInValue}
              replace={replace}
              searchPlaceholder={searchPlaceholder}
              search={search}
              setSearch={setSearch}
              selected={selected}
              usingKeyboard={usingKeyboard}
              value={value}
              valueKey={valueKey}
            >
              {children}
            </SelectContainer>
          }
          // StyledDropButton needs to know if the border should be shown
          plainSelect={plain}
          plain // Button should be plain
          dropProps={dropProps}
          theme={theme}
        >
          <Box
            align="center"
            direction="row"
            justify="between"
            background={theme.select.background}
          >
            <Box direction="row" flex basis="auto">
              {selectValue || displayLabelKey ? (
                <>
                  {selectValue || displayLabelKey}
                  <HiddenInput
                    type="text"
                    name={name}
                    id={id ? `${id}__input` : undefined}
                    inert={inertTrueValue}
                    value={inputValue}
                    ref={inputRef}
                    readOnly
                  />
                </>
              ) : (
                <DefaultSelectTextInput
                  a11yTitle={
                    (ariaLabel || a11yTitle) &&
                    `${ariaLabel || a11yTitle}${
                      value && typeof value === 'string' ? `, ${value}` : ''
                    }`
                  }
                  disabled={disabled}
                  id={id}
                  inert={inertTrueValue}
                  name={name}
                  ref={inputRef}
                  placeholder={placeholder}
                  value={inputValue}
                  size={size}
                  theme={theme}
                  {...rest}
                />
              )}
            </Box>
            {SelectIcon && (
              <Box
                margin={theme.select.icons.margin}
                flex={false}
                style={{ minWidth: 'auto' }}
              >
                {isValidElement(SelectIcon) ? (
                  SelectIcon
                ) : (
                  <SelectIcon color={iconColor} size={size} />
                )}
              </Box>
            )}
          </Box>
        </StyledSelectDropButton>
      </Keyboard>
    );
  },
);

Select.displayName = 'Select';
Select.propTypes = SelectPropTypes;

export { Select };
