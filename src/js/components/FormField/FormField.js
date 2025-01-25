import React, {
  Children,
  cloneElement,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';

import {
  containsFocus,
  shouldKeepFocus,
  withinDropPortal,
  PortalContext,
} from '../../utils';
import { useDebounce } from '../../utils/use-debounce';
import { focusStyle } from '../../utils/styles';
import { parseMetricToNum } from '../../utils/mixins';
import { useForwardedRef } from '../../utils/refs';
import { Box } from '../Box';
import { CheckBox } from '../CheckBox';
import { CheckBoxGroup } from '../CheckBoxGroup';
import { RadioButtonGroup } from '../RadioButtonGroup';
import { Text } from '../Text';
import { TextInput } from '../TextInput';
import { FormContext } from '../Form/FormContext';
import { FormFieldPropTypes } from './propTypes';
import { useThemeValue } from '../../utils/useThemeValue';
import { AnnounceContext } from '../../contexts/AnnounceContext';

const grommetInputNames = [
  'CheckBox',
  'CheckBoxGroup',
  'TextInput',
  'Select',
  'MaskedInput',
  'SelectMultiple',
  'TextArea',
  'DateInput',
  'FileInput',
  'RadioButton',
  'RadioButtonGroup',
  'RangeInput',
  'RangeSelector',
  'StarRating',
  'ThumbsRating',
];
const grommetInputPadNames = [
  'CheckBox',
  'CheckBoxGroup',
  'RadioButton',
  'RadioButtonGroup',
  'RangeInput',
  'RangeSelector',
];

const isGrommetInput = (comp) =>
  comp &&
  (grommetInputNames.indexOf(comp.displayName) !== -1 ||
    grommetInputPadNames.indexOf(comp.displayName) !== -1);

const FormFieldBox = styled(Box)`
  ${(props) => props.focus && focusStyle({ justBorder: true })}
  ${(props) => props.theme.formField && props.theme.formField.extend}
`;

const FormFieldContentBox = styled(Box)`
  ${(props) => props.focus && focusStyle({ justBorder: true })}
`;

const StyledMessageContainer = styled(Box)`
  ${(props) =>
    props.messageType &&
    props.theme.formField[props.messageType].container &&
    props.theme.formField[props.messageType].container.extend}
`;

const RequiredText = styled(Text)`
  color: inherit;
  font-weight: inherit;
  line-height: inherit;
`;

const ScreenReaderOnly = styled(Text)`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

const Message = ({ error, info, message, type, ...rest }) => {
  const { theme, passThemeFlag } = useThemeValue();
  if (message) {
    let icon;
    let containerProps;

    if (type) {
      icon = theme.formField[type] && theme.formField[type].icon;
      containerProps = theme.formField[type] && theme.formField[type].container;
    }

    let messageContent;
    if (typeof message === 'string')
      messageContent = <Text {...rest}>{message}</Text>;
    else messageContent = <Box {...rest}>{message}</Box>;

    return icon || containerProps ? (
      <StyledMessageContainer
        direction="row"
        messageType={type}
        {...containerProps}
        {...passThemeFlag}
      >
        {icon && <Box flex={false}>{icon}</Box>}
        {messageContent}
      </StyledMessageContainer>
    ) : (
      messageContent
    );
  }
  return null;
};

const Input = ({ component, disabled, invalid, name, onChange, ...rest }) => {
  const formContext = useContext(FormContext);
  const [value, setValue] = formContext.useFormInput({
    name,
    value: rest.value,
  });
  const InputComponent = component || TextInput;
  // Grommet input components already check for FormContext
  // and, using their `name`, end up calling the useFormInput.setValue()
  // already. For custom components, we expect they will call
  // this onChange() and we'll call setValue() here, primarily
  // for backwards compatibility.
  const extraProps = isGrommetInput(InputComponent)
    ? { focusIndicator: false, onChange, plain: true }
    : {
        value,
        onChange: (event) => {
          setValue(
            event.value !== undefined ? event.value : event.target.value,
          );
          if (onChange) onChange(event);
        },
      };
  return (
    <InputComponent
      name={name}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      {...rest}
      {...extraProps}
    />
  );
};

const FormField = forwardRef(
  (
    {
      children,
      className,
      component,
      contentProps,
      disabled, // pass through in renderInput()
      error: errorProp,
      help,
      htmlFor,
      info: infoProp,
      label,
      margin,
      name, // pass through in renderInput()
      onBlur,
      onChange,
      onFocus,
      pad,
      required,
      style,
      validate,
      validateOn,
      ...rest
    },
    ref,
  ) => {
    const { theme, passThemeFlag } = useThemeValue();
    const formContext = useContext(FormContext);

    const {
      error,
      info,
      inForm,
      onBlur: contextOnBlur,
      onChange: contextOnChange,
    } = formContext.useFormField({
      disabled,
      error: errorProp,
      info: infoProp,
      name,
      required,
      validate,
      validateOn,
    });
    const formKind = formContext.kind;
    const [focus, setFocus] = useState();
    const formFieldRef = useForwardedRef(ref);

    const { formField: formFieldTheme } = theme;
    const { border: themeBorder } = formFieldTheme;
    const debounce = useDebounce();

    const portalContext = useContext(PortalContext);
    const announce = useContext(AnnounceContext);

    useEffect(() => {
      if (error && validate?.max) {
        announce(error, 'polite', 5000);
      }
    }, [error, announce, validate?.max]);

    const readOnlyField = useMemo(() => {
      let readOnly = false;
      if (children) {
        Children.map(children, (child) => {
          if (
            (child?.props?.readOnly === true ||
              child?.props?.readOnlyCopy === true) &&
            child.type &&
            ('TextInput'.indexOf(child.type.displayName) !== -1 ||
              'DateInput'.indexOf(child.type.displayName) !== -1)
          ) {
            readOnly = true;
          }
        });
      }
      return readOnly;
    }, [children]);

    // This is here for backwards compatibility. In case the child is a grommet
    // input component, set plain and focusIndicator props, if they aren't
    // already set.
    let wantContentPad =
      component &&
      (component === CheckBox ||
        component === CheckBoxGroup ||
        component === RadioButtonGroup);

    let contents =
      (themeBorder &&
        children &&
        Children.map(children, (child) => {
          if (
            child &&
            child.type &&
            grommetInputPadNames.indexOf(child.type.displayName) !== -1
          ) {
            wantContentPad = true;
          }
          if (
            child &&
            child.type &&
            grommetInputNames.indexOf(child.type.displayName) !== -1 &&
            child.props.plain === undefined &&
            child.props.focusIndicator === undefined
          ) {
            return cloneElement(child, {
              plain: true,
              focusIndicator: false,
              pad:
                'CheckBox'.indexOf(child.type.displayName) !== -1
                  ? formFieldTheme?.checkBox?.pad
                  : undefined,
            });
          }
          return child;
        })) ||
      children;

    // put rest on container, unless we use internal Input
    let containerRest = rest;
    if (inForm) {
      if (!contents) containerRest = {};
      contents = contents || (
        <Input
          component={component}
          disabled={disabled}
          invalid={!!error}
          name={name}
          label={component === CheckBox ? label : undefined}
          {...rest}
        />
      );
    }

    const themeContentProps = { ...formFieldTheme.content };

    if (!pad && !wantContentPad) {
      themeContentProps.pad = undefined;
    }

    if (themeBorder && themeBorder.position === 'inner') {
      if (readOnlyField) {
        themeContentProps.background = theme.global.input.readOnly?.background;
      } else if (error && formFieldTheme.error) {
        themeContentProps.background = formFieldTheme.error.background;
      } else if (disabled && formFieldTheme.disabled) {
        themeContentProps.background = formFieldTheme.disabled.background;
      }
    }

    // fileinput handle
    // use fileinput plain use formfield to drive the border
    let isFileInputComponent;
    if (
      children &&
      Children.forEach(children, (child) => {
        if (
          child &&
          child.type &&
          'FileInput'.indexOf(child.type.displayName) !== -1
        )
          isFileInputComponent = true;
      })
    );

    if (
      component &&
      component.displayName === 'FileInput' &&
      !isFileInputComponent
    ) {
      isFileInputComponent = true;
    }

    if (!themeBorder) {
      contents = (
        <Box {...themeContentProps} {...contentProps}>
          {contents}
        </Box>
      );
    }

    let borderColor;

    if (
      disabled &&
      formFieldTheme.disabled.border &&
      formFieldTheme.disabled.border.color
    ) {
      borderColor = formFieldTheme.disabled.border.color;
    } else if (readOnlyField && theme.global.input?.readOnly?.border?.color) {
      borderColor = theme.global.input?.readOnly?.border?.color;
    } else if (
      // backward compatibility check
      (error && themeBorder && themeBorder.error.color) ||
      (error && formFieldTheme.error && formFieldTheme.error.border)
    ) {
      if (
        themeBorder.error.color &&
        formFieldTheme.error.border === undefined
      ) {
        borderColor = themeBorder.error.color || 'status-critical';
      } else if (
        formFieldTheme.error.border &&
        formFieldTheme.error.border.color
      ) {
        borderColor = formFieldTheme.error.border.color || 'status-critical';
      }
    } else if (
      focus &&
      formFieldTheme.focus &&
      formFieldTheme.focus.border &&
      formFieldTheme.focus.border.color
    ) {
      borderColor = formFieldTheme.focus.border.color;
    } else {
      borderColor = (themeBorder && themeBorder.color) || 'border';
    }

    let labelStyle;
    if (formKind) {
      labelStyle = { ...formFieldTheme[formKind].label };
    } else labelStyle = { ...formFieldTheme.label };

    if (disabled) {
      labelStyle.color =
        formFieldTheme.disabled && formFieldTheme.disabled.label
          ? formFieldTheme.disabled.label.color
          : labelStyle.color;
    }

    const themeHelpProps = {
      ...formFieldTheme.help,
      ...(disabled && { color: formFieldTheme?.disabled?.help?.color }),
    };

    const themeInfoProps = {
      ...formFieldTheme.info,
      ...(disabled && { color: formFieldTheme?.disabled?.info?.color }),
    };

    let abut;
    let abutMargin;
    let outerStyle = style;

    // If fileinput is wrapped in a formfield we want to use
    // the border style from the fileInput.theme. We also do not
    // want the foocus around the formfield since the the focus
    // is on the anchor/button inside fileinput

    if (themeBorder) {
      const innerProps =
        themeBorder.position === 'inner'
          ? {
              border: {
                ...themeBorder,
                size: isFileInputComponent
                  ? theme.fileInput.border.size
                  : undefined,
                style: isFileInputComponent
                  ? theme.fileInput.border.style
                  : undefined,
                side: isFileInputComponent
                  ? theme.fileInput.border.side
                  : themeBorder.side || 'bottom',
                color: borderColor,
              },
              round: formFieldTheme.round,
              focus: isFileInputComponent ? undefined : focus,
            }
          : {};
      contents = (
        <FormFieldContentBox
          {...themeContentProps}
          {...innerProps}
          {...contentProps}
          {...passThemeFlag}
        >
          {contents}
        </FormFieldContentBox>
      );

      const mergedMargin = margin || formFieldTheme.margin;
      abut =
        themeBorder.position === 'outer' &&
        (themeBorder.side === 'all' ||
          themeBorder.side === 'horizontal' ||
          !themeBorder.side) &&
        !(
          mergedMargin &&
          ((typeof mergedMargin === 'string' && mergedMargin !== 'none') ||
            (mergedMargin.bottom && mergedMargin.bottom !== 'none') ||
            (mergedMargin.horizontal && mergedMargin.horizontal !== 'none'))
        );
      if (abut) {
        // marginBottom is set to overlap adjacent fields
        abutMargin = { bottom: '-1px' };
        if (margin) {
          abutMargin = margin;
        } else if (themeBorder.size) {
          // if the user defines a margin,
          // then the default margin below will be overridden
          abutMargin = {
            bottom: `-${parseMetricToNum(
              theme.global.borderSize[themeBorder.size] || themeBorder.size,
            )}px`,
          };
        }

        outerStyle = {
          position: focus ? 'relative' : undefined,
          zIndex: focus ? 10 : undefined,
          ...style,
        };
      }
    }

    let outerBackground;

    if (themeBorder && themeBorder.position === 'outer') {
      if (error && formFieldTheme.error && formFieldTheme.error.background) {
        outerBackground = formFieldTheme.error.background;
      } else if (
        focus &&
        formFieldTheme.focus &&
        formFieldTheme.focus.background &&
        formFieldTheme.focus.background.color
      ) {
        outerBackground = formFieldTheme.focus.background.color;
      } else if (
        disabled &&
        formFieldTheme.disabled &&
        formFieldTheme.disabled.background
      ) {
        outerBackground = formFieldTheme.disabled.background;
      }
    }

    const outerProps =
      themeBorder && themeBorder.position === 'outer'
        ? {
            border: { ...themeBorder, color: borderColor },
            round: formFieldTheme.round,
            focus,
          }
        : {};

    let { requiredIndicator } = theme.formField.label;
    if (requiredIndicator === true)
      // accessibility resource: https://www.deque.com/blog/anatomy-of-accessible-forms-required-form-fields/
      // this approach allows the required indicator to be hidden visually,
      // but present for assistive tech.
      // using aria-hidden so screen does not read out "star" and
      // just reads out "required"
      requiredIndicator = (
        <>
          <RequiredText aria-hidden="true">*</RequiredText>
          <ScreenReaderOnly>required</ScreenReaderOnly>
        </>
      );

    let showRequiredIndicator = required && requiredIndicator;
    if (typeof required === 'object' && required.indicator === false)
      showRequiredIndicator = false;

    return (
      <FormFieldBox
        ref={formFieldRef}
        className={className}
        background={outerBackground}
        margin={abut ? abutMargin : margin || { ...formFieldTheme.margin }}
        {...outerProps}
        style={outerStyle}
        onFocus={(event) => {
          const root = formFieldRef.current?.getRootNode();
          if (root) {
            setFocus(
              containsFocus(formFieldRef.current) && shouldKeepFocus(root),
            );
          }
          if (onFocus) onFocus(event);
        }}
        onBlur={(event) => {
          setFocus(false);

          // if input has a drop and focus is within drop
          // prevent onBlur validation from running until
          // focus is no longer within the drop or input
          if (
            contextOnBlur &&
            !formFieldRef.current.contains(event.relatedTarget) &&
            !withinDropPortal(event.relatedTarget, portalContext)
          ) {
            contextOnBlur(event);
          }

          if (onBlur) onBlur(event);
        }}
        onChange={
          contextOnChange || onChange
            ? (event) => {
                event.persist();
                if (onChange) onChange(event);
                if (contextOnChange)
                  debounce(() => () => contextOnChange(event));
              }
            : undefined
        }
        {...containerRest}
        {...passThemeFlag}
      >
        {(label && component !== CheckBox) || help ? (
          <>
            {label && component !== CheckBox && (
              <Text as="label" htmlFor={htmlFor} {...labelStyle}>
                {label}
                {showRequiredIndicator ? requiredIndicator : undefined}
              </Text>
            )}
            <Message message={help} {...themeHelpProps} />
          </>
        ) : undefined}
        {contents}
        <Message type="error" message={error} {...formFieldTheme.error} />
        <Message type="info" message={info} {...themeInfoProps} />
      </FormFieldBox>
    );
  },
);

FormField.displayName = 'FormField';
FormField.propTypes = FormFieldPropTypes;

export { FormField };
