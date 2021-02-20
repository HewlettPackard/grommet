import React from 'react';

import { Grommet, Box, DataTable, Spinner, Text } from 'grommet';
import { grommet } from 'grommet/themes';

// Source code for the data can be found here
// https://github.com/grommet/grommet/blob/master/src/js/components/DataTable/stories/data.js
import { columns, DATA } from './data';

export const Placeholder = () => (
  <Grommet theme={grommet}>
    <Box align="center" pad="large">
      <DataTable
        columns={columns}
        data={DATA}
        placeholder={
          <Box
            fill
            align="center"
            justify="center"
            direction="row"
            pad="large"
            gap="small"
            background={{ color: 'background-front', opacity: 'strong' }}
          >
            <Spinner
              border={[
                { side: 'all', color: 'transparent', size: 'medium' },
                { side: 'horizontal', color: 'brand', size: 'medium' },
              ]}
            />
            <Text weight="bold">Loading ...</Text>
          </Box>
        }
        step={10}
      />
    </Box>
  </Grommet>
);

export default {
  title: 'Visualizations/DataTable/Placeholder',
};
