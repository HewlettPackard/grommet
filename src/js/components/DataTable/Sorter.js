import React from 'react';
import styled from 'styled-components';

import { Button } from '../Button';
import { Box } from '../Box';

const SorterButton = styled(Button)`
  flex-shrink: 1;
  height: 100%;
`;

export const Sorter = ({
  align, children, fill, onSort, property, sort, theme, themeProps,
}) => {
  let icon;
  if (sort && sort.property === property) {
    const Icon = theme.dataTable.icons[sort.ascending ? 'ascending' : 'descending'];
    icon = <Icon />;
  }
  let content = (
    <Box
      flex='shrink'
      direction='row'
      justify={align}
      align='center'
      gap='xsmall'
      fill={fill}
      {...themeProps}
    >
      {children}
      {icon}
    </Box>
  );
  if (onSort) {
    content = (
      <SorterButton
        fill={fill}
        hoverIndicator
        onClick={onSort(property)}
      >
        {content}
      </SorterButton>
    );
  }

  return content;
};
