import React, { useState, useEffect, useRef } from 'react';

import { Grommet, Box, Meter } from 'grommet';
import { grommet } from 'grommet/themes';

export const Circle = () => {
  const [value, setValue] = useState(20);

  const timer = useRef();
  clearTimeout(timer.current);
  timer.current = setTimeout(() => {
    setValue(value < 100 ? value + 8 : 20);
  }, 2000);

  useEffect(
    () => () => {
      clearTimeout(timer.current);
    },
    [],
  );

  return (
    <Grommet theme={grommet}>
      <Box align="center" pad="large">
        <Meter type="semicircle" background="light-2" value={50} max={100} />
      </Box>
    </Grommet>
  );
};

export default {
  title: 'Visualizations/Meter/Circle',
};
