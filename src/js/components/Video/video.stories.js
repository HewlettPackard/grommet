import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';

import { Grommet, Video } from '../';
import { grommet } from '../../themes';

class SimpleVideo extends Component {
  render() {
    return (
      <Grommet theme={grommet}>
        <Video>
          <source src='http://techslides.com/demos/sample-videos/small.webm' type='video/webm' />
          <source src='http://techslides.com/demos/sample-videos/small.ogv' type='video/ogg' />
          <source src='http://techslides.com/demos/sample-videos/small.mp4' type='video/mp4' />
          <source src='http://techslides.com/demos/sample-videos/small.3gp' type='video/3gp' />
        </Video>
      </Grommet>
    );
  }
}

storiesOf('Video', module)
  .add('Simple Video', () => <SimpleVideo />);
