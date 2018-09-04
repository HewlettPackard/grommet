import { css } from 'styled-components';

import { normalizeColor } from './colors';
import { palm, parseMetricToNum } from './mixins';
import { backgroundStyle } from './background';

export const activeStyle = css`
  ${props => backgroundStyle(normalizeColor(props.theme.global.hover.background, props.theme), props.theme)}
  color: ${props => normalizeColor(props.theme.global.hover.color, props.theme)};
`;

export const baseStyle = css`
  font-family: ${props => props.theme.global.font.family};
  font-size: ${props => props.theme.global.font.size};
  line-height: ${props => props.theme.global.font.height};
  ${props => props.theme.global.colors.text &&
    `color: ${props.theme.global.colors.text};`}
  ${props => props.theme.global.colors.background &&
    `background: ${props.theme.global.colors.background};`}

  box-sizing: border-box;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
`;

export const controlBorderStyle = css`
  border: ${props =>
    props.theme.global.control.border.width} solid ${props =>
      (props.theme.global.control.border.color ||
        props.theme.global.control.border.color)[props.theme.dark ? 'dark' : 'light']};
  border-radius: ${props => props.theme.global.control.border.radius};
`;

export const edgeStyle = (kind, data, responsive, theme) => {
  if (typeof data === 'string') {
    return css`
      ${kind}: ${theme.global.edgeSize[data]};
      ${responsive ? palm(`
        ${kind}: ${theme.global.edgeSize.narrow[data]};
      `) : ''}
    `;
  }
  const result = [];
  if (data.horizontal) {
    result.push(css`
      ${kind}-left: ${theme.global.edgeSize[data.horizontal]};
      ${kind}-right: ${theme.global.edgeSize[data.horizontal]};
      ${responsive ? palm(`
        ${kind}-left: ${theme.global.edgeSize.narrow[data.horizontal]};
        ${kind}-right: ${theme.global.edgeSize.narrow[data.horizontal]};
      `) : ''}
    `);
  }
  if (data.vertical) {
    result.push(css`
      ${kind}-top: ${theme.global.edgeSize[data.vertical]};
      ${kind}-bottom: ${theme.global.edgeSize[data.vertical]};
      ${responsive ? palm(`
        ${kind}-top: ${theme.global.edgeSize.narrow[data.vertical]};
        ${kind}-bottom: ${theme.global.edgeSize.narrow[data.vertical]};
      `) : ''}
    `);
  }
  if (data.top) {
    result.push(css`
      ${kind}-top: ${theme.global.edgeSize[data.top]};
      ${responsive ? palm(`
        ${kind}-top: ${theme.global.edgeSize.narrow[data.top]};
      `) : ''}
    `);
  }
  if (data.bottom) {
    result.push(css`
      ${kind}-bottom: ${theme.global.edgeSize[data.bottom]};
      ${responsive ? palm(`
        ${kind}-bottom: ${theme.global.edgeSize.narrow[data.bottom]};
      `) : ''}
    `);
  }
  if (data.left) {
    result.push(css`
      ${kind}-left: ${theme.global.edgeSize[data.left]};
      ${responsive ? palm(`
        ${kind}-left: ${theme.global.edgeSize.narrow[data.left]};
      `) : ''}
    `);
  }
  if (data.right) {
    result.push(css`
      ${kind}-right: ${theme.global.edgeSize[data.right]};
      ${responsive ? palm(`
        ${kind}-right: ${theme.global.edgeSize.narrow[data.left]};
      `) : ''}
    `);
  }
  return result;
};

// focus also supports clickable elements inside svg
export const focusStyle = css`
  > circle,
  > ellipse,
  > line,
  > path,
  > polygon,
  > polyline,
  > rect {
    outline: ${
      props => props.theme.global.focus.border.color
    } solid 2px;
  }
  border-color: ${
    props => props.theme.global.focus.border.color
  };
  box-shadow: 0 0 2px 2px ${
    props => props.theme.global.focus.border.color
  };
`;

export const inputStyle = css`
  box-sizing: border-box;
  font-size: inherit;
  border: none;
  -webkit-appearance: none;
  padding: ${props => (
    (parseMetricToNum(props.theme.global.spacing) / 2) -
    parseMetricToNum(props.theme.global.control.border.width)
  )}px;
  outline: none;
  background: transparent;
  color: inherit;
  ${props => props.theme.global.input.weight && css`
    font-weight: ${props.theme.global.input.weight};
  `}
  margin: 0;

  ${props => props.focus && (!props.plain || props.focusIndicator) && focusStyle}
  ${controlBorderStyle}

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }
`;

export const evalStyle = (arg, theme) => {
  if (arg && Array.isArray(arg) && typeof arg[0] === 'function') {
    return arg[0]({ theme });
  }
  return arg;
};
