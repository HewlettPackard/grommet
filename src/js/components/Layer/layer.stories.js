import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';

import {
  Add,
  Close,
  FormClose,
  StatusGood,
  Trash,
} from 'grommet-icons';

import {
  Box,
  Button,
  FormField,
  Grommet,
  Heading,
  Layer,
  Text,
  TextInput,
} from '../';

class CenterLayer extends Component {
  state = {}

  onOpen = () => this.setState({ open: true })

  onClose = () => this.setState({ open: undefined })

  onOpen2 = () => this.setState({ open2: true })

  onClose2 = () => this.setState({ open2: undefined })

  render() {
    const { open, open2 } = this.state;
    return (
      <Grommet>
        <Button
          icon={<Trash />}
          label={<Text><strong>Remove</strong></Text>}
          onClick={this.onOpen}
          plain={true}
        />
        {open && (
          <Layer
            position='center'
            modal={true}
            onClickOutside={this.onClose}
            onEsc={this.onClose}
          >
            <Box pad='medium' gap='small' width='medium'>
              <Heading level={3} margin='none'>Confirm</Heading>
              <Text>Are you sure you want to delete?</Text>
              <Box
                tag='footer'
                gap='small'
                direction='row'
                align='center'
                justify='end'
                pad={{ top: 'medium', bottom: 'small' }}
              >
                <Button
                  label='Open 2'
                  onClick={this.onOpen2}
                  color='dark-6'
                />
                <Button
                  label={
                    <Text color='white'>
                      <strong>Delete</strong>
                    </Text>
                  }
                  onClick={this.onClose}
                  primary={true}
                  color='status-critical'
                />
              </Box>
            </Box>
          </Layer>
        )}
        {open2 && (
          <Layer
            position='top'
            modal={true}
            onClickOutside={this.onClose2}
            onEsc={this.onClose2}
          >
            <Box pad='medium' gap='small' width='medium'>
              <Heading level={3} margin='none'>Confirm 2</Heading>
              <Box
                tag='footer'
                gap='small'
                direction='row'
                align='center'
                justify='end'
                pad={{ top: 'medium', bottom: 'small' }}
              >
                <Button
                  label='Close'
                  onClick={this.onClose2}
                  color='dark-6'
                />
              </Box>
            </Box>
          </Layer>
        )}
      </Grommet>
    );
  }
}

class FormLayer extends Component {
  state = {}

  onOpen = () => this.setState({ open: true })

  onClose = () => this.setState({ open: undefined })

  render() {
    const { open } = this.state;
    return (
      <Grommet>
        <Button
          icon={<Add />}
          label='Add'
          onClick={this.onOpen}
        />
        {open && (
          <Layer
            position='right'
            full='vertical'
            modal={true}
            onClickOutside={this.onClose}
            onEsc={this.onClose}
          >
            <Box
              tag='form'
              fill='vertical'
              overflow='auto'
              width='medium'
              pad='medium'
              onSubmit={this.onClose}
            >
              <Box flex={false} direction='row' justify='between'>
                <Heading level={2} margin='none'>Add</Heading>
                <Button icon={<Close />} onClick={this.onClose} />
              </Box>
              <Box flex='grow' overflow={true} pad={{ vertical: 'medium' }}>
                <FormField label='First'>
                  <TextInput />
                </FormField>
                <FormField label='Second'>
                  <TextInput />
                </FormField>
                <FormField label='Third'>
                  <TextInput />
                </FormField>
                <FormField label='Fourth'>
                  <TextInput />
                </FormField>
              </Box>
              <Box flex={false} tag='footer' align='start'>
                <Button
                  type='submit'
                  label='Submit'
                  onClick={this.onClose}
                  primary={true}
                />
              </Box>
            </Box>
          </Layer>
        )}
      </Grommet>
    );
  }
}

class NotificationLayer extends Component {
  state = {}

  onOpen = () => this.setState({ open: true })

  onClose = () => this.setState({ open: undefined })

  render() {
    const { open } = this.state;
    return (
      <Grommet>
        <Button
          icon={<Add color='brand' />}
          label={<Text><strong>Add</strong></Text>}
          onClick={this.onOpen}
          plain={true}
        />
        {open && (
          <Layer
            position='bottom'
            full='horizontal'
            modal={false}
            responsive={false}
          >
            <Box align='start' pad={{ vertical: 'medium', horizontal: 'small' }}>
              <Box
                align='center'
                direction='row'
                gap='small'
                round='medium'
                elevation='medium'
                pad={{ vertical: 'xsmall', horizontal: 'small' }}
                background='status-ok'
              >
                <Box align='center' direction='row' gap='xsmall'>
                  <StatusGood />
                  <Text>
                    A new virtual machine has been successfully added
                  </Text>
                </Box>
                <Button icon={<FormClose />} onClick={this.onClose} plain={true} />
              </Box>
            </Box>
          </Layer>
        )}
      </Grommet>
    );
  }
}

storiesOf('Layer', module)
  .add('Center', () => <CenterLayer />)
  .add('Form', () => <FormLayer />)
  .add('Notification', () => <NotificationLayer />);
