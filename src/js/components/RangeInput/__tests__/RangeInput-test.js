import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import 'jest-axe/extend-expect';
import 'regenerator-runtime/runtime';

import { axe } from 'jest-axe';
import { cleanup, render, fireEvent } from '@testing-library/react';
import { Grommet } from '../../Grommet';
import { RangeInput } from '..';

describe('RangeInput', () => {
  afterEach(cleanup);

  test('should have no accessibility violations', async () => {
    const { container } = render(
      <Grommet>
        <RangeInput value="50" a11yTitle="test" />
      </Grommet>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
    expect(container).toMatchSnapshot();
  });

  test('renders', () => {
    const component = renderer.create(
      <Grommet>
        <RangeInput value="50" />
      </Grommet>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('track themed', () => {
    const component = renderer.create(
      <Grommet theme={{ rangeInput: { track: { color: 'brand' } } }}>
        <RangeInput value="10" />
      </Grommet>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('track themed with color and opacity', () => {
    const component = renderer.create(
      <Grommet
        theme={{ rangeInput: { track: { color: 'brand', opacity: 0.3 } } }}
      >
        <RangeInput value="10" />
      </Grommet>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('with min and max offset', () => {
    const component = renderer.create(
      <Grommet>
        <RangeInput min={10} max={20} step={1} value={15} />
      </Grommet>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('onFocus', () => {
    const onFocus = jest.fn();
    const { container, getByDisplayValue } = render(
      <Grommet>
        <RangeInput min={0} max={10} step={1} value={5} onFocus={onFocus} />
      </Grommet>,
    );
    fireEvent.focus(getByDisplayValue('5'));
    expect(container.firstChild).toMatchSnapshot();
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  test('onBlur', () => {
    const onBlur = jest.fn();
    const { container, getByDisplayValue } = render(
      <Grommet>
        <RangeInput min={0} max={10} step={1} value={5} onBlur={onBlur} />
      </Grommet>,
    );
    fireEvent.blur(getByDisplayValue('5'));
    expect(container.firstChild).toMatchSnapshot();
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  test('onChange', () => {
    const onChange = jest.fn();
    const { container, getByDisplayValue } = render(
      <Grommet>
        <RangeInput min={0} max={10} step={1} value={5} onChange={onChange} />
      </Grommet>,
    );
    fireEvent.change(getByDisplayValue('5'), {
      target: {
        value: '10',
      },
    });
    expect(container.firstChild).toMatchSnapshot();
    expect(onChange).toBeCalledTimes(1);
  });

  test('inputDirection', () => {
    const INPUT_DIRECTIONS = {
      right: 'row',
      left: 'row-reverse',
      above: 'column-reverse',
      below: 'column',
    };

    const getStyle = container => {
      const containers = container.getElementsByTagName('div');
      const rangeInputBoxContainer = containers.item(1);
      const style = window.getComputedStyle(rangeInputBoxContainer);

      return style;
    };

    const Test = ({ inputDirection }) => (
      <Grommet>
        <RangeInput
          data-testid="range-input"
          min={0}
          max={10}
          step={1}
          value={5}
          inputValue
          inputDirection={inputDirection}
        />
      </Grommet>
    );

    const expectFlexDirection = (container, direction) => {
      const style = getStyle(container);
      expect(style.flexDirection).toBe(direction);
    };

    const { container } = render(<Test />);

    expect(container.firstChild).toMatchSnapshot();
    expectFlexDirection(container, 'row');

    Object.entries(INPUT_DIRECTIONS).forEach(
      ([inputDirection, flexDirection]) => {
        const { container: newContainer } = render(
          <Test inputDirection={inputDirection} />,
        );

        expect(newContainer.firstChild).toMatchSnapshot();
        expectFlexDirection(newContainer, flexDirection);
      },
    );
  });

  test('inputValue', () => {
    const onChange = jest.fn();
    const { container, getByTestId } = render(
      <Grommet>
        <RangeInput
          data-testid="range-input"
          min={0}
          max={10}
          step={1}
          value={5}
          onChange={onChange}
          inputValue
        />
      </Grommet>,
    );

    fireEvent.keyDown(getByTestId('range-input'), {
      key: '9',
      code: 'Numpad9',
    });

    expect(container.firstChild).toMatchSnapshot();

    const inputRangeValue = container.querySelector('#input-range-value');
    expect(inputRangeValue).not.toBeNull();

    fireEvent.keyDown(inputRangeValue, { key: 'Tab', code: 'Tab' });

    const hasInputRangeValue = container.querySelector('#input-range-value');
    expect(hasInputRangeValue).toBeNull();
  });

  test('allowed keys to open inputValue', () => {
    const onChange = jest.fn();
    const { container, getByTestId } = render(
      <Grommet>
        <RangeInput
          data-testid="range-input"
          min={0}
          max={10}
          step={1}
          value={5}
          onChange={onChange}
          inputValue
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();

    const expectOpenInputValue = (key, code) => {
      fireEvent.keyDown(getByTestId('range-input'), { key, code });
      const inputRangeValue = container.querySelector('#input-range-value');
      expect(inputRangeValue).not.toBeNull();
      fireEvent.keyDown(inputRangeValue, { key: 'Tab', code: 'Tab' });
    };

    expectOpenInputValue('ArrowRight', 'ArrowRight');
    expectOpenInputValue('ArrowLeft', 'ArrowLeft');
    expectOpenInputValue('ArrowUp', 'ArrowUp');
    expectOpenInputValue('ArrowDown', 'ArrowDown');
    expectOpenInputValue('9', 'Numpad9');
  });

  test('allowed keys to close inputValue', () => {
    const onChange = jest.fn();
    const { container, getByTestId } = render(
      <Grommet>
        <RangeInput
          data-testid="range-input"
          min={0}
          max={10}
          step={1}
          value={5}
          onChange={onChange}
          inputValue
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();

    const expectCloseInputValue = (key, code) => {
      fireEvent.keyDown(getByTestId('range-input'), {
        key: '9',
        code: 'Numpad9',
      });
      const inputRangeValue = container.querySelector('#input-range-value');
      fireEvent.keyDown(inputRangeValue, { key, code });
      const hasInputRangeValue = container.querySelector('#input-range-value');
      expect(hasInputRangeValue).toBeNull();
    };

    expectCloseInputValue('Tab', 'Tab');
    expectCloseInputValue('Escape', 'Escape');
  });
});
