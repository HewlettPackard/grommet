import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import styled from 'styled-components';
import { Box } from '../Box';
import { Button } from '../Button';
import { Drop } from '../Drop';
import { FormContext } from '../Form/FormContext';
import { Keyboard } from '../Keyboard';
import { sizeStyle, useForwardedRef, useSizedIcon } from '../../utils';

import {
  StyledMaskedInput,
  StyledMaskedInputContainer,
  StyledIcon,
} from './StyledMaskedInput';
import { MaskedInputPropTypes } from './propTypes';
import { useThemeValue } from '../../utils/useThemeValue';

const parseValue = (mask, value) => {
  // break the value up into mask parts
  const valueParts = []; // { part, beginIndex, endIndex }
  let valueIndex = 0;
  let maskIndex = 0;
  while (
    value !== undefined &&
    valueIndex < value.length &&
    maskIndex < mask.length
  ) {
    const item = mask[maskIndex];
    let found;
    if (item.fixed) {
      const { length } = item.fixed;

      // grab however much of value (starting at valueIndex) matches
      // item.fixed. If none matches it and there is more in value
      // add in the fixed item.
      let matching = 0;
      while (
        matching < length &&
        value[valueIndex + matching] === item.fixed[matching]
      ) {
        matching += 1;
      }

      if (matching > 0) {
        let part = value.slice(valueIndex, valueIndex + matching);
        if (valueIndex + matching < value.length) {
          // matched part of the fixed portion but there's more stuff
          // after it. Go ahead and fill in the entire fixed chunk
          part = item.fixed;
        }
        valueParts.push({
          part,
          beginIndex: valueIndex,
          endIndex: valueIndex + matching - 1,
        });
        valueIndex += matching;
      } else {
        valueParts.push({
          part: item.fixed,
          beginIndex: valueIndex,
          endIndex: valueIndex + length - 1,
        });
      }

      maskIndex += 1;
      found = true;
    } else if (item.options && item.restrictToOptions !== false) {
      // reverse assuming larger is later
      found = item.options
        .slice(0)
        .reverse()
        // eslint-disable-next-line no-loop-func
        .some((option) => {
          const { length } = option;
          const part = value.slice(valueIndex, valueIndex + length);
          if (part === option) {
            valueParts.push({
              part,
              beginIndex: valueIndex,
              endIndex: valueIndex + length - 1,
            });
            valueIndex += length;
            maskIndex += 1;
            return true;
          }
          return false;
        });
    }
    if (!found) {
      if (item.regexp) {
        const minLength =
          (Array.isArray(item.length) && item.length[0]) || item.length || 1;
        const maxLength =
          (Array.isArray(item.length) && item.length[1]) ||
          item.length ||
          value.length - valueIndex;
        let length = maxLength;
        while (!found && length >= minLength) {
          const part = value.slice(valueIndex, valueIndex + length);
          if (item.regexp.test(part)) {
            valueParts.push({
              part,
              beginIndex: valueIndex,
              endIndex: valueIndex + length - 1,
            });
            valueIndex += length;
            maskIndex += 1;
            found = true;
          }
          length -= 1;
        }
        if (!found) {
          valueIndex = value.length;
        }
      } else {
        const length = Array.isArray(item.length)
          ? item.length[1]
          : item.length || value.length - valueIndex;
        const part = value.slice(valueIndex, valueIndex + length);
        valueParts.push({
          part,
          beginIndex: valueIndex,
          endIndex: valueIndex + length - 1,
        });
        valueIndex += length;
        maskIndex += 1;
      }
    }
  }
  return valueParts;
};

const defaultMask = [
  {
    regexp: /[^]*/,
  },
];

const ContainerBox = styled(Box)`
  ${(props) =>
    props.dropHeight
      ? sizeStyle('max-height', props.dropHeight, props.theme)
      : 'max-height: inherit;'};
`;

const dropAlign = { top: 'bottom', left: 'left' };

const MaskedInput = forwardRef(
  (
    {
      a11yTitle,
      dropHeight,
      dropProps,
      focus: focusProp,
      focusIndicator = true,
      icon,
      maskIconClickable = false,
      id,
      mask = defaultMask,
      name,
      onBlur,
      onChange,
      onFocus,
      onKeyDown,
      placeholder,
      plain,
      reverse,
      textAlign,
      value: valueProp,
      ...rest
    },
    ref,
  ) => {
    const { theme, passThemeFlag } = useThemeValue();
    const formContext = useContext(FormContext);

    const [value, setValue] = formContext.useFormInput({
      name,
      value: valueProp,
      initialValue: '',
    });

    const valueParts = useMemo(() => parseValue(mask, value), [mask, value]);

    const inputRef = useForwardedRef(ref);
    const dropRef = useRef();

    // Caller's ref, if provided
    const [dropPropsTarget, setDropPropsTarget] = useState();
    useEffect(() => {
      let nextDropPropsTarget;
      // If caller provided a ref, set to 'pending' until ref.current is defined
      if (dropProps && 'target' in dropProps) {
        nextDropPropsTarget = dropProps.target || 'pending';
        setDropPropsTarget(nextDropPropsTarget);
      }
    }, [dropProps]);

    const [focus, setFocus] = useState(focusProp);
    const [activeMaskIndex, setActiveMaskIndex] = useState();
    const [activeOptionIndex, setActiveOptionIndex] = useState();
    const [showDrop, setShowDrop] = useState();

    useEffect(() => {
      if (focus) {
        const timer = setTimeout(() => {
          // determine which mask element the caret is at
          const caretIndex = inputRef.current.selectionStart;
          let maskIndex;
          valueParts.some((part, index) => {
            if (part.beginIndex <= caretIndex && part.endIndex >= caretIndex) {
              maskIndex = index;
              return true;
            }
            return false;
          });
          if (maskIndex === undefined && valueParts.length < mask.length) {
            maskIndex = valueParts.length; // first unused one
          }
          if (maskIndex && mask[maskIndex].fixed) {
            maskIndex -= 1; // fixed mask parts are never "active"
          }
          if (maskIndex !== activeMaskIndex) {
            setActiveMaskIndex(maskIndex);
            setActiveOptionIndex(-1);
            setShowDrop(maskIndex >= 0 && mask[maskIndex].options && true);
          }
        }, 10); // 10ms empirically chosen
        return () => clearTimeout(timer);
      }
      return undefined;
    }, [activeMaskIndex, focus, inputRef, mask, valueParts]);

    const setInputValue = useCallback(
      (nextValue) => {
        // Calling set value function directly on input because React library
        // overrides setter `event.target.value =` and loses original event
        // target fidelity.
        // https://stackoverflow.com/a/46012210 &&
        // https://github.com/grommet/grommet/pull/3171#discussion_r296415239
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value',
        ).set;
        nativeInputValueSetter.call(inputRef.current, nextValue);
        const event = new Event('input', { bubbles: true });
        inputRef.current.dispatchEvent(event);
      },
      [inputRef],
    );

    // This could be due to a paste or as the user is typing.
    const onChangeInput = useCallback(
      (event) => {
        const eventValue = event.target.value;
        // Align with the mask.
        const nextValueParts = parseValue(mask, eventValue);
        const nextValue = nextValueParts.map((part) => part.part).join('');

        if (nextValue !== eventValue) {
          // The mask adjusted the next value. If something was added,
          // the value must be valid. Change the actual input value
          // to correspond.
          // This will re-trigger this callback with the next value.
          if (nextValue.length > eventValue.length) setInputValue(nextValue);
          // If the nextValue is shorter, something must be invalid.
          else if (value && eventValue.length < value.length) {
            // If the user is removing characters, preserve what the
            // user is working on.
            setValue(eventValue);
            if (onChange) onChange(event);
          } else {
            // If the user is adding invalid characters, don't allow it.
            // Revert to the prior value.
            setInputValue(value);
          }
        } else if (value !== nextValue) {
          setValue(nextValue);
          if (onChange) onChange(event);
        }
      },
      [mask, onChange, setInputValue, setValue, value],
    );

    const onOption = useCallback(
      (option) => () => {
        const nextValueParts = [...valueParts];
        nextValueParts[activeMaskIndex] = { part: option };
        // add any fixed parts that follow
        let index = activeMaskIndex + 1;
        while (
          index < mask.length &&
          !nextValueParts[index] &&
          mask[index].fixed
        ) {
          nextValueParts[index] = { part: mask[index].fixed };
          index += 1;
        }
        const nextValue = nextValueParts.map((part) => part.part).join('');
        setInputValue(nextValue);
        // restore focus to input
        inputRef.current.focus();
      },
      [activeMaskIndex, inputRef, mask, setInputValue, valueParts],
    );

    const onNextOption = useCallback(
      (event) => {
        const item = mask[activeMaskIndex];
        if (item && item.options) {
          event.preventDefault();
          const index = Math.min(
            activeOptionIndex + 1,
            item.options.length - 1,
          );
          setActiveOptionIndex(index);
        }
      },
      [activeMaskIndex, activeOptionIndex, mask],
    );

    const onPreviousOption = useCallback(
      (event) => {
        if (activeMaskIndex >= 0 && mask[activeMaskIndex].options) {
          event.preventDefault();
          const index = Math.max(activeOptionIndex - 1, 0);
          setActiveOptionIndex(index);
        }
      },
      [activeMaskIndex, activeOptionIndex, mask],
    );

    const onSelectOption = useCallback(
      (event) => {
        if (activeMaskIndex >= 0 && activeOptionIndex >= 0) {
          event.preventDefault();
          const option = mask[activeMaskIndex].options[activeOptionIndex];
          onOption(option)();
        }
      },
      [activeMaskIndex, activeOptionIndex, mask, onOption],
    );

    const onEsc = useCallback(
      (event) => {
        if (showDrop) {
          // we have to stop both synthetic events and native events
          // drop and layer should not close by pressing esc on this input
          event.stopPropagation();
          event.nativeEvent.stopImmediatePropagation();
          setShowDrop(false);
        }
      },
      [showDrop],
    );

    const onHideDrop = useCallback(() => setShowDrop(false), []);

    const renderPlaceholder = () =>
      mask.map((item) => item.placeholder || item.fixed).join('');

    const maskedInputIcon = useSizedIcon(icon, rest.size, theme);

    return (
      <StyledMaskedInputContainer plain={plain} {...passThemeFlag}>
        {maskedInputIcon && (
          <StyledIcon
            reverse={reverse}
            theme={theme}
            maskIconClickable={maskIconClickable}
            onClick={
              maskIconClickable
                ? (event) => {
                    setFocus(true);
                    setShowDrop(true);
                    if (onFocus) onFocus(event);
                  }
                : undefined
            }
          >
            {maskedInputIcon}
          </StyledIcon>
        )}
        <Keyboard
          onEsc={onEsc}
          onTab={showDrop ? () => setShowDrop(false) : undefined}
          onLeft={undefined}
          onRight={undefined}
          onUp={onPreviousOption}
          onDown={showDrop ? onNextOption : () => setShowDrop(true)}
          onEnter={onSelectOption}
          onKeyDown={onKeyDown}
        >
          <StyledMaskedInput
            ref={inputRef}
            aria-label={a11yTitle}
            id={id}
            name={name}
            autoComplete="off"
            focusIndicator={focusIndicator}
            plain={plain}
            placeholder={placeholder || renderPlaceholder()}
            icon={icon}
            reverse={reverse}
            focus={focus}
            textAlign={textAlign}
            {...rest}
            value={value}
            theme={theme}
            onFocus={(event) => {
              setFocus(true);
              setShowDrop(true);
              if (onFocus) onFocus(event);
            }}
            onBlur={(event) => {
              setFocus(false);
              // This will be called when the user clicks on a suggestion,
              // check for that and don't remove the drop in that case.
              // Drop will already have removed itself if the user has focused
              // outside of the Drop.
              if (!dropRef.current) setShowDrop(false);
              if (onBlur) onBlur(event);
            }}
            onChange={onChangeInput}
          />
        </Keyboard>
        {showDrop &&
          mask[activeMaskIndex] &&
          mask[activeMaskIndex].options &&
          // If caller has specified dropProps.target, ensure target is defined
          dropPropsTarget !== 'pending' && (
            <Drop
              id={id ? `masked-input-drop__${id}` : undefined}
              align={dropAlign}
              responsive={false}
              target={inputRef.current}
              onClickOutside={onHideDrop}
              onEsc={onHideDrop}
              // MaskedInput manages its own keyboard behavior via Keyboard
              trapFocus={false}
              {...dropProps}
            >
              <ContainerBox
                ref={dropRef}
                overflow="auto"
                dropHeight={dropHeight}
                {...passThemeFlag}
              >
                {mask[activeMaskIndex].options.map((option, index) => {
                  // Determine whether the label is done as a child or
                  // as an option Button kind property.
                  const child = !theme.button.option ? (
                    <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
                      {option}
                    </Box>
                  ) : undefined;
                  // if we have a child, turn on plain, and hoverIndicator

                  return (
                    <Box key={option} flex={false}>
                      <Button
                        tabIndex="-1"
                        onClick={onOption(option)}
                        onMouseOver={() => setActiveOptionIndex(index)}
                        onFocus={() => {}}
                        active={index === activeOptionIndex}
                        plain={!child ? undefined : true}
                        align="start"
                        kind={!child ? 'option' : undefined}
                        hoverIndicator={!child ? undefined : 'background'}
                        label={!child ? option : undefined}
                      >
                        {child}
                      </Button>
                    </Box>
                  );
                })}
              </ContainerBox>
            </Drop>
          )}
      </StyledMaskedInputContainer>
    );
  },
);

MaskedInput.displayName = 'MaskedInput';
MaskedInput.propTypes = MaskedInputPropTypes;

export { MaskedInput };
