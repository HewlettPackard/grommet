import React from 'react';

import { Box, Data, DataTable, Paragraph } from 'grommet';

import { DataSearch } from '../DataSearch';
import { columns, DATA } from '../../DataTable/stories/data';

export const Simple = () => (
  // Uncomment <Grommet> lines when using outside of storybook
  // <Grommet theme={...}>
  <Box fill flex="grow" pad="large" gap="large">
    <Data data={DATA} onChange>
      <DataSearch />
      <DataTable columns={columns} />
    </Data>
    <Paragraph color="text-weak">
      Note: Results are filtered as you type.
    </Paragraph>
  </Box>
  // </Grommet>
);

Simple.args = {
  full: true,
};

export default {
  title: 'Input/DataSearch/Simple',
};
