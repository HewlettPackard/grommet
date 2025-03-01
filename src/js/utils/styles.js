import { css } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';
import { backgroundStyle } from './background';
import { normalizeColor } from './colors';
import { getBreakpointStyle } from './responsive';
import { breakpointStyle, parseMetricToNum } from './mixins';

// ensure only valid DOM attributes are forwarded onto DOM
export const styledComponentsConfig = {
  shouldForwardProp: isPropValid,
};

export const baseStyle = css`
  font-family: ${(props) => props.theme.global.font.family};
  font-size: ${(props) => props.theme.global.font.size};
  line-height: ${(props) => props.theme.global.font.height};
  font-weight: ${(props) => props.theme.global.font.weight};
  /* check if prop is defined in the theme*/
  ${(props) =>
    props.theme.global.font.variant &&
    `
    font-variant:${props.theme.global.font.variant};
  `}
  ${(props) =>
    !props.plain && backgroundStyle(props.theme.baseBackground, props.theme)}
  box-sizing: border-box;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
`;

export const controlBorderStyle = css`
  border: ${(props) => props.theme.global.control.border.width} solid
    ${(props) =>
      normalizeColor(
        props.theme.global.control.border.color || 'border',
        props.theme,
      )};
  border-radius: ${(props) => props.theme.global.control.border.radius};
`;

export const edgeStyle = (
  kind,
  data,
  responsive,
  responsiveBreakpoint,
  theme,
) => {
  const breakpoint =
    responsiveBreakpoint && theme.global.breakpoints[responsiveBreakpoint];

  if (typeof data === 'string') {
    return css`
      ${kind}: ${theme.global.edgeSize[data] || data};
      ${responsive && breakpoint
        ? breakpointStyle(
            breakpoint,
            `
        ${kind}: ${breakpoint.edgeSize[data] || data};
      `,
            responsive,
          )
        : ''};
    `;
  }
  const result = [];

  const { horizontal, vertical, top, bottom, left, right } = data;

  // if horizontal and vertical are equal OR all sides are equal,
  // we can just return a single css value such as padding: 12px
  // instead of breaking out by sides.
  const horizontalVerticalEqual =
    horizontal && vertical && horizontal === vertical;
  const allSidesEqual =
    top && bottom && left && right && ((top === bottom) === left) === right;

  if (horizontalVerticalEqual || allSidesEqual) {
    // since the values will be the same between vertical & horizontal OR
    // left, right, top, & bottom, we can just choose one
    const value = horizontalVerticalEqual ? horizontal : top;
    return css`
      ${kind}: ${theme.global.edgeSize[value] || value};
      ${responsive && breakpoint
        ? breakpointStyle(
            breakpoint,
            `
        ${kind}: ${breakpoint.edgeSize[value] || value};
      `,
            responsive,
          )
        : ''};
    `;
  }

  if (horizontal) {
    result.push(css`
      ${kind}-left: ${theme.global.edgeSize[horizontal] || horizontal};
      ${kind}-right: ${theme.global.edgeSize[horizontal] || horizontal};
      ${responsive && breakpoint
        ? breakpointStyle(
            breakpoint,
            `
          ${kind}-left: ${breakpoint.edgeSize[horizontal] || horizontal};
          ${kind}-right: ${breakpoint.edgeSize[horizontal] || horizontal};
        `,
            responsive,
          )
        : ''};
    `);
  }
  if (vertical) {
    result.push(css`
      ${kind}-top: ${theme.global.edgeSize[vertical] || vertical};
      ${kind}-bottom: ${theme.global.edgeSize[vertical] || vertical};
      ${responsive && breakpoint
        ? breakpointStyle(
            breakpoint,
            `
          ${kind}-top: ${breakpoint.edgeSize[vertical] || vertical};
          ${kind}-bottom: ${breakpoint.edgeSize[vertical] || vertical};
        `,
            responsive,
          )
        : ''};
    `);
  }
  if (top) {
    result.push(css`
      ${kind}-top: ${theme.global.edgeSize[top] || top};
      ${responsive && breakpoint
        ? breakpointStyle(
            breakpoint,
            `
          ${kind}-top: ${breakpoint.edgeSize[top] || top};
        `,
            responsive,
          )
        : ''};
    `);
  }
  if (bottom) {
    result.push(css`
      ${kind}-bottom: ${theme.global.edgeSize[bottom] || bottom};
      ${responsive && breakpoint
        ? breakpointStyle(
            breakpoint,
            `
          ${kind}-bottom: ${breakpoint.edgeSize[bottom] || bottom};
        `,
            responsive,
          )
        : ''};
    `);
  }
  if (left) {
    result.push(css`
      ${kind}-left: ${theme.global.edgeSize[left] || left};
      ${responsive && breakpoint
        ? breakpointStyle(
            breakpoint,
            `
          ${kind}-left: ${breakpoint.edgeSize[left] || left};
        `,
            responsive,
          )
        : ''};
    `);
  }
  if (right) {
    result.push(css`
      ${kind}-right: ${theme.global.edgeSize[right] || right};
      ${responsive && breakpoint
        ? breakpointStyle(
            breakpoint,
            `
          ${kind}-right: ${breakpoint.edgeSize[right] || right};
        `,
            responsive,
          )
        : ''};
    `);
  }
  if (data.start) {
    result.push(css`
      ${kind}-inline-start: ${theme.global.edgeSize[data.start] || data.start};
      ${responsive && breakpoint
        ? breakpointStyle(
            breakpoint,
            `
          ${kind}-inline-start: ${
              breakpoint.edgeSize[data.start] || data.start
            };
        `,
            responsive,
          )
        : ''};
    `);
  }
  if (data.end) {
    result.push(css`
      ${kind}-inline-end: ${theme.global.edgeSize[data.end] || data.end};
      ${responsive && breakpoint
        ? breakpointStyle(
            breakpoint,
            `
          ${kind}-inline-end: ${breakpoint.edgeSize[data.end] || data.end};
        `,
            responsive,
          )
        : ''};
    `);
  }

  return result;
};

export const fillStyle = (fillProp) => {
  if (fillProp === 'horizontal') {
    return 'width: 100%;';
  }
  if (fillProp === 'vertical') {
    return 'height: 100%;';
  }
  if (fillProp) {
    return `
      width: 100%;
      height: 100%;
    `;
  }
  return undefined;
};

const focusStyles = (props, { forceOutline, justBorder } = {}) => {
  const {
    theme: {
      global: { focus },
    },
  } = props;
  let compoundFocusStyle = '';
  if (!focus || (forceOutline && !focus.outline)) {
    const color = normalizeColor('focus', props.theme);
    if (color) return `outline: 2px solid ${color};`;
    return ''; // native
  }
  if (focus.outline && (!focus.border || !justBorder)) {
    if (typeof focus.outline === 'object') {
      const color = normalizeColor(focus.outline.color || 'focus', props.theme);
      const size = focus.outline.size || '2px';
      const offset = focus.outline.offset || '0px';
      const outlineStyle = `
        outline-offset: ${offset};
        outline: ${size} solid ${color};
      `;
      compoundFocusStyle += outlineStyle;
      if (!focus.twoColor) return outlineStyle;
    } else {
      const outlineStyle = `outline: ${focus.outline};`;
      compoundFocusStyle += outlineStyle;
      if (!focus.twoColor) return outlineStyle;
    }
  }
  if (focus.shadow && (!focus.border || !justBorder)) {
    if (typeof focus.shadow === 'object') {
      const color = normalizeColor(
        // If there is a focus.border.color, use that for shadow too.
        // This is for backwards compatibility in v2.
        (focus.border && focus.border.color) || focus.shadow.color || 'focus',
        props.theme,
      );
      const size = focus.shadow.size || '2px'; // backwards compatible default
      const blur = focus.shadow.blur || size; // backwards compatible default
      const inset = focus.shadow.inset ? 'inset ' : '';
      const shadowStyle = `box-shadow: 0 0 ${blur} ${size} ${color}${
        inset ? ` ${inset}` : ''
      };`;
      compoundFocusStyle += shadowStyle;
      if (!focus.twoColor)
        return `
        outline: none;
      ${shadowStyle}`;
    } else {
      const shadowStyle = `box-shadow: ${focus.shadow};`;
      compoundFocusStyle += shadowStyle;
      if (!focus.twoColor) return `outline: none; ${shadowStyle}`;
    }
  }
  if (focus.border) {
    const color = normalizeColor(focus.border.color || 'focus', props.theme);
    const borderStyle = `border-color: ${color};`;
    compoundFocusStyle += borderStyle;
    if (!focus.twoColor) return `outline: none; ${borderStyle}`;
  }
  if (focus.twoColor && compoundFocusStyle.length) return compoundFocusStyle;
  return ''; // defensive
};

const unfocusStyles = (props, { forceOutline, justBorder } = {}) => {
  const {
    theme: {
      global: { focus },
    },
  } = props;
  let compoundFocusStyle = '';
  if (!focus || (forceOutline && !focus.outline)) {
    const color = normalizeColor('focus', props.theme);
    if (color) return `outline: none;`;
    return ''; // native
  }
  if (focus.outline && (!focus.border || !justBorder)) {
    if (typeof focus.outline === 'object') {
      const outlineStyle = `
        outline-offset: 0px;
        outline: none;
      `;
      compoundFocusStyle += outlineStyle;
      if (!focus.twoColor)
        return `
        outline-offset: 0px;
        outline: none;
      `;
    } else {
      const outlineStyle = `outline: none;`;
      compoundFocusStyle += outlineStyle;
      if (!focus.twoColor) return outlineStyle;
    }
  }
  if (focus.shadow && (!focus.border || !justBorder)) {
    if (typeof focus.shadow === 'object') {
      const shadowStyle = `
        outline: none;
        box-shadow: none;
      `;
      compoundFocusStyle += shadowStyle;
      if (!focus.twoColor) return shadowStyle;
    } else {
      const shadowStyle = `
        outline: none;
        box-shadow: none;
      `;
      compoundFocusStyle += shadowStyle;
      if (!focus.twoColor) return shadowStyle;
    }
  }
  if (focus.border) {
    const borderStyle = `
      outline: none;
      border-color: none;
    `;
    compoundFocusStyle += borderStyle;
    if (!focus.twoColor) return borderStyle;
  }
  if (focus.twoColor && compoundFocusStyle.length) return compoundFocusStyle;
  return ''; // defensive
};

// focus also supports clickable elements inside svg
export const focusStyle = ({
  forceOutline,
  justBorder,
  skipSvgChildren,
} = {}) => css`
  ${(props) =>
    !skipSvgChildren &&
    `
  > circle,
  > ellipse,
  > line,
  > path,
  > polygon,
  > polyline,
  > rect {
    ${focusStyles(props)}
  }`}
  ${(props) => focusStyles(props, { forceOutline, justBorder })}
  ${!forceOutline &&
  `
  ::-moz-focus-inner {
    border: 0;
  }
  `}
`;

// This is placed next to focusStyle for easy maintainability
// of code since changes to focusStyle should be reflected in
// unfocusStyle as well.
// this function can be used to reset focus styles which is
// applicable when turning the focus ring off when using the mouse
// see https://nelo.is/writing/styling-better-focus-states/
export const unfocusStyle = ({
  forceOutline,
  justBorder,
  skipSvgChildren,
} = {}) => css`
  ${(props) =>
    !skipSvgChildren &&
    `
  > circle,
  > ellipse,
  > line,
  > path,
  > polygon,
  > polyline,
  > rect {
    ${unfocusStyles(props)}
  }`}
  ${(props) => unfocusStyles(props, { forceOutline, justBorder })}
  ${!forceOutline &&
  `
  ::-moz-focus-inner {
    border: 0;
  }
  `}
`;

// For backwards compatibility we need to add back the control border width.
// Based on how grommet was functioning prior to https://github.com/grommet/grommet/pull/3939,
// the padding was subtracting the border width from the theme value, but the
// placeholder was not. Because we're now placing the subtraction into the
// theme itself, we have to add back in the border width here.
// This is used for placeholder/icon in TextInput and MaskedInput.
const adjustPad = (props, value) =>
  `${
    parseMetricToNum(`${props.theme.global.edgeSize[value] || value}px`) +
    parseMetricToNum(`${props.theme.global.control.border.width}px`)
  }px`;

export const getInputPadBySide = (props, side) => {
  if (typeof props.theme.global.input.padding !== 'object') {
    const adjustedPad = adjustPad(props, props.theme.global.input.padding);
    return adjustedPad;
  }

  let orientation;
  if (side === 'left' || side === 'right') orientation = 'horizontal';
  else if (side === 'top' || side === 'bottom') orientation = 'vertical';
  else orientation = undefined;

  // if individual side isn't available, fallback to the
  // orientation if possible
  const pad =
    props.theme.global.input.padding[side] ||
    props.theme.global.input.padding[orientation];

  const adjustedPad = adjustPad(props, pad);

  return adjustedPad;
};

const placeholderColor = css`
  color: ${(props) =>
    normalizeColor(props.theme.global.colors.placeholder, props.theme)};
`;

const placeholderStyle = css`
  &::-webkit-input-placeholder {
    ${placeholderColor};
  }

  &::-moz-placeholder {
    ${placeholderColor};
  }

  &:-ms-input-placeholder {
    ${placeholderColor};
  }
`;

const inputSizeStyle = (props) => {
  const data = props.theme.text[props.size];

  if (!data) {
    return css`
      font-size: ${props.size};
    `;
  }

  return css`
    font-size: ${data.size};
    line-height: ${data.height};
  `;
};

export const inputStyle = css`
  box-sizing: border-box;
  ${(props) =>
    `font-size: ${
      props.theme.global.input.font.size
        ? props.theme.text[props.theme.global.input.font.size]?.size ||
          props.theme.global.input.font.size
        : 'inherit'
    };`}
  font-family: inherit;
  border: none;
  -webkit-appearance: none;
  background: transparent;
  color: inherit;
  width: 100%;
  ${(props) =>
    props.theme.global.input.font.height &&
    `line-height: ${props.theme.global.input.font.height};`}
  ${(props) =>
    props.theme.global.input.padding &&
    typeof props.theme.global.input.padding !== 'object'
      ? // On a breaking change release, this condition could be removed and
        // just the edgeStyle could remain. Currently, this is needed for
        // backwards compatibility since we are placing the calculation in
        // base.js
        `padding: ${
          parseMetricToNum(
            props.theme.global.edgeSize[props.theme.global.input.padding] ||
              props.theme.global.input.padding,
          ) - parseMetricToNum(props.theme.global.control.border.width)
        }px;`
      : edgeStyle(
          'padding',
          props.theme.global.input.padding,
          props.responsive,
          props.theme.box.responsiveBreakpoint,
          props.theme,
        )}
  ${(props) =>
    // for backwards compatibility, check if props.theme.global.input.weight
    (props.theme.global.input.weight || props.theme.global.input.font.weight) &&
    css`
      font-weight: ${props.theme.global.input.weight ||
      props.theme.global.input.font.weight};
    `} margin: 0;
  ${(props) => props.size && inputSizeStyle(props)}
  &:focus {
    ${(props) => (!props.plain || props.focusIndicator) && focusStyle()};
  }
  ${controlBorderStyle}
  ${placeholderStyle}

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  &::-moz-focus-inner {
    border: none;
    outline: none;
  }

  &:-moz-placeholder, // FF 18-
  &::-moz-placeholder {
    // FF 19+
    opacity: 1;
  }

  ${(props) => props.theme.global.input.extend}
`;

// Apply padding on input to create space for icon.
// When theme.icon.matchSize is true, the space for the
// icon should equal the icon dimension + 12px (edgeSize.medium)
// to ensure there is reasonable space between the icon and value or placeholder
export const inputPadForIcon = css`
  ${(props) => {
    const pad = props.theme?.icon?.matchSize
      ? `${
          parseMetricToNum(props.theme.icon?.size?.[props?.size || 'medium']) +
          parseMetricToNum(props.theme.global.edgeSize.medium)
        }px`
      : props.theme.global.edgeSize.large;

    return props.reverse ? `padding-right: ${pad};` : `padding-left: ${pad};`;
  }}
`;

export const overflowStyle = (overflowProp) => {
  if (typeof overflowProp === 'string') {
    return css`
      overflow: ${overflowProp};
    `;
  }

  return css`
    ${overflowProp.horizontal &&
    `overflow-x: ${overflowProp.horizontal};`} ${overflowProp.vertical &&
    `overflow-y: ${overflowProp.vertical};`};
  `;
};

const ALIGN_SELF_MAP = {
  center: 'center',
  end: 'flex-end',
  start: 'flex-start',
  stretch: 'stretch',
  baseline: 'baseline',
};

export const genericStyles = css`
  ${(props) =>
    props.alignSelf && `align-self: ${ALIGN_SELF_MAP[props.alignSelf]};`}
  ${(props) => props.gridArea && `grid-area: ${props.gridArea};`}
  ${(props) =>
    props.margin &&
    props.theme.global &&
    edgeStyle(
      'margin',
      props.margin,
      props.responsive,
      props.theme.global.edgeSize.responsiveBreakpoint,
      props.theme,
    )}
`;

export const disabledStyle = (componentStyle) => css`
  opacity: ${(props) =>
    componentStyle || props.theme.global.control.disabled.opacity};
  cursor: default;
`;

export const sizeStyle = (name, value, theme) => css`
  ${name}: ${theme.global.size[value] || value};
`;

export const plainInputStyle = css`
  outline: none;
  border: none;
`;

export const elevationStyle = (elevation) => css`
  box-shadow: ${(props) =>
    props.theme.global.elevation[props.theme.dark ? 'dark' : 'light'][
      elevation
    ]};
`;

// CSS for this sub-object in the theme
export const kindPartStyles = (obj, theme, colorValue) => {
  const styles = [];
  if (obj.padding || obj.pad) {
    // button uses `padding` but other components use Grommet `pad`
    const pad = obj.padding || obj.pad;
    if (pad.vertical || pad.horizontal)
      styles.push(
        `padding: ${theme.global.edgeSize[pad.vertical] || pad.vertical || 0} ${
          theme.global.edgeSize[pad.horizontal] || pad.horizontal || 0
        };`,
      );
    else styles.push(`padding: ${theme.global.edgeSize[pad] || pad || 0};`);
  }
  if (obj.background)
    styles.push(
      backgroundStyle(
        colorValue || obj.background,
        theme,
        obj.color ||
          (Object.prototype.hasOwnProperty.call(obj, 'color') &&
          obj.color === undefined
            ? false
            : undefined),
      ),
    );
  else if (obj.color)
    styles.push(`color: ${normalizeColor(obj.color, theme)};`);
  if (obj.border) {
    if (obj.border.width)
      styles.push(css`
        border-style: solid;
        border-width: ${obj.border.width};
      `);
    if (obj.border.color)
      styles.push(css`
        border-color: ${normalizeColor(
          (!obj.background && colorValue) || obj.border.color || 'border',
          theme,
        )};
      `);
    if (obj.border.radius)
      styles.push(css`
        border-radius: ${obj.border.radius};
      `);
  } else if (obj.border === false) styles.push('border: none;');
  if (colorValue && !obj.border && !obj.background)
    styles.push(`color: ${normalizeColor(colorValue, theme)};`);
  if (obj.font) {
    if (obj.font.size) {
      styles.push(
        `font-size: ${theme.text[obj.font.size].size || obj.font.size};`,
      );
    }
    if (obj.font.height) {
      styles.push(`line-height: ${obj.font.height};`);
    }
    if (obj.font.weight) {
      styles.push(`font-weight: ${obj.font.weight};`);
    }
  }
  if (obj.opacity) {
    const opacity =
      obj.opacity === true
        ? theme.global.opacity.medium
        : theme.global.opacity[obj.opacity] || obj.opacity;
    styles.push(`opacity: ${opacity};`);
  }
  if (obj.elevation) {
    styles.push(elevationStyle(obj.elevation));
  }
  if (obj.extend) styles.push(obj.extend);
  return styles;
};

const ROUND_MAP = {
  full: '100%',
};

export const roundStyle = (data, responsive, theme) => {
  const breakpoint = getBreakpointStyle(theme, theme.box.responsiveBreakpoint);
  // fallback to edgeSize for backwards compatibility
  const radius = theme.global.radius ? 'radius' : 'edgeSize';

  const styles = [];
  if (typeof data === 'object') {
    const size =
      ROUND_MAP[data.size] ||
      theme.global[radius][data.size || 'medium'] ||
      data.size;
    const responsiveSize =
      responsive &&
      breakpoint &&
      breakpoint[radius]?.[data.size] &&
      (breakpoint[radius][data.size] || data.size);
    if (data.corner === 'top') {
      styles.push(css`
        border-top-left-radius: ${size};
        border-top-right-radius: ${size};
      `);
      if (responsiveSize) {
        styles.push(
          breakpointStyle(
            breakpoint,
            `
          border-top-left-radius: ${responsiveSize};
          border-top-right-radius: ${responsiveSize};
        `,
            responsive,
          ),
        );
      }
    } else if (data.corner === 'bottom') {
      styles.push(css`
        border-bottom-left-radius: ${size};
        border-bottom-right-radius: ${size};
      `);
      if (responsiveSize) {
        styles.push(
          breakpointStyle(
            breakpoint,
            `
          border-bottom-left-radius: ${responsiveSize};
          border-bottom-right-radius: ${responsiveSize};
        `,
            responsive,
          ),
        );
      }
    } else if (data.corner === 'left') {
      styles.push(css`
        border-top-left-radius: ${size};
        border-bottom-left-radius: ${size};
      `);
      if (responsiveSize) {
        styles.push(
          breakpointStyle(
            breakpoint,
            `
          border-top-left-radius: ${responsiveSize};
          border-bottom-left-radius: ${responsiveSize};
        `,
            responsive,
          ),
        );
      }
    } else if (data.corner === 'right') {
      styles.push(css`
        border-top-right-radius: ${size};
        border-bottom-right-radius: ${size};
      `);
      if (responsiveSize) {
        styles.push(
          breakpointStyle(
            breakpoint,
            `
          border-top-right-radius: ${responsiveSize};
          border-bottom-right-radius: ${responsiveSize};
        `,
            responsive,
          ),
        );
      }
    } else if (data.corner) {
      styles.push(css`
        border-${data.corner}-radius: ${size};
      `);
      if (responsiveSize) {
        styles.push(
          breakpointStyle(
            breakpoint,
            `
          border-${data.corner}-radius: ${responsiveSize};
        `,
            responsive,
          ),
        );
      }
    } else {
      styles.push(css`
        border-radius: ${size};
      `);
      if (responsiveSize) {
        styles.push(
          breakpointStyle(
            breakpoint,
            `
          border-radius: ${responsiveSize};
        `,
            responsive,
          ),
        );
      }
    }
  } else {
    const size = data === true ? 'medium' : data;
    styles.push(css`
      border-radius: ${ROUND_MAP[size] || theme.global[radius]?.[size] || size};
    `);
    const responsiveSize =
      responsive && breakpoint && breakpoint[radius]?.[size];
    if (responsiveSize) {
      styles.push(
        breakpointStyle(
          breakpoint,
          `
        border-radius: ${responsiveSize};
      `,
          responsive,
        ),
      );
    }
  }
  return styles;
};

const TEXT_ALIGN_MAP = {
  center: 'center',
  end: 'right',
  justify: 'justify',
  start: 'left',
};

export const textAlignStyle = css`
  text-align: ${(props) => TEXT_ALIGN_MAP[props.textAlign]};
`;

const ALIGN_ITEMS_MAP = {
  baseline: 'baseline',
  center: 'center',
  end: 'flex-end',
  start: 'flex-start',
  stretch: 'stretch',
};

export const alignStyle = css`
  align-items: ${(props) => ALIGN_ITEMS_MAP[props.align] ?? props.align};
`;

const ALIGN_CONTENT_MAP = {
  around: 'space-around',
  baseline: 'baseline',
  between: 'space-between',
  center: 'center',
  evenly: 'space-evenly',
  end: 'flex-end',
  start: 'flex-start',
  stretch: 'stretch',
};

export const alignContentStyle = css`
  align-content: ${(props) =>
    ALIGN_CONTENT_MAP[props.alignContent] ?? props.alignContent};
`;
const getSize = (theme, size) => theme.global.size[size] || size;

const widthObjectStyle = (width, theme) => {
  const result = [];
  if (width.max)
    result.push(
      css`
        max-width: ${getSize(theme, width.max)};
      `,
    );
  if (width.min)
    result.push(
      css`
        min-width: ${getSize(theme, width.min)};
      `,
    );
  if (width.width)
    result.push(
      css`
        width: ${getSize(theme, width.width)};
      `,
    );
  return result;
};

const widthStringStyle = (width, theme) =>
  css`
    width: ${getSize(theme, width)};
  `;

export const widthStyle = (width, theme) =>
  typeof width === 'object'
    ? widthObjectStyle(width, theme)
    : widthStringStyle(width, theme);

const heightObjectStyle = (height, theme) => {
  const result = [];
  if (height.max)
    result.push(
      css`
        max-height: ${getSize(theme, height.max)};
      `,
    );
  if (height.min)
    result.push(
      css`
        min-height: ${getSize(theme, height.min)};
      `,
    );
  // backwards compatibile
  if (height.width)
    result.push(
      css`
        height: ${getSize(theme, height.height)};
      `,
    );
  if (height.height)
    result.push(
      css`
        height: ${getSize(theme, height.height)};
      `,
    );
  return result;
};

const heightStringStyle = (height, theme) =>
  css`
    height: ${getSize(theme, height)};
  `;

export const heightStyle = (height, theme) =>
  typeof height === 'object'
    ? heightObjectStyle(height, theme)
    : heightStringStyle(height, theme);
