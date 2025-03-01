import React, {
  Children,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ThemeContext } from 'styled-components';
import { backgroundIsDark } from '../../utils';
import { Keyboard } from '../Keyboard';

import { StyledBox, StyledBoxGap } from './StyledBox';
import { BoxPropTypes } from './propTypes';
import { SkeletonContext, useSkeleton } from '../Skeleton';
import { AnnounceContext } from '../../contexts/AnnounceContext';
import { OptionsContext } from '../../contexts/OptionsContext';
import { ResponsiveContainerContext } from '../../contexts';
import { useThemeValue } from '../../utils/useThemeValue';

const Box = forwardRef(
  (
    {
      a11yTitle,
      background: backgroundProp,
      border,
      children,
      cssGap,
      direction = 'column',
      elevation, // munged to avoid styled-components putting it in the DOM
      fill, // munged to avoid styled-components putting it in the DOM
      gap,
      kind, // munged to avoid styled-components putting it in the DOM
      onBlur,
      onClick,
      onFocus,
      overflow, // munged to avoid styled-components putting it in the DOM
      responsive: responsiveProp = true,
      tag,
      as,
      wrap, // munged to avoid styled-components putting it in the DOM,
      width, // munged to avoid styled-components putting it in the DOM
      height, // munged to avoid styled-components putting it in the DOM
      tabIndex,
      skeleton: skeletonProp,
      ...rest
    },
    ref,
  ) => {
    const { theme, passThemeFlag } = useThemeValue();
    // boxOptions was created to preserve backwards compatibility but
    // should not be supported in v3
    const { box: boxOptions } = useContext(OptionsContext);

    const skeleton = useSkeleton();

    const responsiveContainer = useContext(ResponsiveContainerContext);
    const responsive =
      responsiveContainer && responsiveProp ? 'container' : responsiveProp;

    let background = backgroundProp;

    const announce = useContext(AnnounceContext);

    useEffect(() => {
      if (skeletonProp?.message?.start) announce(skeletonProp.message.start);
      else if (typeof skeletonProp?.message === 'string')
        announce(skeletonProp.message);
      return () =>
        skeletonProp?.message?.end && announce(skeletonProp.message.end);
    }, [announce, skeletonProp]);

    const focusable = useMemo(
      () => onClick && !(tabIndex < 0),
      [onClick, tabIndex],
    );

    const [focus, setFocus] = useState();

    const clickProps = useMemo(() => {
      if (focusable) {
        return {
          onClick,
          onFocus: (event) => {
            setFocus(true);
            if (onFocus) onFocus(event);
          },
          onBlur: (event) => {
            setFocus(false);
            if (onBlur) onBlur(event);
          },
        };
      }
      const result = {};
      if (onBlur) result.onBlur = onBlur;
      if (onClick) result.onClick = onClick;
      if (onFocus) result.onFocus = onFocus;
      return result;
    }, [focusable, onClick, onFocus, onBlur]);

    const adjustedTabIndex = useMemo(() => {
      if (tabIndex !== undefined) return tabIndex;
      if (focusable) return 0;
      return undefined;
    }, [focusable, tabIndex]);

    if (
      (border === 'between' ||
        (border && border.side === 'between') ||
        (Array.isArray(border) && border.find((b) => b.side === 'between'))) &&
      !gap
    ) {
      console.warn('Box must have a gap to use border between');
    }

    let contents = children;
    if (
      gap &&
      gap !== 'none' &&
      (!(boxOptions?.cssGap || cssGap || typeof gap === 'object') ||
        // need this approach to show border between
        border === 'between' ||
        border?.side === 'between' ||
        (Array.isArray(border) && border.find((b) => b.side === 'between')))
    ) {
      // if border is an array, we need to extract the border between object
      const styledBoxGapBorder = Array.isArray(border)
        ? border.find((b) => b.side === 'between')
        : border;
      const boxAs = !as && tag ? tag : as;
      contents = [];
      let firstIndex;
      Children.forEach(children, (child, index) => {
        if (child) {
          if (firstIndex === undefined) {
            firstIndex = index;
          } else {
            contents.push(
              <StyledBoxGap
                // eslint-disable-next-line react/no-array-index-key
                key={`gap-${index}`}
                as={boxAs === 'span' ? boxAs : 'div'}
                gap={gap}
                directionProp={direction}
                responsive={responsive}
                border={styledBoxGapBorder}
                {...passThemeFlag}
              />,
            );
          }
        }
        contents.push(child);
      });
    }

    const nextSkeleton = useMemo(() => {
      // Decide if we need to add a new SkeletonContext. We need one if:
      //   1. skeleton info was set in a property OR
      //   2. there already is a SkeletonContext but this box has a
      //      background or border. This means the box probably is more
      //      distinguishable from the area around it.
      // We keep track of a depth so we know how to alternate backgrounds.
      if (skeletonProp || ((background || border) && skeleton)) {
        const depth = skeleton ? skeleton.depth + 1 : 0;
        return {
          ...skeleton,
          depth,
          ...(typeof skeletonProp === 'object' ? skeletonProp : {}),
        };
      }
      return undefined;
    }, [background, border, skeleton, skeletonProp]);

    let skeletonProps = {};
    if (nextSkeleton) {
      const {
        colors: skeletonThemeColors,
        size: skeletonThemeSize,
        ...skeletonThemeProps
      } = theme.skeleton;
      const skeletonColors = nextSkeleton.colors
        ? nextSkeleton.colors[theme.dark ? 'dark' : 'light']
        : skeletonThemeColors?.[theme.dark ? 'dark' : 'light'];
      skeletonProps = { ...skeletonThemeProps };
      background = skeletonColors[nextSkeleton.depth % skeletonColors.length];
      if (skeletonProp?.animation) {
        skeletonProps.animation = skeletonProp.animation;
      }
      contents = (
        <SkeletonContext.Provider value={nextSkeleton}>
          {contents}
        </SkeletonContext.Provider>
      );
    }

    // construct a new theme object in case we have a background that wants
    // to change the background color context
    const nextTheme = useMemo(() => {
      let result;
      if (background || theme.darkChanged) {
        const dark = backgroundIsDark(background, theme);
        const darkChanged = dark !== undefined && dark !== theme.dark;
        if (darkChanged || theme.darkChanged) {
          result = { ...theme };
          result.dark = dark === undefined ? theme.dark : dark;
          result.background = background;
        } else if (background) {
          // This allows DataTable to intelligently set the background
          // of a pinned header or footer.
          result = { ...theme };
          result.background = background;
        }
      }
      return result || theme;
    }, [background, theme]);

    let content = (
      <StyledBox
        as={!as && tag ? tag : as}
        aria-label={a11yTitle}
        background={background}
        border={border}
        ref={ref}
        directionProp={direction}
        elevationProp={elevation}
        fillProp={fill}
        focus={focus}
        gap={
          (boxOptions?.cssGap || cssGap || typeof gap === 'object') &&
          gap &&
          gap !== 'none' &&
          border !== 'between' &&
          border?.side !== 'between' &&
          (!Array.isArray(border) ||
            !border.find((b) => b.side === 'between')) &&
          gap
        }
        kindProp={kind}
        overflowProp={overflow}
        wrapProp={wrap}
        widthProp={width}
        heightProp={height}
        responsive={responsive}
        tabIndex={adjustedTabIndex}
        {...clickProps}
        {...passThemeFlag}
        {...rest}
        {...skeletonProps}
      >
        <ThemeContext.Provider value={nextTheme}>
          {contents}
        </ThemeContext.Provider>
      </StyledBox>
    );

    if (onClick) {
      content = <Keyboard onEnter={onClick}>{content}</Keyboard>;
    }

    return content;
  },
);

Box.displayName = 'Box';
Box.propTypes = BoxPropTypes;
export { Box };
