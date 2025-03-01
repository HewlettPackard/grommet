import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  ResponsiveContainerContext,
  ResponsiveContext,
  ThemeContext,
} from '../../contexts';
import { StyledResponsiveContainer } from './StyledResponsiveContainer';

// Borrowed ResponsiveContext breakpoint code
// but based the breakpoint on the container size rather
// than the full document size

const getBreakpoint = (viewportWidth, theme) => {
  const sortedBreakpoints = Object.keys(theme.global.breakpoints).sort(
    (a, b) => {
      const first = theme.global.breakpoints[a];
      const second = theme.global.breakpoints[b];
      if (!first) return 1;
      if (!second) return -1;
      if (!first.value) return 1;
      if (!second.value) return -1;
      return first.value - second.value;
    },
  );

  // the last breakpoint on the sorted array should have
  // no windowWidth boundaries
  const lastBreakpoint = sortedBreakpoints[sortedBreakpoints.length - 1];
  const result = sortedBreakpoints.find((name) => {
    const breakpoint = theme.global.breakpoints[name];
    return !breakpoint.value || breakpoint.value >= viewportWidth
      ? name
      : false;
  });

  return result || lastBreakpoint;
};

const getDeviceBreakpoint = (type, theme) =>
  theme.global.deviceBreakpoints[type];

const deviceResponsive = (userAgent, theme) => {
  // log('--deviceResponsive', userAgent, theme);
  /*
   * Regexes provided for mobile and tablet detection are meant to replace
   * a full-featured specific library due to contributing a considerable size
   * into the bundle.
   *
   * User agents found https://deviceatlas.com/blog/list-of-user-agent-strings
   */
  if (userAgent) {
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(userAgent)) {
      return getDeviceBreakpoint('tablet', theme);
    }
    if (/Mobile|iPhone|Android/.test(userAgent)) {
      return getDeviceBreakpoint('phone', theme);
    }
    return getDeviceBreakpoint('computer', theme);
  }
  return undefined;
};

const responsiveContainerValue = true;

export const ResponsiveContainer = ({ ...rest }) => {
  const theme = useContext(ThemeContext);
  const ref = useRef(undefined);
  const [stateResponsive, setResponsive] = useState();

  useEffect(() => {
    const element = ref?.current;

    if (!element) return undefined;

    // TODO: fallback to clientWidth when no window

    // eslint-disable-next-line no-undef
    const observer = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }
        const size = entries[0]?.borderBoxSize?.[0]?.inlineSize;
        if (size) {
          console.log(
            'OFFSET',
            document.body.clientWidth - size,
            document.body.clientWidth,
          );
          setResponsive(getBreakpoint(size, theme));
        }
      });
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [theme]);

  const responsive =
    stateResponsive ||
    deviceResponsive(navigator.userAgent, theme) ||
    theme?.global?.deviceBreakpoints.tablet;

  return (
    <ResponsiveContext.Provider value={responsive}>
      <ResponsiveContainerContext.Provider value={responsiveContainerValue}>
        <StyledResponsiveContainer ref={ref} {...rest} />
      </ResponsiveContainerContext.Provider>
    </ResponsiveContext.Provider>
  );
};

// TBD StyledLayer
// TBD StyledHeading
