import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import styled from 'styled-components';
import {
  setFocusWithoutScroll,
  getHoverIndicatorStyle,
  containsFocus,
} from '../../utils';

import { Box } from '../Box';
import { Button } from '../Button';
import { InfiniteScroll } from '../InfiniteScroll';
import { Keyboard } from '../Keyboard';
import { Text } from '../Text';
import { TextInput } from '../TextInput';

import {
  StyledContainer,
  OptionsContainer,
  SelectOption,
} from './StyledSelect';
import { applyKey, useDisabled, getOptionLabel, getOptionValue } from './utils';
import { EmptySearchOption } from './EmptySearchOption';
import { useThemeValue } from '../../utils/useThemeValue';

// ensure ClearButton receives visual indication of keyboard
const StyledButton = styled(Button)`
  &:focus {
    ${(props) => getHoverIndicatorStyle('background', props.theme)}
  }
`;

const ClearButton = forwardRef(
  ({ clear, onClear, name, theme, ...rest }, ref) => {
    const { label, position } = clear;
    const align = position !== 'bottom' ? 'start' : 'center';
    const buttonLabel = label || `Clear ${name || 'selection'}`;
    const { passThemeFlag } = useThemeValue();
    return (
      <StyledButton
        a11yTitle={`${buttonLabel}. Or, press ${
          position === 'bottom' ? 'shift tab' : 'down arrow'
        } to move to select options`}
        fill="horizontal"
        ref={ref}
        onClick={onClear}
        focusIndicator={false}
        plain
        {...passThemeFlag}
        {...rest}
      >
        {({ hover }) => {
          const boxProps = { ...theme.select.clear.container };
          delete boxProps.hover; // avoid passing hover object to Box
          return (
            <Box
              {...boxProps}
              {...(hover ? theme.select.clear?.container?.hover : {})}
              align={align}
            >
              <Text {...theme.select.clear.text}>{buttonLabel}</Text>
            </Box>
          );
        }}
      </StyledButton>
    );
  },
);

const SelectContainer = forwardRef(
  (
    {
      clear,
      children = null,
      disabled,
      disabledKey,
      dropHeight,
      emptySearchMessage = 'No matches found',
      id,
      labelKey,
      multiple,
      name,
      onChange,
      onKeyDown,
      onMore,
      onSearch,
      optionIndexesInValue,
      options,
      allOptions,
      searchPlaceholder,
      search,
      setSearch,
      selected,
      usingKeyboard,
      value = '',
      valueKey,
      replace = true,
    },
    ref,
  ) => {
    const { theme, passThemeFlag } = useThemeValue();
    const shouldShowClearButton = useCallback(
      (position) => {
        const hasValue = Boolean(multiple && value ? value.length : value);
        const showAtPosition =
          position === 'bottom'
            ? clear?.position === 'bottom'
            : clear?.position !== 'bottom';

        return clear && hasValue && showAtPosition;
      },
      [clear, multiple, value],
    );

    const isDisabled = useDisabled(
      disabled,
      disabledKey,
      options,
      valueKey || labelKey,
    );

    const [activeIndex, setActiveIndex] = useState(
      usingKeyboard && !shouldShowClearButton('top') && !onSearch ? 0 : -1,
    );
    const [keyboardNavigation, setKeyboardNavigation] = useState(usingKeyboard);
    const searchRef = useRef();
    const optionsRef = useRef();
    const clearRef = useRef();
    const activeRef = useRef();

    // for keyboard/screenreader, keep the active option in focus
    useEffect(() => {
      if (activeIndex >= 0) activeRef.current?.focus();
    }, [activeIndex]);

    // set initial focus
    useEffect(() => {
      // need to wait for Drop to be ready
      const timer = setTimeout(() => {
        const optionsNode = optionsRef.current;
        const clearButton = clearRef.current;
        if (onSearch) {
          const searchInput = searchRef.current;
          if (
            searchInput &&
            searchInput.focus &&
            !activeRef.current &&
            document.activeElement !== clearButton
          ) {
            setFocusWithoutScroll(searchInput);
          }
        } else if (
          clear &&
          clearButton &&
          clearButton.focus &&
          clear.position !== 'bottom'
        ) {
          setFocusWithoutScroll(clearButton);
        } else if (usingKeyboard && activeRef.current) {
          setFocusWithoutScroll(activeRef.current);
        } else if (optionsNode) {
          setFocusWithoutScroll(optionsNode);
        }
      }, 100);
      return () => clearTimeout(timer);
    }, [onSearch, usingKeyboard, clear]);

    const isSelected = useCallback(
      (index) => {
        let result;
        if (selected) {
          // deprecated in favor of value
          result = selected.indexOf(index) !== -1;
        } else {
          const optionVal = getOptionValue(index, options, valueKey);
          if (Array.isArray(value)) {
            if (value.length === 0) {
              result = false;
            } else if (typeof value[0] !== 'object') {
              result = value.indexOf(optionVal) !== -1;
            } else if (valueKey) {
              result = value.some((valueItem) => {
                const valueValue =
                  typeof valueKey === 'function'
                    ? valueKey(valueItem)
                    : valueItem[valueKey] || valueItem[valueKey.key];
                return valueValue === optionVal;
              });
            }
          } else if (valueKey && value !== null && typeof value === 'object') {
            const valueValue =
              typeof valueKey === 'function'
                ? valueKey(value)
                : value[valueKey];
            result = valueValue === optionVal;
          } else {
            result = value === optionVal;
          }
        }
        return result;
      },
      [selected, value, valueKey, options],
    );

    const selectOption = useCallback(
      (index) => (event) => {
        if (onChange) {
          let nextValue;
          let nextSelected;
          if (multiple) {
            const nextOptionIndexesInValue = optionIndexesInValue.slice(0);
            const allOptionsIndex = allOptions.indexOf(options[index]);
            const valueIndex = optionIndexesInValue.indexOf(allOptionsIndex);
            if (valueIndex === -1) {
              nextOptionIndexesInValue.push(allOptionsIndex);
            } else {
              nextOptionIndexesInValue.splice(valueIndex, 1);
            }
            nextValue = nextOptionIndexesInValue.map((i) =>
              valueKey && valueKey.reduce
                ? applyKey(allOptions[i], valueKey)
                : allOptions[i],
            );
            nextSelected = nextOptionIndexesInValue;
          } else {
            nextValue =
              valueKey && valueKey.reduce
                ? applyKey(options[index], valueKey)
                : options[index];
            nextSelected = index;
          }
          onChange(event, {
            option: options[index],
            value: nextValue,
            selected: nextSelected,
          });
        }
      },
      [multiple, onChange, optionIndexesInValue, options, allOptions, valueKey],
    );

    const onClear = useCallback(
      (event) => {
        onChange(event, { option: undefined, value: '', selected: '' });
      },
      [onChange],
    );

    const onNextOption = useCallback(
      (event) => {
        event.preventDefault();
        let nextActiveIndex = activeIndex + 1;
        while (
          nextActiveIndex < options.length &&
          isDisabled(nextActiveIndex)
        ) {
          nextActiveIndex += 1;
        }

        const searchInput = searchRef.current;
        const clearButton = clearRef.current;
        if (
          // Expect search input to immediately precede the clear button
          ((shouldShowClearButton('top') &&
            document.activeElement === searchInput) ||
            // Expect clear button to immediately follow the last
            // selectable option
            (shouldShowClearButton('bottom') &&
              nextActiveIndex === options.length)) &&
          clearButton &&
          clearButton.focus
        ) {
          setActiveIndex(nextActiveIndex);
          setKeyboardNavigation(true);
          setFocusWithoutScroll(clearButton);
        } else if (nextActiveIndex < options.length) {
          setActiveIndex(nextActiveIndex);
          setKeyboardNavigation(true);
        }
      },
      [activeIndex, options, isDisabled, shouldShowClearButton],
    );

    const onPreviousOption = useCallback(
      (event) => {
        event.preventDefault();
        let nextActiveIndex = activeIndex - 1;
        while (nextActiveIndex >= 0 && isDisabled(nextActiveIndex)) {
          nextActiveIndex -= 1;
        }

        const searchInput = searchRef.current;
        const clearButton = clearRef.current;
        if (
          // Expect search input to immediately precede the clear button
          ((shouldShowClearButton('top') &&
            document.activeElement === clearButton) ||
            // Expect search input to immediately precede the first
            // selectable option
            (!shouldShowClearButton('top') && nextActiveIndex === -1)) &&
          searchInput &&
          searchInput.focus
        ) {
          setActiveIndex(-1);
          setKeyboardNavigation(true);
          setFocusWithoutScroll(searchInput);
        } else if (
          // Expect clear button to immediately precede the first
          // selectable option
          shouldShowClearButton('top') &&
          nextActiveIndex === -1 &&
          clearButton &&
          clearButton.focus
        ) {
          // Clear buttons already have focus handlers that set the active index
          setKeyboardNavigation(true);
          setFocusWithoutScroll(clearButton);
        } else if (nextActiveIndex >= 0) {
          setActiveIndex(nextActiveIndex);
          setKeyboardNavigation(true);
        }
      },
      [activeIndex, isDisabled, shouldShowClearButton],
    );

    const onKeyDownOption = useCallback(
      (event) => {
        if (!onSearch) {
          const nextActiveIndex = options.findIndex((e, index) => {
            let label;
            if (typeof e === 'object') {
              label = e.label || applyKey(e, labelKey);
            } else {
              label = e;
            }
            return (
              typeof label === 'string' &&
              label.charAt(0).toLowerCase() === event.key.toLowerCase() &&
              !isDisabled(index)
            );
          });

          if (nextActiveIndex >= 0) {
            event.preventDefault();
            setActiveIndex(nextActiveIndex);
            setKeyboardNavigation(true);
          }
        }
        if (onKeyDown) {
          onKeyDown(event);
        }
      },
      [isDisabled, labelKey, onKeyDown, options, onSearch],
    );

    const onActiveOption = useCallback(
      (index) => () => {
        if (!keyboardNavigation) setActiveIndex(index);
      },
      [keyboardNavigation],
    );

    const onSelectOption = useCallback(
      (event) => {
        if (
          (shouldShowClearButton('bottom') || shouldShowClearButton('top')) &&
          containsFocus(clearRef.current)
        ) {
          onChange(event, { option: undefined, value: '', selected: '' });
        } else if (activeIndex >= 0 && activeIndex < options.length) {
          event.preventDefault(); // prevent submitting forms
          selectOption(activeIndex)(event);
        }
      },
      [activeIndex, selectOption, options, onChange, shouldShowClearButton],
    );

    const customSearchInput = theme.select.searchInput;
    const SelectTextInput = customSearchInput || TextInput;
    const selectOptionsStyle = theme.select.options
      ? {
          ...theme.select.options.box,
          ...theme.select.options.container,
        }
      : {};

    return (
      <Keyboard
        onEnter={onSelectOption}
        onSpace={onSelectOption}
        onUp={onPreviousOption}
        onDown={onNextOption}
        onKeyDown={onKeyDownOption}
      >
        <StyledContainer
          ref={ref}
          id={id ? `${id}__select-drop` : undefined}
          dropHeight={dropHeight}
          {...passThemeFlag}
        >
          {onSearch && (
            <Box pad={!customSearchInput ? 'xsmall' : undefined} flex={false}>
              <SelectTextInput
                focusIndicator={!customSearchInput}
                size="small"
                ref={searchRef}
                type="search"
                value={search || ''}
                placeholder={searchPlaceholder}
                onChange={(event) => {
                  const nextSearch = event.target.value;
                  setSearch(nextSearch);
                  setActiveIndex(-1);
                  onSearch(nextSearch);
                }}
                onFocus={() => setActiveIndex(-1)}
              />
            </Box>
          )}
          {shouldShowClearButton('top') && (
            <ClearButton
              ref={clearRef}
              clear={clear}
              name={name}
              onClear={onClear}
              onFocus={() => setActiveIndex(-1)}
              onMouseOver={() => {
                setActiveIndex(-1);
                const clearButton = clearRef.current;
                if (clearButton && clearButton.focus) {
                  clearButton.focus();
                }
              }}
              theme={theme}
            />
          )}
          {options.length > 0 ? (
            <OptionsContainer
              role="listbox"
              tabIndex="-1"
              ref={optionsRef}
              aria-multiselectable={multiple}
              onMouseMove={() => setKeyboardNavigation(false)}
            >
              <InfiniteScroll
                items={options}
                step={theme.select.step}
                onMore={onMore}
                replace={replace}
                show={
                  ![-1, options.length].includes(activeIndex)
                    ? activeIndex
                    : undefined
                }
              >
                {(option, index, optionRef) => {
                  const optionDisabled = isDisabled(index);
                  const optionSelected = isSelected(index);
                  const optionActive = activeIndex === index;
                  // Determine whether the label is done as a child or
                  // as an option Button kind property.
                  let child;
                  let textComponent = false;
                  if (children) {
                    child = children(option, index, options, {
                      active: optionActive,
                      disabled: optionDisabled,
                      selected: optionSelected,
                    });
                    if (
                      typeof child === 'string' ||
                      (child.props &&
                        child.props.children &&
                        typeof child.props.children === 'string')
                    )
                      textComponent = true;
                  } else if (theme.select.options) {
                    child = (
                      <Box {...selectOptionsStyle}>
                        <Text {...theme.select.options.text}>
                          {getOptionLabel(index, options, labelKey)}
                        </Text>
                      </Box>
                    );
                    textComponent = true;
                  }

                  // if we have a child, turn on plain, and hoverIndicator
                  return (
                    <SelectOption
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      // merge optionRef and activeRef
                      ref={(node) => {
                        // eslint-disable-next-line no-param-reassign
                        if (optionRef) optionRef.current = node;
                        if (optionActive) activeRef.current = node;
                      }}
                      tabIndex={optionSelected ? '0' : '-1'}
                      role="option"
                      aria-setsize={options.length}
                      aria-posinset={index + 1}
                      aria-selected={optionSelected}
                      focusIndicator={false}
                      aria-disabled={optionDisabled || undefined}
                      plain={!child ? undefined : true}
                      align="start"
                      kind={!child ? 'option' : undefined}
                      label={
                        !child
                          ? getOptionLabel(index, options, labelKey || valueKey)
                          : undefined
                      }
                      disabled={optionDisabled || undefined}
                      active={optionActive}
                      selected={optionSelected}
                      // allow keyboard navigation to start from
                      // selected option after tabbing to it
                      onFocus={() => setActiveIndex(index)}
                      onMouseOver={
                        !optionDisabled ? onActiveOption(index) : undefined
                      }
                      onClick={
                        !optionDisabled ? selectOption(index) : undefined
                      }
                      textComponent={textComponent}
                      {...passThemeFlag}
                    >
                      {child}
                    </SelectOption>
                  );
                }}
              </InfiniteScroll>
            </OptionsContainer>
          ) : (
            <EmptySearchOption
              emptySearchMessage={emptySearchMessage}
              selectOptionsStyle={selectOptionsStyle}
              theme={theme}
            />
          )}
          {shouldShowClearButton('bottom') && (
            <ClearButton
              ref={clearRef}
              clear={clear}
              name={name}
              onClear={onClear}
              onFocus={() => setActiveIndex(options.length)}
              onMouseOver={() => {
                setActiveIndex(options.length);
                const clearButton = clearRef.current;
                if (clearButton && clearButton.focus) {
                  clearButton.focus();
                }
              }}
              theme={theme}
            />
          )}
        </StyledContainer>
      </Keyboard>
    );
  },
);

export { SelectContainer };
