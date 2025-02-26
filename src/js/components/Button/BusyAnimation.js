import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Checkmark } from 'grommet-icons/icons/Checkmark';
import { Box } from '../Box';
import { styledComponentsConfig } from '../../utils/styles';

const bounceDelay = keyframes`
  0%, 80%, 100% { 
    transform: scale(0.4);
  } 40% { 
    transform: scale(0.8);
  }
`;

const bounceDelayRule = css`
  animation: ${bounceDelay} 1.4s infinite ease-in-out both;
`;

/* When button is small size we need half the dot size to fit properly */
const Dot = styled(Box)`
  background-color: currentColor;
  width: ${(props) => (props.size.size === 'small' ? '4px' : '8px')};
  height: ${(props) => (props.size.size === 'small' ? '4px' : '8px')};
  border-radius: 100%;
  display: inline-block;
  ${bounceDelayRule}
  ${(props) => props.delay && `animation-delay: ${props.delay};`}
`;

export const EllipsisAnimation = (size) => (
  <Box
    style={{ position: 'absolute' }}
    fill
    alignContent="center"
    justify="center"
  >
    <Box alignSelf="center" direction="row" gap="small">
      {/* A negative delay starts the animation sooner. The first dot
      should begin animating before the second and so on. */}
      <Dot size={size} delay="-0.32s" />
      <Dot size={size} delay="-0.16s" />
      <Dot size={size} />
    </Box>
  </Box>
);

const grow = keyframes`
  0% {
    opacity: 0;
    transform: scale(.3);
  }
  20% {
    opacity: 1;
    transform: scale(1.15);
  }
  30% { transform: scale(.9); }
  45% { transform: scale(1.05); }
  55% { transform: scale(1); }
  100% { transform: scale(1); }  
`;

export const GrowCheckmark = styled(Checkmark)`
  position: absolute;
  align-self: center;
  animation: ${grow} 0.9s ease-in-out;
`;

export const StyledBusyContents = styled.div.withConfig(styledComponentsConfig)`
  opacity: ${(props) => (props.animating ? 0 : 1)};}
`;
