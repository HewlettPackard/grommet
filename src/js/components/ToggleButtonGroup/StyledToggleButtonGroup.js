import styled from 'styled-components';
import { Button } from '../Button';
import { roundStyle, edgeStyle } from '../../utils';

export const StyledButton = styled(Button)`
  border-radius: ${(props) => props.theme.global.control.border.radius};
  ${(props) => roundStyle(props.round, true, props.theme)};
  ${(props) =>
    edgeStyle(
      'padding',
      props.theme.toggleButtonGroup.button.pad,
      false,
      undefined,
      props.theme,
    )}
  border: none;
`;
