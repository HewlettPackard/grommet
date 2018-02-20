import styled, { css, keyframes } from 'styled-components';

import { baseStyle, edgeStyle, lapAndUp, palm, parseMetricToNum } from '../../utils';

const growBoxKeyframe = keyframes`
  0% {
    transform: translate(50%, 50%) scale(0.8);
  }
  100% {
    transform: translate(50%, 50%) scale(1);
  }
`;

const slideUpKeyframe = keyframes`
  0% {
    margin-bottom: -200px;
  }
  100% {
    margin-bottom: 0px;
  }
`;

const slideLeftKeyframe = keyframes`
  0% {
    left: -100%;
  }
  100% {
    left: 0px;
  }
`;

const slideRightKeyframe = keyframes`
  0% {
    right: -200px;
  }
  100% {
    right: 0px;
  }
`;

const slideDownKeyframe = keyframes`
  0% {
    top: -100vh;
  }
  100% {
    top: 0px;
  }
`;

const hiddenPositionStyle = css`
  left: -100%;
  right: 100%;
  z-index: -1;
  position: fixed;
`;

const StyledLayer = styled.div`
  ${baseStyle}

  position: relative;
  z-index: 10;
  height: 100vh;
  overflow: auto;

  background-color: ${props => (props.plain ? 'transparent' : props.theme.layer.overlayBackgroundColor)};

  ${props => (props.position === 'hidden' ? hiddenPositionStyle : lapAndUp(`
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
  `))}
`;

const leftPositionStyle = `
  top: 0px;
  bottom: 0px;
  left: 0px;

  animation: ${slideLeftKeyframe} 0.2s ease-in-out forwards;
`;

const rightPositionStyle = `
  top: 0px;
  bottom: 0px;
  right: 0px;

  animation: ${slideRightKeyframe} 0.2s ease-in-out forwards;
`;

const topPositionStyle = `
  left: 50%;
  transform: translateX(-50%);
  animation: ${slideDownKeyframe} 0.2s ease-in-out forwards;
`;

const bottomPositionStyle = `
  bottom: 0px;
  right: 50%;
  transform: translateX(50%);
  animation: ${slideUpKeyframe} 0.2s ease-in-out forwards;
`;

const centerPositionStyle = `
  bottom: 50%;
  right: 50%;
  animation: ${growBoxKeyframe} 0.1s forwards;
`;

function getPositionStyle(props) {
  const POSITION_MAP = {
    'bottom': bottomPositionStyle,
    'center': centerPositionStyle,
    'left': leftPositionStyle,
    'right': rightPositionStyle,
    'top': topPositionStyle,
  };
  return POSITION_MAP[props.position] || '';
}

const getMarginValues = (margin, theme) => {
  if (typeof margin === 'string') {
    return {
      vertical: `${parseMetricToNum(theme.global.edgeSize[margin]) * 2}px`,
      horizontal: `${parseMetricToNum(theme.global.edgeSize[margin]) * 2}px`,
    };
  }
  const result = {
    vertical: '0px',
    horizontal: '0px',
  };
  if (margin) {
    if (margin.horizontal) {
      result.horizontal = `${parseMetricToNum(theme.global.edgeSize[margin.horizontal]) * 2}px`;
    }
    if (margin.vertical) {
      result.vertical = `${parseMetricToNum(theme.global.edgeSize[margin.vertical]) * 2}px`;
    }
    if (margin.top) {
      result.vertical = `${parseMetricToNum(theme.global.edgeSize[margin.top])}px`;
    }
    if (margin.bottom) {
      result.vertical = `${parseMetricToNum(theme.global.edgeSize[margin.bottom])}px`;
    }
    if (margin.left) {
      result.horizontal = `${parseMetricToNum(theme.global.edgeSize[margin.left])}px`;
    }
    if (margin.right) {
      result.horizontal = `${parseMetricToNum(theme.global.edgeSize[margin.right])}px`;
    }
  }
  return result;
};

const fullStyle = (full, margin, theme) => {
  const marginValues = getMarginValues(margin, theme);
  return `
    ${full === true || full === 'vertical' ? `height: calc(100vh - ${marginValues.vertical});` : ''}
    ${full === true || full === 'horizontal' ? `width: calc(100vw - ${marginValues.horizontal});` : ''}
  `;
};

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: ${props => props.theme.global.size.xxsmall};
  outline: none;

  background-color: ${props => (props.plain ? 'transparent' : props.theme.layer.backgroundColor)};

  ${palm(`
    min-height: 100%;
    min-width: 100%;
  `)}

  ${props => lapAndUp(`
    position: absolute;
    max-height: 100%;
    max-width: 100%;
    overflow: auto;
    border-radius: ${props.plain ? 'none' : props.theme.layer.border.radius};

    ${!props.full ? getPositionStyle(props) : ''}
  `)}
  ${props => props.full && fullStyle(props.full, props.margin, props.theme)}
  ${props => props.margin && edgeStyle('margin', props.margin, props.theme)}
`;

export default StyledLayer.extend`
  ${props => props.theme.layer && props.theme.layer.extend}
`;
