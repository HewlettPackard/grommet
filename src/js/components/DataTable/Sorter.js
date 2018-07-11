import React from 'react';
import styled from 'styled-components';

import { Button } from '../Button';
import { Box } from '../Box';

const SorterButton = styled(Button)`
  flex-shrink: 1;
`;

const Sorter = ({ align, children, onSort, property, sort, theme }) => {
  let icon;
  if (sort && sort.property === property) {
    const Icon = theme.dataTable.icons[sort.ascending ? 'ascending' : 'descending'];
    icon = <Icon />;
  }
  let content = (
    <Box
      flex={true}
      direction='row'
      justify={align}
      align='center'
      gap='xsmall'
      fill='vertical'
      {...theme.dataTable.header}
      border={undefined}
      background={undefined}
    >
      {children}
      {icon}
    </Box>
  );
  if (onSort) {
    content = (
      <SorterButton
        fill={true}
        hoverIndicator={true}
        onClick={onSort(property)}
        style={{ flexShrink: 1 }}
      >
        {content}
      </SorterButton>
    );
  }

  return content;
};

export default Sorter;
