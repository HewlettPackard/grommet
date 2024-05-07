import styled, { css } from 'styled-components';

import { genericStyles } from '../../utils';
import { ehnancePropsWithDefault } from '../../default-props';

const roundStyle = css`
  border-radius: ${(props) => props.theme.global.edgeSize[props.round.size]};
`;

// overflow: hidden is needed for ie11
const StyledMeter = styled.svg.attrs(ehnancePropsWithDefault)`
  max-width: 100%;
  overflow: hidden;

  ${(props) =>
    props.reverse &&
    css`
      transform: scale(-1, 1);
    `}

  ${genericStyles} ${(props) => props.round && roundStyle}

  path {
    transition: stroke 0.3s, stroke-width 0.3s;
  }

  ${(props) => props.theme.meter && props.theme.meter.extend};
`;

export { StyledMeter };
