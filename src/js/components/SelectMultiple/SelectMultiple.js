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
import styled from 'styled-components';
import { controlBorderStyle, useKeyboard, useForwardedRef } from '../../utils';

import { Box } from '../Box';
import { DropButton } from '../DropButton';
import { Keyboard } from '../Keyboard';
import { FormContext } from '../Form/FormContext';
import { SelectMultipleValue } from './SelectMultipleValue';

import { SelectMultipleContainer } from './SelectMultipleContainer';
import {
  HiddenInput,
  SelectTextInput,
  StyledSelectDropButton,
} from '../Select/StyledSelect';
import {
  applyKey,
  getNormalizedValue,
  changeEvent,
  getSelectIcon,
  getIconColor,
  getDisplayLabelKey,
  arrayIncludes,
  inertTrueValue,
} from '../Select/utils';
import { DefaultSelectTextInput } from '../Select/DefaultSelectTextInput';
import { MessageContext } from '../../contexts/MessageContext';
import { SelectMultiplePropTypes } from './propTypes';
import { useThemeValue } from '../../utils/useThemeValue';

const StyledSelectBox = styled(Box)`
  ${(props) => !props.plainSelect && controlBorderStyle};
  ${(props) => props.theme.select?.control?.extend};
  ${(props) => props.open && props.theme.select.control?.open};
`;

const SelectMultiple = forwardRef(
  (
    {
      a11yTitle,
      'aria-label': ariaLabel,
      alignSelf,
      children,
      defaultValue,
      disabled,
      disabledKey,
      dropAlign: dropAlignProp,
      dropHeight,
      dropProps,
      dropTarget,
      emptySearchMessage,
      focusIndicator, // internal only from FormField
      gridArea,
      help,
      id,
      icon,
      labelKey,
      limit,
      margin,
      messages,
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
      open: openProp,
      options: optionsProp,
      placeholder,
      plain,
      replace,
      searchPlaceholder,
      size,
      sortSelectedOnClose = true,
      value: valueProp,
      valueKey,
      valueLabel,
      showSelectedInline = false,
      width,
      ...rest
    },
    ref,
  ) => {
    const { theme, passThemeFlag } = useThemeValue();
    const inputRef = useRef();
    const formContext = useContext(FormContext);
    const { format } = useContext(MessageContext);
    const selectBoxRef = useRef();
    const dropButtonRef = useForwardedRef(ref);
    const usingKeyboard = useKeyboard();

    const dropAlign = useMemo(
      () =>
        dropAlignProp ||
        (showSelectedInline
          ? { top: 'top', right: 'right', left: 'left' }
          : { top: 'bottom', left: 'left' }),
      [dropAlignProp, showSelectedInline],
    );

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
    const [orderedOptions, setOrderedOptions] = useState();
    // Track changes to options property, except when options are being
    // updated due to search activity. Allows option's initial index value
    // to be referenced when filtered by search.
    useEffect(() => {
      if (!search) setAllOptions(optionsProp);
    }, [optionsProp, search]);

    useEffect(() => {
      if (search && optionsProp && optionsProp.length > 0) {
        const additionalOptions = [...allOptions];
        optionsProp.forEach(
          (i) =>
            !additionalOptions.some((j) =>
              typeof i === 'object'
                ? applyKey(i, valueKey) === applyKey(j, valueKey)
                : i === j,
            ) && additionalOptions.push(i),
        );
        if (allOptions.length !== additionalOptions.length)
          setAllOptions(additionalOptions);
      }
    }, [allOptions, optionsProp, search, valueKey]);

    useEffect(() => {
      if (sortSelectedOnClose) setOrderedOptions(optionsProp);
    }, [optionsProp, sortSelectedOnClose]);

    // the option indexes present in the value
    const optionIndexesInValue = useMemo(() => {
      const result = [];
      if (!Array.isArray(normalizedValue)) {
        return result;
      }
      normalizedValue.forEach((v) => {
        const index = allOptions
          .map((option) => applyKey(option, valueKey))
          .indexOf(v);
        if (index !== -1) result.push(index);
      });
      return result;
    }, [allOptions, valueKey, normalizedValue]);

    const [open, setOpen] = useState(openProp);
    useEffect(() => setOpen(openProp), [openProp]);

    const onRequestOpen = useCallback(() => {
      if (open) return;
      setOpen(true);
      if (onOpen) onOpen();
    }, [onOpen, open]);

    // On drop close if sortSelectedOnClose is true, sort options so that
    // selected options appear first, followed by unselected options.
    useEffect(() => {
      if (sortSelectedOnClose && value && !open) {
        const selectedOptions = optionsProp.filter((option) =>
          arrayIncludes(
            value,
            valueKey && valueKey.reduce ? applyKey(option, valueKey) : option,
            valueKey || labelKey,
          ),
        );
        const unselectedOptions = optionsProp.filter(
          (i) => !arrayIncludes(selectedOptions, i, valueKey || labelKey),
        );
        const nextOrderedOptions = selectedOptions.concat(unselectedOptions);
        setOrderedOptions(nextOrderedOptions);
      }
    }, [labelKey, open, sortSelectedOnClose, optionsProp, value, valueKey]);

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
      (event, { option, value: nextValue }) => {
        // nextValue must not be of type object to set value directly on the
        // input. if it is an object, then the user has not provided necessary
        // props to reduce object option
        if (
          typeof nextValue !== 'object' &&
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
            });
          } else {
            adjustedEvent = event;
            adjustedEvent.target = inputRef.current;
            adjustedEvent.value = nextValue;
            adjustedEvent.option = option;
          }
          onChange(adjustedEvent);
        }
      },
      [onChange, setValue, triggerChangeEvent],
    );

    const SelectIcon = getSelectIcon(icon, theme, open);

    // element to show, trumps inputValue
    const selectValue = useMemo(() => {
      let result;
      if (valueLabel) {
        result =
          value && valueLabel instanceof Function
            ? valueLabel(value)
            : valueLabel;
      } else if (value?.length > 0 && showSelectedInline) {
        result = (
          <SelectMultipleValue
            allOptions={allOptions}
            disabled={disabled}
            disabledKey={disabledKey}
            dropButtonRef={dropButtonRef}
            labelKey={labelKey}
            messages={messages}
            onRequestOpen={onRequestOpen}
            onSelectChange={onSelectChange}
            theme={theme}
            value={value}
            valueKey={valueKey}
          >
            {children}
          </SelectMultipleValue>
        );
      }
      return result;
    }, [
      allOptions,
      children,
      disabled,
      disabledKey,
      dropButtonRef,
      labelKey,
      messages,
      onRequestOpen,
      onSelectChange,
      showSelectedInline,
      theme,
      value,
      valueKey,
      valueLabel,
    ]);

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
        // keeping messages.multiple for backwards compatibility
        if (messages?.multiple && !messages.summarizedValue) {
          return format({ id: 'select.multiple', messages });
        }
        return format({
          id: 'selectMultiple.summarizedValue',
          messages,
          values: {
            selected: optionIndexesInValue.length,
            total: allOptions.length,
          },
        });
      }
      return undefined;
    }, [
      selectValue,
      optionIndexesInValue,
      allOptions,
      labelKey,
      format,
      messages,
    ]);

    const iconColor = getIconColor(theme);

    const displaySelectIcon = SelectIcon && (
      <Box
        alignSelf="center"
        margin={theme.select.icons.margin}
        width={{ min: 'auto' }}
      >
        {isValidElement(SelectIcon) ? (
          SelectIcon
        ) : (
          <SelectIcon color={iconColor} size={size} />
        )}
      </Box>
    );

    const dropContent = (
      <SelectMultipleContainer
        allOptions={allOptions}
        disabled={disabled}
        disabledKey={disabledKey}
        dropHeight={dropHeight}
        emptySearchMessage={emptySearchMessage}
        help={help}
        icon={displaySelectIcon}
        id={id}
        labelKey={labelKey}
        limit={limit}
        messages={messages}
        onChange={onSelectChange}
        onClose={onRequestClose}
        onKeyDown={onKeyDown}
        onMore={onMore}
        onSearch={onSearch}
        options={orderedOptions || optionsProp}
        optionIndexesInValue={optionIndexesInValue}
        replace={replace}
        searchPlaceholder={searchPlaceholder}
        search={search}
        setSearch={setSearch}
        usingKeyboard={usingKeyboard}
        value={value}
        valueKey={valueKey}
        showSelectedInline={showSelectedInline}
      >
        {children}
      </SelectMultipleContainer>
    );

    const dropButtonProps = {
      ref: dropButtonRef,
      a11yTitle: `${
        ariaLabel ||
        a11yTitle ||
        placeholder ||
        format({
          id: 'selectMultiple.open',
          messages,
        })
      }. ${format({
        id: 'selectMultiple.selected',
        values: {
          selected: value?.length || 0,
          total: allOptions.length,
        },
      })}`,
      'aria-expanded': Boolean(open),
      'aria-haspopup': 'listbox',
      id,
      disabled: disabled === true || undefined,
      open,
      focusIndicator,
      onFocus,
      onBlur,
      gridArea,
      margin,
      onOpen: onRequestOpen,
      onClose: onRequestClose,
      onClick,
      plainSelect: plain,
      plain, // Button should be plain
      dropProps,
      dropContent,
      theme,
    };

    return (
      <Keyboard onDown={onRequestOpen} onUp={onRequestOpen}>
        {showSelectedInline ? (
          <StyledSelectBox
            disabled={disabled === true || undefined}
            alignSelf={alignSelf}
            direction="row"
            alignContent="start"
            background={theme.select.background}
            ref={selectBoxRef}
            flex={false}
            plainSelect={plain}
            width={width}
            {...passThemeFlag}
          >
            <Box width="100%">
              <DropButton
                fill="horizontal"
                alignSelf="start"
                {...dropButtonProps}
                dropAlign={dropAlign}
                dropTarget={dropTarget || selectBoxRef.current}
              >
                {selectValue || displayLabelKey ? (
                  <>
                    <Box direction="row">
                      <SelectTextInput
                        a11yTitle={ariaLabel || a11yTitle}
                        defaultCursor={disabled === true || undefined}
                        focusIndicator={false}
                        id={id ? `${id}__input` : undefined}
                        inert={inertTrueValue}
                        name={name}
                        width="100%"
                        {...rest}
                        tabIndex="-1"
                        type="text"
                        placeholder={
                          !value || value?.length === 0
                            ? placeholder || selectValue || displayLabelKey
                            : format({
                                id: onMore
                                  ? 'selectMultiple.selected'
                                  : 'selectMultiple.selectedOfTotal',
                                messages,
                                values: {
                                  selected: value?.length || 0,
                                  ...(!onMore
                                    ? { total: allOptions.length }
                                    : {}),
                                },
                              })
                        }
                        plain
                        readOnly
                        value=""
                        theme={theme}
                      />
                      {displaySelectIcon}
                    </Box>
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
                  <Box direction="row">
                    <DefaultSelectTextInput
                      a11yTitle={ariaLabel || a11yTitle}
                      disabled={disabled}
                      id={id}
                      inert={inertTrueValue}
                      name={name}
                      ref={inputRef}
                      placeholder={placeholder || 'Select'}
                      value={inputValue}
                      size={size}
                      theme={theme}
                      {...rest}
                    />
                    {displaySelectIcon}
                  </Box>
                )}
              </DropButton>
              {!open && value?.length > 0 && (selectValue || displayLabelKey)}
            </Box>
          </StyledSelectBox>
        ) : (
          <Box width={width}>
            <StyledSelectDropButton
              {...dropButtonProps}
              dropAlign={dropAlign}
              dropTarget={dropTarget}
              alignSelf={alignSelf}
              tabIndex="0"
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
                      a11yTitle={ariaLabel || a11yTitle}
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
                {displaySelectIcon}
              </Box>
            </StyledSelectDropButton>
          </Box>
        )}
      </Keyboard>
    );
  },
);

SelectMultiple.displayName = 'SelectMultiple';
SelectMultiple.propTypes = SelectMultiplePropTypes;

export { SelectMultiple };
