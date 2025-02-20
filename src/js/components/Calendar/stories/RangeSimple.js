import React from 'react';

import { Box, Calendar } from 'grommet';

export const RangeSimple = () => (
  // Uncomment <Grommet> lines when using outside of storybook
  // <Grommet theme={...}>
  <Box align="center" pad="large">
    <Calendar date={[['2020-04-03', '2020-04-08']]} range simpleSelection />
  </Box>
  // </Grommet>
);

export default {
  title: 'Visualizations/Calendar/RangeSimple',
};
