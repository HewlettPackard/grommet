import React from 'react';
import { render } from '@testing-library/react';
import 'jest-styled-components';

import { Favorite } from 'grommet-icons';
import { Box } from '../../Box';
import { Grommet } from '../../Grommet';
import { Stack } from '../../Stack';
import { Text } from '../../Text';
import { Avatar } from '..';

const src = 'test.png';

describe('Avatar', () => {
  test('renders', () => {
    const { container } = render(
      <Grommet>
        <Avatar />
        <Avatar id="test id" />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders outside grommet wrapper', () => {
    const { container } = render(<Avatar />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('size', () => {
    const { container } = render(
      <Grommet>
        <Avatar size="xsmall" src={src} />
        <Avatar size="small" src={src} />
        <Avatar src={src} />
        <Avatar size="large" src={src} />
        <Avatar size="xlarge" src={src} />
        <Avatar size="2xl" src={src} />
        <Avatar size="3xl" src={src} />
        <Avatar size="4xl" src={src} />
        <Avatar size="5xl" src={src} />

        <Avatar size="small">S</Avatar>
        <Avatar size="medium">S</Avatar>
        <Avatar size="large">S</Avatar>
        <Avatar size="xlarge">S</Avatar>
        <Avatar size="2xl">S</Avatar>
        <Avatar size="3xl">S</Avatar>
        <Avatar size="4xl">S</Avatar>
        <Avatar size="5xl">S</Avatar>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('round renders', () => {
    const { container } = render(
      <Grommet>
        <Avatar src={src} round={false} />
        <Avatar src={src} round="xsmall" />
        <Avatar src={src} round="small" />
        <Avatar src={src} round="medium" />
        <Avatar src={src} round="large" />
        <Avatar src={src} />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('text renders', () => {
    const { container } = render(
      <Grommet>
        <Avatar background="dark-2">
          <Text alignSelf="center" size="xlarge">
            R
          </Text>
        </Avatar>
        <Avatar background="brand">
          <Text alignSelf="center" size="xlarge">
            SY
          </Text>
        </Avatar>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('icon renders', () => {
    const { container } = render(
      <Grommet>
        <Avatar background="accent-4">
          <Favorite color="accent-2" />
        </Avatar>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('stack renders', () => {
    const { container } = render(
      <Grommet>
        <Stack anchor="bottom-right">
          <Box>
            <Box direction="row">
              <Avatar size="xsmall" src={src} />
              <Box pad="xxsmall" />
            </Box>
            <Box pad="xxsmall" />
          </Box>
          <Avatar src={src} size="42px" />
        </Stack>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('text size changes according to theme', () => {
    const theme = {
      avatar: {
        text: {
          size: {
            small: '30px',
            large: 'small',
            '50px': '10px',
          },
        },
      },
    };

    const { container } = render(
      <Grommet theme={theme}>
        <Box>
          <Avatar>T1</Avatar>
          <Avatar size="small">T2</Avatar>
          <Avatar size="large">T3</Avatar>
          <Avatar size="50px">T4</Avatar>
        </Box>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('a11yTitle renders', () => {
    const { container } = render(
      <Grommet>
        <Avatar a11yTitle="testing for a11ytitle" src={src} />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
