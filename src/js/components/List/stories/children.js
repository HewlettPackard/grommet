import React from 'react';
import { storiesOf } from '@storybook/react';

import { Gremlin } from 'grommet-icons';

import { Box, Grommet, grommet, List, Text, Tip } from 'grommet';

export const data = [
  { city: 'Boise', state: 'Idaho' },
  { city: 'Fort Collins', state: 'Colorado' },
  { city: 'Bay Area', state: 'California' },
  { city: 'San Diego', state: 'California' },
];

export const ChildrenExample = () => (
  <Grommet theme={grommet}>
    <Box pad="large" height="100%" align="center">
      <List data={data} pad="medium">
        {(datum, index) => (
          <Box
            key={index}
            direction="row-responsive"
            gap="medium"
            align="center"
          >
            <Gremlin size="large" />
            <Tip content={datum.state} dropProps={{ align: { left: 'right' } }}>
              <Text weight="bold">{datum.city}</Text>
            </Tip>
          </Box>
        )}
      </List>
    </Box>
  </Grommet>
);

storiesOf('List', module).add('Children', () => <ChildrenExample />);
