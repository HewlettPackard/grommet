import styled, { css } from 'styled-components';

import { genericStyles, normalizeColor } from '../../utils';
import { getDefaultProps } from '../../default-props';

const tabHoverStyle = css`
  &:hover {
    ${(props) =>
      props.theme.tab.hover.background &&
      css`
        background: ${normalizeColor(
          props.theme.tab.hover.background,
          props.theme,
        )};
      `}
    ${(props) =>
      props.theme.tab.hover.color &&
      css`
        color: ${normalizeColor(props.theme.tab.hover.color, props.theme)};
      `}
    ${(props) => props.theme.tab.hover.extend};
  }
  &:focus {
    z-index: 1;
  }
`;

const StyledTab = styled.div.attrs(getDefaultProps)`
  white-space: nowrap;
  ${genericStyles}
  ${(props) =>
    !props.plain && !props.disabled && props.theme.tab.hover && tabHoverStyle}
  ${(props) => props.disabled && props.theme.tab.disabled}
  ${(props) => props.theme.tab.extend}
`;

export { StyledTab };
