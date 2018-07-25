import React from 'react';
import { storiesOf } from '@storybook/react';
import { Add } from 'grommet-icons';

import Button from '../Button/Button';
import RoutedButton from '../Button/RoutedButton';
import Grommet from '../Grommet/Grommet';
import Box from '../Box/Box';
import Text from '../Text/Text';

const SimpleButton = props => (
  <Grommet>
    <Button fill={true} label='Submit' onClick={() => {}} {...props} />
  </Grommet>
);

const IconButton = () => (
  <Grommet>
    <Button icon={<Add />} hoverIndicator={true} onClick={() => {}} />
  </Grommet>
);

const PlainButton = () => (
  <Grommet>
    <Button hoverIndicator={true} onClick={() => {}}>
      <Box pad='small' direction='row' align='center' gap='small'>
        <Add />
        <Text>Add</Text>
      </Box>
    </Button>
  </Grommet>
);

const AnchorButton = () => (
  <Grommet>
    <Button label='Go' href='#' />
  </Grommet>
);

const RouteButton = () => (
  <Grommet>
    <RoutedButton label='Go' path='/' />
  </Grommet>
);

const customTheme = {
  button: {
    border: {
      radius: undefined,
      color: '#2196f3',
    },
    padding: {
      vertical: '12px',
      horizontal: '24px',
    },
    colors: {
      primary: '#2196f3',
    },
    extend: (props) => {
      let extraStyles = '';
      if (props.primary) {
        extraStyles = `
          text-transform: uppercase;
        `;
      }
      return `
        color: white;

        span {
          font-size: 12px;
        }

        ${extraStyles}
      `;
    },
  },
};

const CustomThemeButton = () => (
  <Grommet theme={customTheme}>
    <Button label='Submit' onClick={() => {}} primary={true} />
  </Grommet>
);

storiesOf('Button', module)
  .add('Default', () => <SimpleButton />)
  .add('Primary', () => <SimpleButton primary={true} />)
  .add('Icon', () => <IconButton />)
  .add('Plain', () => <PlainButton />)
  .add('Anchor', () => <AnchorButton />)
  .add('RoutedButton', () => <RouteButton />)
  .add('Custom theme', () => <CustomThemeButton />);
