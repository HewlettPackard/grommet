import React from 'react';
import { storiesOf } from '@storybook/react';

import { Grommet, Box, Diagram, Stack } from 'grommet';
import { grommet } from 'grommet/themes';

const Node = ({ id, ...rest }) => (
  <Box
    id={id}
    basis="xxsmall"
    margin="small"
    pad="medium"
    round="small"
    background="neutral-1"
    {...rest}
  />
);

const connection = (fromTarget, toTarget, { color, ...rest } = {}) => ({
  fromTarget,
  toTarget,
  anchor: 'vertical',
  color: color || 'accent-1',
  thickness: 'xsmall',
  round: true,
  type: 'rectilinear',
  ...rest,
});

const SimpleDiagram = () => (
  <Grommet theme={grommet}>
    <Box align="center" pad="large">
      <Stack>
        <Box>
          <Box direction="row">
            {[1, 2, 3].map(id => (
              <Node key={id} id={id} />
            ))}
          </Box>
          <Box direction="row">
            {[4, 5].map(id => (
              <Node key={id} id={id} background="neutral-2" />
            ))}
          </Box>
        </Box>
        <Diagram
          connections={[
            connection('1', '5', { color: 'accent-2' }),
            connection('3', '5', { color: 'accent-2', anchor: 'horizontal' }),
          ]}
        />
      </Stack>
    </Box>
  </Grommet>
);

storiesOf('Diagram', module).add('Simple Diagram', () => <SimpleDiagram />);
