import styled, { css, keyframes } from 'styled-components';
import { Box } from '../Box';
import { widthStyle, heightStyle } from '../../utils';

const StyledCarouselContainer = styled(Box)`
  position: relative;
  ${(props) => props.heightProp && heightStyle(props.heightProp, props.theme)}
  ${(props) => props.widthProp && widthStyle(props.widthProp, props.theme)}
`;

const StyledCarouselChild = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  float: left;
  margin-right: -100%;
  display: ${(props) => props.displayProp};
  animation: ${(props) =>
    props.animation
      ? css`
          ${props.animation} 0.6s ease-in-out
        `
      : `none`};
`;

const StyledControl = styled(Box)`
  position: absolute;
  z-index: 1;
  ${(props) => `${props.offset}: 0;`}
  align-items: center';
  justify-content: center;
`;

// Slide Left = Previous or Backward
const slideRightPrevious = keyframes`
  0% {transform: translateX(0%)}
  100% {transform: translateX(100%)}
`;

const slideRightCurrent = keyframes`
  0% {transform: translateX(-100%)}
  100% {transform: translateX(0%)}
`;

// Slide Left = Next or Forward
const slideLeftPrevious = keyframes`
  0% {transform: translateX(0%)}
  100% {transform: translateX(-100%)}
`;

const slideLeftCurrent = keyframes`
  0% {transform: translateX(100%)}
  100% {transform: translateX(0%)}
  `;

export {
  StyledControl,
  StyledCarouselContainer,
  StyledCarouselChild,
  slideLeftCurrent,
  slideLeftPrevious,
  slideRightCurrent,
  slideRightPrevious,
};
