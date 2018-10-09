import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';

import { Grommet, Box, Distribution, Text } from 'grommet';
import { grommet } from 'grommet/themes';

class SimpleDistribution extends Component {
  render() {
    return (
      <Grommet theme={grommet}>
        <Distribution
          basis='medium'
          values={[
            { value: 50, color: 'light-3' },
            { value: 30, color: 'neutral-1' },
            { value: 20, color: 'brand' },
            { value: 10, color: 'light-3' },
            { value: 5, color: 'neutral-1' },
          ]}
        >
          {value => (
            <Box pad='xsmall' background={value.color} fill={true}>
              <Text size='large'>{value.value}</Text>
            </Box>
          )}
        </Distribution>
      </Grommet>
    );
  }
}

storiesOf('Distribution', module)
  .add('Simple Distribution', () => <SimpleDistribution />);
