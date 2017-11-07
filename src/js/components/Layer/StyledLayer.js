import styled, { css } from 'styled-components';

import { baseStyle, lapAndUp, palm } from '../../utils';

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

  animation: slide-left 0.2s ease-in-out forwards;
  
  @keyframes slide-left {
    0% {
      left: -100%;
    }

    100% {
      left: 0px;
    }
  }
`;

const rightPositionStyle = `
  top: 0px;
  bottom: 0px;
  right: 0px;

  animation: slide-right 0.2s ease-in-out forwards;
  
  @keyframes slide-right {
    0% {
      right: -200px;
    }

    100% {
      right: 0px;
    }
  }
`;

const topPositionStyle = `
  left: 50%;
  transform: translateX(-50%);

  animation: slide-down 0.2s ease-in-out forwards;
  
  @keyframes slide-down {
    0% {
      top: -100vh;
    }
  
    100% {
      top: 0px;
    }
  }
`;

const bottomPositionStyle = `
  bottom: 0px;
  right: 50%;
  transform: translateX(50%);

  animation: slide-up 0.2s ease-in-out forwards;
  
  @keyframes slide-up {
    0% {
      margin-bottom: -200px;
    }
  
    100% {
      margin-bottom: 0px;
    }
  }
`;

const centerPositionStyle = css`
  bottom: 50%;
  right: 50%;
  animation: grow-box 0.1s forwards;

  @keyframes grow-box {
    0% {
      transform: translate(50%, 50%) scale(0.8);
    }

    100% {
      transform: translate(50%, 50%) scale(1);
    }
  }
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

    ${getPositionStyle(props)}
  `)}
`;

export default StyledLayer.extend`
  ${props => props.theme.layer && props.theme.layer.extend}
`;
