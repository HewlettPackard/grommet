import styled, { css } from 'styled-components';

import { genericStyles } from '../../utils';
import { ehnancePropsWithDefault } from '../../default-props';

const StyledTabsHeader = styled.div.attrs(ehnancePropsWithDefault)`
  ${props => props.theme.tabs.header.extend};
`;

const FLEX_MAP = {
  [true]: '1 1',
  [false]: '0 0',
  grow: '1 0',
  shrink: '0 1',
};

const flexStyle = css`
  flex: ${props =>
    `${FLEX_MAP[props.flex]}${props.flex !== true ? ' auto' : ''}`};
`;

const StyledTabPanel = styled.div.attrs(ehnancePropsWithDefault)`
  min-height: 0;
  ${props => props.flex && flexStyle} ${props => props.theme.tabs.panel.extend};
`;

const StyledTabs = styled.div.attrs(ehnancePropsWithDefault)`
  ${genericStyles} ${props => props.theme.tabs.extend};
`;

export { StyledTabsHeader, StyledTabPanel, StyledTabs };
