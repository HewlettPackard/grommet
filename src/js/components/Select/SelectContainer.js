import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

import { Down } from 'grommet-icons';

import { debounce } from '../../utils';

import { Box } from '../Box';
import { Button } from '../Button';
import { Keyboard } from '../Keyboard';
import { Text } from '../Text';
import { TextInput } from '../TextInput';

class SelectContainer extends Component {
  state = {
    selectedOptionIndex: -1,
    search: '',
  }
  static defaultProps = {
    value: '',
  }
  optionsRef = {}

  componentDidMount() {
    const { onSearch } = this.props;
    // timeout need to send the operation through event loop and allow time to the portal
    // to be available
    setTimeout(() => {
      if (onSearch) {
        findDOMNode(this.searchRef).querySelector('input').focus();
      } else {
        findDOMNode(this.selectRef).focus();
      }
    }, 0);
  }

  componentDidUpdate() {
    const { selectedOptionIndex } = this.state;
    const buttonNode = findDOMNode(this.optionsRef[selectedOptionIndex]);
    if (selectedOptionIndex >= 0 && buttonNode) {
      buttonNode.scrollIntoView();
    }
  }

  onInput = (event) => {
    this.setState(
      { search: event.target.value, selectedOptionIndex: -1 },
      () => this.onSearch(this.state.search)
    );
  }

  onSearch = debounce(search => this.props.onSearch(search), 150)

  selectOption = (option) => {
    const { onChange } = this.props;

    if (onChange) {
      onChange({ target: findDOMNode(this.inputRef), option });
    }
  }

  onNextOption = (event) => {
    const { options } = this.props;
    const { selectedOptionIndex } = this.state;
    event.preventDefault();
    const index = Math.min(selectedOptionIndex + 1, options.length - 1);
    this.setState({ selectedOptionIndex: index });
  }

  onPreviousOption = (event) => {
    const { selectedOptionIndex } = this.state;
    event.preventDefault();
    const index = Math.max(selectedOptionIndex - 1, 0);
    this.setState({ selectedOptionIndex: index });
  }

  onSelectOption = (event) => {
    const { options } = this.props;
    const { selectedOptionIndex } = this.state;
    if (selectedOptionIndex >= 0) {
      event.preventDefault(); // prevent submitting forms
      this.selectOption(options[selectedOptionIndex]);
    }
  }

  selectControl = () => {
    const { placeholder, value, ...rest } = this.props;
    delete rest.children;
    const content = React.isValidElement(value) ? value : (
      <TextInput
        ref={(ref) => { this.inputRef = ref; }}
        {...rest}
        type='text'
        placeholder={placeholder}
        plain={true}
        readOnly={true}
        value={value}
      />
    );
    return (
      <Box align='center' direction='row' border='all'>
        {content}
        <Box margin={{ horizontal: 'small' }}>
          <Down />
        </Box>
      </Box>
    );
  }

  render() {
    const {
      activeOptionIndex,
      background,
      children,
      dropSize,
      name,
      onKeyDown,
      onSearch,
      options,
      searchPlaceholder,
      value,
    } = this.props;
    const { selectedOptionIndex, search } = this.state;
    return (
      <Keyboard
        onEnter={this.onSelectOption}
        onUp={this.onPreviousOption}
        onDown={this.onNextOption}
        onKeyDown={onKeyDown}
      >
        <Box background={background}>
          {onSearch ? (
            <Box pad='xsmall'>
              <TextInput
                focusIndicator={true}
                plain={true}
                size='small'
                ref={(ref) => { this.searchRef = ref; }}
                type='search'
                value={search}
                placeholder={searchPlaceholder}
                onInput={this.onInput}
              />
            </Box>
          ) : undefined}
          <Box basis={dropSize} overflow='auto'>
            <Box flex={false} role='menubar' tabIndex='-1' ref={(ref) => { this.selectRef = ref; }}>
              {options.map((option, index) => (
                <Button
                  role='menuitem'
                  ref={(ref) => { this.optionsRef[index] = ref; }}
                  active={
                    activeOptionIndex === index ||
                    selectedOptionIndex === index ||
                    option === value
                  }
                  key={`option_${name || ''}_${index}`}
                  onClick={() => this.selectOption(option)}
                  hoverIndicator='background'
                >
                  {children ? children(option, index, options) : (
                    <Box align='start' pad='small'>
                      <Text margin='none'>{option.toString()}</Text>
                    </Box>
                  )}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
      </Keyboard>
    );
  }
}

export default SelectContainer;
