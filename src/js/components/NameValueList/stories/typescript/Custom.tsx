import React from 'react';
import {
  Box,
  Grommet,
  grommet,
  NameValueList,
  NameValuePair,
  Text,
} from 'grommet';
import { deepMerge } from 'grommet/utils';

const data = {
  'Model type': 'MXQ83700F3',
  'Last synced on some date': '34343738-3036-584DFD3422SA',
  'Created on': '172.16.255.321.8',
  Policies: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget 
  est at turpis imperdiet blandit porttitor eu enim. Phasellus faucibus 
  pharetra risus nec bibendum.`,
};

const customTheme = deepMerge(grommet, {
  nameValueList: {
    name: {
      color: 'text',
      size: 'xsmall',
      weight: 500,
    },
  },
});

export const Custom = () => (
  <Grommet theme={customTheme}>
    <Box pad="small">
      <NameValueList pairProps={{ direction: 'column' }}>
        {Object.entries(data).map(([name, value]) => (
          <NameValuePair key={name} name={name}>
            <Text color="text" weight="bold">
              {value}
            </Text>
          </NameValuePair>
        ))}
      </NameValueList>
    </Box>
  </Grommet>
);

export default {
  title: 'Visualizations/NameValueList/Custom',
};
