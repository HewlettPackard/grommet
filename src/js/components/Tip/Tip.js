import React, {
  Children,
  cloneElement,
  forwardRef,
  useEffect,
  useState,
} from 'react';

import { Box } from '../Box';
import { Drop } from '../Drop';
import { useForwardedRef, useKeyboard } from '../../utils';
import { TipPropTypes } from './propTypes';
import { useThemeValue } from '../../utils/useThemeValue';

/*
 * This function getReactNodeRef is adapted from
 * [Material UI] (https://github.com/mui/material-ui)
 * Licensed under the MIT License (c) 2024 aarongarciah
 * The function has been modified from its original version.
 */
const getReactNodeRef = (element) => {
  if (!element || !React.isValidElement(element)) {
    return null;
  }

  // 'ref' is passed as prop in React 19, whereas 'ref' is directly attached to
  // children in older versions
  return {}.propertyIsEnumerable.call(element.props, 'ref')
    ? element.props.ref
    : element.ref;
};

const Tip = forwardRef(
  ({ children, content, defaultVisible = false, dropProps, plain }, tipRef) => {
    const { theme } = useThemeValue();
    const [over, setOver] = useState(false);
    const [tooltipOver, setTooltipOver] = useState(false);
    const usingKeyboard = useKeyboard();

    const componentRef = useForwardedRef(tipRef);

    // Three use case for children
    // 1. Tip has a single child + it is a React Element => Great!
    // 2. Tip has a single child +  not React Element =>
    // span will wrap the child so we can use ref and events.
    // 3. Tip has more than one child => Abort, display Children.only error
    const child =
      (Children.count(children) <= 1 && !React.isValidElement(children) && (
        <span>{children}</span>
      )) ||
      Children.only(children);

    const clonedChild = cloneElement(child, {
      onMouseEnter: (event) => {
        setOver(true);
        if (child.props?.onMouseEnter) child.props.onMouseEnter(event);
      },
      onMouseLeave: (event) => {
        setOver(false);
        if (child.props?.onMouseLeave) child.props.onMouseLeave(event);
      },
      onFocus: (event) => {
        if (usingKeyboard) setOver(true);
        if (child.props?.onFocus) child.props.onFocus(event);
      },
      onBlur: (event) => {
        if (usingKeyboard) setOver(false);
        if (child.props?.onBlur) child.props.onBlur(event);
      },
      key: 'tip-child',
      ref: (node) => {
        // https://github.com/facebook/react/issues/8873#issuecomment-287873307
        if (typeof componentRef === 'function') {
          componentRef(node);
        } else if (componentRef) {
          componentRef.current = node;
        }
        // Call the original ref, if any
        const callerRef = getReactNodeRef(child);
        if (typeof callerRef === 'function') {
          callerRef(node);
        } else if (callerRef) {
          callerRef.current = node;
        }
      },
    });

    useEffect(() => {
      setOver(defaultVisible);
    }, [defaultVisible]);

    return [
      clonedChild,
      (over || tooltipOver) && (
        <Drop
          target={componentRef.current}
          trapFocus={false}
          key="tip-drop"
          {...theme.tip.drop}
          {...dropProps}
          onMouseEnter={() => setTooltipOver(true)}
          onMouseLeave={() => setTooltipOver(false)}
        >
          {plain ? content : <Box {...theme.tip.content}>{content}</Box>}
        </Drop>
      ),
    ];
  },
);

Tip.displayName = 'Tip';
Tip.propTypes = TipPropTypes;

export { Tip };
