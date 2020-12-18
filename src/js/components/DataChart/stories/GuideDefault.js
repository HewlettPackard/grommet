import React from 'react';

import { Box, DataChart, Grommet } from 'grommet';
import { grommet } from 'grommet/themes';

const data = [];
for (let i = 1; i < 8; i += 1) {
  const v = Math.sin(i / 2.0);
  data.push({
    date: `2020-${((i % 12) + 1).toString().padStart(2, 0)}-01`,
    percent: Math.abs(v * 100),
  });
}

export const GuideDefault = () => (
  <Grommet theme={grommet}>
    <Box align="center" justify="start" pad="large">
      <DataChart data={data} series="percent" guide />
    </Box>
  </Grommet>
);

export default {
  title: 'Visualizations/DataChart',
};
