import React from 'react';

import { Grommet, Box, Image } from 'grommet';
import { grommet } from 'grommet/themes';

export const Opacity = () => (
  <Grommet theme={grommet}>
    <Box gap="small" direction="row">
      <Image src="//v2.grommet.io/assets/IMG_4245.jpg" />
      <Image opacity="strong" src="//v2.grommet.io/assets/IMG_4245.jpg" />
    </Box>
    <Box gap="small" direction="row">
      <Image opacity="medium" src="//v2.grommet.io/assets/IMG_4245.jpg" />
      <Image opacity="weak" src="//v2.grommet.io/assets/IMG_4245.jpg" />
    </Box>
    <Box gap="small" direction="row">
      <Image opacity={false} src="//v2.grommet.io/assets/IMG_4245.jpg" />
      <Image opacity src="//v2.grommet.io/assets/IMG_4245.jpg" />
    </Box>
    <Box gap="small" direction="row">
      <Image opacity="0.6" src="//v2.grommet.io/assets/IMG_4245.jpg" />
    </Box>
  </Grommet>
);
