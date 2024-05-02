import { css } from 'styled-components';

import { baseStyle } from '../../utils';
import { styledWithTheme } from '../styledWithTheme';


const fullStyle = (full) => {
  if (full === 'min')
    return css`
      min-height: 100vh;
    `;
  return css`
    width: 100vw;
    height: 100vh;
    overflow: auto;
  `;
};

const StyledGrommet = styledWithTheme.div`
  ${(props) => !props.plain && baseStyle}
  ${(props) => props.full && fullStyle(props.full)}
  ${(props) => props.theme.global.font.face}
  ${(props) => props.theme.grommet.extend}
  ${(props) =>
    props.cssVars &&
    Object.keys(props.theme.global.colors)
      .filter((k) => typeof props.theme.global.colors[k] === 'string')
      .map((k) => `--${k}: ${props.theme.global.colors[k]};`)
      .join('\n')}
`;

export { StyledGrommet };
