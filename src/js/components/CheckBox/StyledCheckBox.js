import styled, { css } from 'styled-components';

import { focusStyle, normalizeColor } from '../../utils';

const disabledStyle = `
  opacity: 0.5;
  cursor: default;
`;

const hoverStyle = css`
  :hover input:not([disabled]) + div,
  :hover input:not([disabled]) + span {
    border-color: ${props =>
      normalizeColor(props.theme.checkBox.hover.border.color, props.theme)};
  }
`;

export const StyledCheckBoxIcon = styled.svg`
  box-sizing: border-box;
  position: absolute;
  stroke-width: ${props => props.theme.checkBox.check.thickness};
  stroke: ${props =>
    normalizeColor(props.theme.checkBox.color || 'control', props.theme)};
  width: ${props =>
    props.theme.checkBox.icon.size || props.theme.checkBox.size};
  height: ${props =>
    props.theme.checkBox.icon.size || props.theme.checkBox.size};
  ${props => props.theme.checkBox.icon.extend};
`;

export const StyledCheckBoxContainer = styled.label`
  user-select: none;
  ${props => props.disabled && disabledStyle}
  ${props => !props.disabled && 'cursor: pointer;'}
  ${props => props.theme.checkBox.hover.border.color && hoverStyle}
  ${props => props.theme.checkBox.extend}
`;

export const StyledCheckBoxInput = styled.input`
  position: absolute;
  opacity: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  z-index: 1;
  ${props => !props.disabled && 'cursor: pointer;'} :checked + span > span {
    left: calc(
      ${props => props.theme.checkBox.toggle.size} -
        ${props => props.theme.checkBox.size}
    );
    background: ${props =>
      normalizeColor(props.theme.checkBox.color || 'control', props.theme)};
  }
`;

export const StyledCheckBoxBox = styled.div`
  ${props => props.theme.checkBox.check.extend};
`;

export const StyledCheckBoxToggle = styled.span`
  box-sizing: border-box;
  position: relative;
  vertical-align: middle;
  display: inline-block;
  width: ${props => props.theme.checkBox.toggle.size};
  height: ${props => props.theme.checkBox.size};
  border: ${props => props.theme.checkBox.border.width} solid;
  border-color: ${props =>
    normalizeColor(props.theme.checkBox.border.color, props.theme)};
  border-radius: ${props => props.theme.checkBox.toggle.radius};
  background-color: ${props =>
    props.theme.checkBox.toggle.background
      ? normalizeColor(props.theme.checkBox.toggle.background, props.theme)
      : 'transparent'};

  ${props => props.focus && focusStyle};
  ${props => props.theme.checkBox.toggle.extend};
`;

export const StyledCheckBoxKnob = styled.span`
  box-sizing: border-box;
  position: absolute;
  top: -${props => props.theme.checkBox.border.width};
  left: -${props => props.theme.checkBox.border.width};
  transition: all 0.3s;
  width: ${props => props.theme.checkBox.size};
  height: ${props => props.theme.checkBox.size};
  background: ${props =>
    normalizeColor(
      props.theme.checkBox.toggle.color[props.theme.dark ? 'dark' : 'light'],
      props.theme,
    )};
  border-radius: ${props => props.theme.checkBox.toggle.radius};
  ${props => props.theme.checkBox.toggle.knob.extend};
`;

export const StyledCheckBox = styled.div`
  position: relative;
`;
