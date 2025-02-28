import styled from 'styled-components';

import {
  disabledStyle,
  getInputPadBySide,
  inputStyle,
  plainInputStyle,
  textAlignStyle,
  styledComponentsConfig,
} from '../../utils';
import { inputPadForIcon } from '../../utils/styles';

export const StyledMaskedInput = styled.input.withConfig(
  styledComponentsConfig,
)`
  ${inputStyle}
  ${(props) => props.plain && plainInputStyle}
  ${(props) => props.icon && inputPadForIcon}
  ${(props) =>
    props.disabled &&
    disabledStyle(
      props.theme.maskedInput.disabled &&
        props.theme.maskedInput.disabled.opacity,
    )}
  ${(props) => props.textAlign && textAlignStyle}
  ${(props) => props.theme.maskedInput && props.theme.maskedInput.extend};
`;

export const StyledMaskedInputContainer = styled.div.withConfig(
  styledComponentsConfig,
)`
  position: relative;
  width: 100%;

  ${(props) =>
    props.theme.maskedInput &&
    props.theme.maskedInput.container &&
    props.theme.maskedInput.container.extend};
`;

export const StyledIcon = styled.div.withConfig(styledComponentsConfig)`
  position: absolute;
  display: flex;
  justify: center;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: ${(props) => (props.maskIconClickable ? 'auto' : 'none')};
  ${(props) => (props.maskIconClickable ? 'cursor: pointer;' : '')};
  ${(props) =>
    props.reverse
      ? `right: ${getInputPadBySide(props, 'right')};`
      : `left: ${getInputPadBySide(props, 'left')};`}
`;
