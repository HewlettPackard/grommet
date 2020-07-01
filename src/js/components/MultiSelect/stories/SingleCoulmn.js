import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { Box, MnetUIBase, MultiSelect } from 'mnet-ui-base';
import { neo as mnet } from 'mnet-ui-base/themes/neo';

// const options = ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5'];
const options = [
  { id: 1, label: 'Test 1' },
  { id: 2, label: 'Test 2' },
  { id: 3, label: 'Test 3' },
  { id: 4, label: 'Test 4' },
  { id: 5, label: 'Test 5' },
  { id: 6, label: 'Test 12' },
  { id: 7, label: 'Test 13' },
];

const Example = () => {
  const [value, setValue] = useState([]);

  return(
    <MnetUIBase full theme={mnet}>
      <Box fill align="center" justify="start" pad="large">
        <MultiSelect
          options={options}
          value={value}
          labelKey="label"
          valueKey={{ key: 'id', reduce: true }}
          onValueChange={(nextValue) => setValue(nextValue)}
          layout="single-column"
          width="medium"
          searchPlaceholder="Search"
          searchable
          withOptionChips
          withUpdateCancelButtons
        />
      </Box>
    </MnetUIBase>
  )
}

storiesOf('MultiSelect', module).add('Single Column', () => <Example />);