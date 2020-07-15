/* eslint-disable max-len */
import React from 'react';
import { storiesOf } from '@storybook/react';
import styled, { keyframes } from 'styled-components';

import { Box, DataChart, Grommet, Stack } from 'grommet';
import { grommet } from 'grommet/themes';

export const keyFrameExampleOne = keyframes`
0% {
  width: 200px;
  background-color: #FFFFFF;
}  
100% {
    width: 0px;
    background-color: #FFFFFF;
  }
`;
const AnimatedBox = styled(Box)`
  animation: ${keyFrameExampleOne} 3s linear;
`;

const data = [];
for (let i = 0; i < 13; i += 1) {
  const v = -Math.sin(i / 2.0);
  const v2 = Math.cos(i / 2.0);
  data.push({
    date: `2020-07-${((i % 30) + 1).toString().padStart(2, 0)}`,
    amount: Math.floor(v * 100),
    need: Math.floor(v2 * 10),
  });
}

for (let i = 0; i < 13; i += 1) {
  const v = -Math.sin(i / 2.0);
  const v2 = Math.cos(i / 2.0);
  data.push({
    date: `2020-08-${((i % 30) + 1).toString().padStart(2, 0)}`,
    amountPredicted: Math.floor(v * 100),
    needPredicted: Math.floor(v2 * 10),
  });
}

const Example = () => (
  <Grommet theme={grommet}>
    <Box align="center" justify="start" pad="large">
      <Stack anchor="top-right">
        <DataChart
          data={data}
          property={[
            'date',
            { property: 'amount', color: 'graph-2', point: 'circle' },
            { property: 'amountPredicted', color: 'graph-2', point: 'circle' },
            { property: 'need', color: 'graph-1', point: 'star' },
            { property: 'needPredicted', color: 'graph-1' },
          ]}
          chart={[
            {
              property: 'amount',
              type: 'area',
              thickness: 'xsmall',
              color: { color: 'graph-2', opacity: 'medium' },
            },
            {
              property: 'amount',
              type: 'line',
              thickness: 'xxsmall',
              round: true,
            },
            {
              property: 'amountPredicted',
              type: 'area',
              thickness: 'xsmall',
              color: { color: 'graph-2', opacity: 'medium' },
            },
            {
              property: 'amountPredicted',
              type: 'line',
              thickness: 'xxsmall',
              round: true,
              dash: true,
            },
            {
              property: 'amountPredicted',
              type: 'point',
              thickness: 'small',
            },
            { property: 'amount', type: 'bar', thickness: 'hair' },
            {
              property: 'amount',
              type: 'point',
              thickness: 'small',
            },
            // {
            //   property: 'needPredicted',
            //   type: 'line',
            //   thickness: 'xxsmall',
            //   round: true,
            //   dash: true,
            // },
            // {
            //   property: 'need',
            //   type: 'line',
            //   thickness: 'xxsmall',
            //   dash: true,
            //   round: true,
            // },
            // {
            //   property: 'need',
            //   type: 'point',
            //   thickness: 'small',
            // },
          ]}
          axis={{ x: 'date', y: { property: 'amount', granularity: 'medium' } }}
          guide={{ y: { granularity: 'medium' }, x: { granularity: 'fine' } }}
          gap="medium"
          pad="small"
          legend
          detail
        />
        {/* Start the prediction */}
        {/* TODO details doesn't work on stack */}
        <Box
          width="small"
          height="small"
          border={[{ side: 'left', size: 'medium' }]}
          background={{ color: '#FFFFFF', opacity: 0.4 }}
        />
        <AnimatedBox width="small" height="small" />
      </Stack>
    </Box>
  </Grommet>
);

storiesOf('DataChart', module).add('Prediction', () => <Example />);
