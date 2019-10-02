import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { Grommet, Box, Meter, Stack, Text } from 'grommet';
import { grommet } from 'grommet/themes';

function MultipleValues() {
  const [ total, ] = useState(100);
  const [ active, setActive ] = useState();
  const [ label, setLabel ] = useState();

  return (
    <Grommet theme={grommet}>
      <Box align="center" pad="large">
        <Stack anchor="center">
          <Meter
            type="circle"
            background="light-2"
            values={[
              {
                value: 70,
                onHover: over => {
                  setActive(over ? 70 : 0);
                  setLabel(over ? 'in use' : undefined);
                },
              },
              {
                value: 30,
                onHover: over => {
                  setActive(over ? 30 : 0);
                  setLabel(over ? 'available' : undefined);
                },
              },
            ]}
            max={100}
            size="small"
            thickness="medium"
          />
          <Box align="center">
            <Box direction="row" align="center" pad={{ bottom: 'xsmall' }}>
              <Text size="xxlarge" weight="bold">
                {active || total}
              </Text>
              <Text>GB</Text>
            </Box>
            <Text>{label || 'total'}</Text>
          </Box>
        </Stack>
      </Box>
    </Grommet>
  );
}

storiesOf('Meter', module).add('Multiple Values', () => <MultipleValues />);
