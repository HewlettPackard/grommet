import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';

import { Grommet, Box, Button, Grid, Text } from '../';
import { grommet } from '../../themes';

class AppGrid extends Component {
  state = { sidebar: true }
  render() {
    const { sidebar } = this.state;
    return (
      <Grommet theme={grommet}>
        <Grid
          rows={['auto', 'medium']}
          columns={['auto', 'flex']}
          areas={[
            { name: 'header', start: [0, 0], end: [1, 0] },
            { name: 'sidebar', start: [0, 1], end: [0, 1] },
            { name: 'main', start: [1, 1], end: [1, 1] },
          ]}
        >
          <Box
            gridArea='header'
            direction='row'
            align='center'
            justify='between'
            pad={{ horizontal: 'medium', vertical: 'small' }}
            background='dark-2'
          >
            <Button onClick={() => this.setState({ sidebar: !sidebar })}>
              <Text size='large'>Title</Text>
            </Button>
            <Text>my@email</Text>
          </Box>
          {sidebar && (
            <Box
              gridArea='sidebar'
              background='dark-5'
              width='small'
              animation={[
                { type: 'fadeIn', duration: 300 },
                { type: 'slideRight', size: 'xlarge', duration: 150 },
              ]}
            >
              {['First', 'Second', 'Third'].map(name => (
                <Button key={name} href='#' hoverIndicator={true}>
                  <Box pad={{ horizontal: 'medium', vertical: 'small' }}>
                    <Text>{name}</Text>
                  </Box>
                </Button>
              ))}
            </Box>
          )}
          <Box gridArea='main' justify='center' align='center'>
            <Text>main</Text>
          </Box>
        </Grid>
      </Grommet>
    );
  }
}

storiesOf('Grid', module)
  .add('App', () => <AppGrid />);
