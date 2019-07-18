import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { Grommet, Box, FormField, TextInput } from 'grommet';
import { grommet } from 'grommet/themes';

const allSuggestions = Array(100)
  .fill()
  .map((_, i) => `suggestion ${i + 1}`);

class FormFieldTextInput extends Component {
  state = { value: '', suggestions: allSuggestions };

  onChange = event => {
    const {
      target: { value },
    } = event;
    const exp = new RegExp(value, 'i');
    const suggestions = allSuggestions.filter(s => exp.test(s));
    this.setState({ value, suggestions });
  };

  onSelect = event => this.setState({ value: event.suggestion });

  render() {
    const { value, suggestions } = this.state;
    return (
      <Grommet theme={grommet}>
        <Box align="center" pad="large">
          <FormField label="Label" htmlFor="text-input" {...this.props}>
            <TextInput
              id="text-input"
              placeholder="placeholder"
              value={value}
              onChange={this.onChange}
              onSelect={this.onSelect}
              suggestions={suggestions}
            />
          </FormField>
        </Box>
      </Grommet>
    );
  }
}

storiesOf('FormField', module).add('TextInput', () => <FormFieldTextInput />);
