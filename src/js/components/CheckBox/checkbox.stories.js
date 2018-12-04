import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { css } from 'styled-components';

import { Box, Button, Grommet, CheckBox, Text } from 'grommet';
import { grommet } from 'grommet/themes';
import { normalizeColor, deepMerge } from 'grommet/utils';

import { FormCheckmark } from 'grommet-icons';

class SimpleCheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = { checked: !!props.checked };
  }

  onChange = event => this.setState({ checked: event.target.checked });

  render() {
    const { checked } = this.state;
    return (
      <Grommet theme={grommet}>
        <CheckBox
          {...this.props}
          label="Choice"
          checked={checked}
          onChange={this.onChange}
        />
      </Grommet>
    );
  }
}

const customCheckBoxTheme = {
  checkBox: {
    border: {
      color: {
        light: 'neutral-1',
      },
      radius: '2px',
    },
    color: {
      light: 'neutral-1',
    },
    check: {
      extend: ({ theme, checked }) => `
        ${checked && `background-color: ${normalizeColor('neutral-1', theme)};`}
      `,
    },
    hover: {
      border: {
        color: undefined,
      },
    },
    icon: {
      size: '18px',
      extend: 'stroke: white;',
    },
    icons: {
      checked: FormCheckmark,
    },
    gap: 'xsmall',
    size: '18px',
    extend: `
      color: #9C9C9C;
    `,
  },
};

class ThemedCheckBox extends Component {
  state = { checked: false };

  onChange = event => this.setState({ checked: event.target.checked });

  render() {
    const { checked } = this.state;
    return (
      <Grommet theme={deepMerge(grommet, customCheckBoxTheme)}>
        <CheckBox
          {...this.props}
          label="Choice"
          checked={checked}
          onChange={this.onChange}
        />
      </Grommet>
    );
  }
}

const checkboxCheckStyle = css`
  background-color: #2196f3;
  border-color: #2196f3;
`;

const customToggleTheme = {
  global: {
    colors: {
      'toggle-bg': '#757575',
      'toggle-knob': 'white',
    },
  },
  checkBox: {
    border: {
      color: {
        light: 'toggle-bg',
      },
    },
    color: {
      light: 'toggle-knob',
    },
    check: {
      radius: '2px',
    },
    hover: {
      border: {
        color: undefined,
      },
    },
    toggle: {
      background: 'toggle-bg',
      color: {
        light: 'toggle-knob',
      },
      size: '36px',
      knob: {
        extend: `
          top: -4px;
          box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.12), 0px 2px 2px 0px rgba(0,0,0,0.24);
        `,
      },
      extend: ({ checked }) => `
        height: 14px;
        ${checked && checkboxCheckStyle}
      `,
    },
    gap: 'xsmall',
    size: '18px',
  },
};

class ThemedToggle extends Component {
  state = { checked: false };

  onChange = event => this.setState({ checked: event.target.checked });

  render() {
    const { checked } = this.state;
    return (
      <Grommet theme={deepMerge(grommet, customToggleTheme)}>
        <CheckBox
          {...this.props}
          label="Choice"
          checked={checked}
          onChange={this.onChange}
          toggle
        />
      </Grommet>
    );
  }
}

class CheckBoxInsideButton extends Component {
  state = {
    checked: false,
  };

  render() {
    const { checked } = this.state;
    return (
      <Grommet theme={grommet}>
        <Box>
          <Button
            hoverIndicator="background"
            onClick={() => {
              this.setState({ checked: !checked });
            }}
          >
            <CheckBox
              tabIndex="-1"
              checked={checked}
              label={<Text>Hi</Text>}
              onChange={() => {}}
            />
          </Button>
        </Box>
      </Grommet>
    );
  }
}

class IndeterminateCheckBox extends Component {
  state = {
    checked: [],
    checkboxes: ['fruits', 'vegetables', 'olive oil'],
  };

  onCheckAll = event => {
    const { checkboxes } = this.state;
    if (event.target.checked) {
      this.setState({ checked: checkboxes });
    } else {
      this.setState({ checked: [] });
    }
  };

  onCheck = (event, value) => {
    const { checked } = this.state;
    if (event.target.checked) {
      checked.push(value);
      this.setState({ checked });
    } else {
      this.setState({ checked: checked.filter(item => item !== value) });
    }
  };

  render() {
    const { checked, checkboxes } = this.state;

    return (
      <Grommet theme={grommet}>
        <Box>
          <CheckBox
            checked={checked.length === 3}
            indeterminate={checked.length > 0 && checked.length < 3}
            label={<Text>Picked them all</Text>}
            onChange={this.onCheckAll}
          />
        </Box>
        <Box direction="row" gap="medium">
          {checkboxes.map(item => (
            <CheckBox
              key={item}
              checked={checked.indexOf(item) !== -1}
              label={<Text>{item}</Text>}
              onChange={e => this.onCheck(e, item)}
            />
          ))}
        </Box>
      </Grommet>
    );
  }
}

storiesOf('CheckBox', module)
  .add('Simple', () => <SimpleCheckBox />)
  .add('Toggle', () => <SimpleCheckBox toggle />)
  .add('Disabled', () => <SimpleCheckBox checked disabled />)
  .add('Reverse', () => <SimpleCheckBox reverse />)
  .add('Themed CheckBox', () => <ThemedCheckBox />)
  .add('Themed Toggle', () => <ThemedToggle />)
  .add('Inside a Button', () => <CheckBoxInsideButton />)
  .add('Interminate CheckBox', () => <IndeterminateCheckBox />);
