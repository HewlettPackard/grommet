import React, { useState } from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import 'regenerator-runtime/runtime';
import 'jest-styled-components';
import '@testing-library/jest-dom';
import { createPortal, expectPortal } from '../../../utils/portal';

import { Grommet } from '../..';
import { Box } from '../../Box';
import { Text } from '../../Text';
import { SelectMultiple } from '..';

const TestOnSearch = () => {
  const [dropOptions, setDropOptions] = useState(['a', 'b']);
  return (
    <SelectMultiple
      onSearch={() => setDropOptions(['c'])}
      options={dropOptions}
    />
  );
};

const defaultOptions = [
  'Apple',
  'Orange',
  'Banana',
  'Grape',
  'Melon',
  'Strawberry',
  'Kiwi',
  'Mango',
  'Raspberry',
  'Rhubarb',
];

const TestManyOptions = () => {
  const [options, setOptions] = useState(defaultOptions);
  const [valueMultiple, setValueMultiple] = useState([]);
  return (
    <Grommet>
      <SelectMultiple
        options={options}
        value={valueMultiple}
        placeholder="Select"
        onSearch={(text) => {
          const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
          const exp = new RegExp(escapedText, 'i');
          setOptions(defaultOptions.filter((o) => exp.test(o)));
        }}
        onClose={() => setOptions(defaultOptions)}
        onChange={({ value }) => {
          setValueMultiple(value);
        }}
      />
    </Grommet>
  );
};

const TestObj = () => {
  const [value, setValue] = useState([
    { value: 'one', label: 'a' },
    { value: 'two', label: 'b' },
    { value: 'tree', label: 'c' },
  ]);
  return (
    <Grommet>
      <SelectMultiple
        showSelectedInline
        options={[
          { value: 'one', label: 'a' },
          { value: 'two', label: 'b' },
          { value: 'tree', label: 'c' },
          { value: 'four', label: 'd' },
        ]}
        labelKey="label"
        value={value}
        onChange={({ selected }) => setValue(selected)}
      />
    </Grommet>
  );
};

describe('SelectMultiple', () => {
  test('should not have accessibility violations', async () => {
    const { container } = render(
      <Grommet>
        <SelectMultiple options={['one', 'two', 'three']} a11yTitle="test" />
      </Grommet>,
    );
    const results = await axe(container, {
      rules: {
        /* This rule is flagged because Select is built using a
        TextInput within a DropButton. According to Dequeue and
        WCAG 4.1.2 "interactive controls must not have focusable
        descendants". Jest-axe is assuming that the input is focusable
        and since the input is a descendant of the button the rule is
        flagged. However, the TextInput is built so that it is read
        only and cannot receive focus. Select is accessible
        according to the WCAG specification, but jest-axe is flagging
        it so we are disabling this rule. */
        'nested-interactive': { enabled: false },
      },
    });
    expect(container.firstChild).toMatchSnapshot();
    expect(results).toHaveNoViolations();
  });

  test('defaultValue', () => {
    const { container } = render(
      <Grommet>
        <SelectMultiple options={['one', 'two']} defaultValue={['one']} />,
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders selectMultiple outside grommet wrapper', () => {
    const { container } = render(<SelectMultiple options={['one', 'two']} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('children', () => {
    const { container } = render(
      <Grommet>
        <SelectMultiple options={[{ test: 'one' }, { test: 'two' }]}>
          {(option) => <span>{option.test}</span>}
        </SelectMultiple>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('placeholder', () => {
    const { container } = render(
      <Grommet>
        <SelectMultiple
          help={<Text>help text</Text>}
          options={[{ test: 'one' }, { test: 'two' }]}
          placeholder="placeholder text"
        />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('disabled', () => {
    const { container } = render(
      <Grommet>
        <SelectMultiple options={[1, 2]} disabled />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('Value should be of same order as the order of selection', async () => {
    // Mock scrollIntoView since JSDOM doesn't do layout.
    // https://github.com/jsdom/jsdom/issues/1695#issuecomment-449931788
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    const user = userEvent.setup();
    const onChange = jest.fn();
    const Test = () => {
      const [valueMultiple, setValueMultiple] = useState([]);
      return (
        <Grommet>
          <SelectMultiple
            options={defaultOptions}
            value={valueMultiple}
            onChange={({ value }) => {
              setValueMultiple(value);
              onChange(value);
            }}
          />
        </Grommet>
      );
    };
    render(<Test />);
    // open SelectMultiple
    await user.click(screen.getByRole('button', { name: /Open Drop/i }));
    // click all the options
    await user.click(screen.getByRole('option', { name: /Apple/i }));
    await user.click(screen.getByRole('option', { name: /Orange/i }));
    await user.click(screen.getByRole('option', { name: /Banana/i }));

    expect(onChange).toHaveBeenCalledWith(['Apple', 'Orange', 'Banana']);
  });

  test('showSelectionInline', async () => {
    // Mock scrollIntoView since JSDOM doesn't do layout.
    // https://github.com/jsdom/jsdom/issues/1695#issuecomment-449931788
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    const user = userEvent.setup();
    const open = jest.fn();
    const close = jest.fn();
    const { container } = render(
      <Grommet>
        <SelectMultiple
          onOpen={open}
          onClose={close}
          options={[0, 1, 2]}
          showSelectedInline
        />
      </Grommet>,
    );
    // open SelectMultiple
    await user.click(screen.getByRole('button', { name: /Open Drop/i }));
    expect(open).toHaveBeenCalled();

    // click all the options
    await user.click(screen.getByRole('option', { name: /0/i }));
    await user.click(screen.getByRole('option', { name: /1/i }));
    await user.click(screen.getByRole('option', { name: /2/i }));

    // close SelectMultiple
    await user.click(screen.getByRole('button', { name: /Close Select/i }));
    expect(close).toHaveBeenCalled();

    // all options should be visible when drop is closed
    expect(container.firstChild).toMatchSnapshot();
  });

  test('showSelectionInline with children', async () => {
    // Mock scrollIntoView since JSDOM doesn't do layout.
    // https://github.com/jsdom/jsdom/issues/1695#issuecomment-449931788
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    const user = userEvent.setup();
    const { container } = render(
      <Grommet>
        <SelectMultiple options={[0, 1, 2]} showSelectedInline>
          {(option, state) => (
            <Box pad="small" background={state.active ? 'active' : undefined}>
              {option}
            </Box>
          )}
        </SelectMultiple>
      </Grommet>,
    );
    // open SelectMultiple
    await user.click(screen.getByRole('button', { name: /Open Drop/i }));
    // click all the options
    await user.click(screen.getByRole('option', { name: /0/i }));
    await user.click(screen.getByRole('option', { name: /1/i }));
    await user.click(screen.getByRole('option', { name: /2/i }));
    // close SelectMultiple
    await user.click(screen.getByRole('button', { name: /Close Select/i }));
    // all options should be visible when drop is closed
    expect(container.firstChild).toMatchSnapshot();
    // unselect option at input level
    await user.click(screen.getByRole('option', { name: /0/i }));
    await user.click(screen.getByRole('option', { name: /2/i }));
    await user.click(screen.getByRole('option', { name: /1/i }));
    // options should no longer be visible after unselecting them
    expect(container.firstChild).toMatchSnapshot();
  });

  test('showSelectionInline with disabled options', () => {
    // Mock scrollIntoView since JSDOM doesn't do layout.
    // https://github.com/jsdom/jsdom/issues/1695#issuecomment-449931788
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    const { container } = render(
      <Grommet>
        <SelectMultiple
          options={['one', 'two', 'three']}
          disabled={['one']}
          value={['one']}
          showSelectedInline
        />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('keyboard interactions', () => {
    // Mock scrollIntoView since JSDOM doesn't do layout.
    // https://github.com/jsdom/jsdom/issues/1695#issuecomment-449931788
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    const { container } = render(
      <Grommet>
        <SelectMultiple options={['one', 'two', 'three', 'four']} limit={2} />
      </Grommet>,
    );

    fireEvent.click(screen.getByRole('button', { name: /Open Drop/i }));
    const input = screen.getByRole('listbox');
    fireEvent.keyDown(input, { keyCode: 40 }); // down
    fireEvent.keyDown(input, { keyCode: 13 }); // enter
    fireEvent.keyDown(input, { keyCode: 40 }); // down
    fireEvent.keyDown(input, { keyCode: 40 }); // down
    fireEvent.keyDown(input, { keyCode: 38 }); // up
    fireEvent.keyDown(input, { keyCode: 13 }); // enter

    expect(container.firstChild).toMatchSnapshot();
  });

  test('valueKey and labelKey', () => {
    const { container } = render(
      <Grommet>
        <SelectMultiple
          showSelectedInline
          options={[
            { value: 'one', label: 'a' },
            { value: 'two', label: 'b' },
          ]}
          valueKey={{
            key: 'value',
            reduce: true,
          }}
          labelKey="label"
          value={['one']}
        />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('test inline click on object', async () => {
    render(<TestObj />);
    const user = userEvent.setup();
    expect(screen.getByRole('option', { name: /a selected/ })).toBeVisible();
    expect(screen.getByRole('option', { name: /b selected/ })).toBeVisible();
    expect(screen.getByRole('option', { name: /c selected/ })).toBeVisible();

    await user.click(screen.getByRole('option', { name: /c selected/ }));

    expect(screen.getByRole('option', { name: /a selected/ })).toBeVisible();
    expect(screen.getByRole('option', { name: /b selected/ })).toBeVisible();
    expect(screen.queryByRole('option', { name: /c selected/ })).toBeNull();
  });

  test('search', async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(
      <Grommet>
        <SelectMultiple
          showSelectedInline
          options={['one', 'two', 'three', 'four']}
          onSearch={onSearch}
          limit={1}
        />
      </Grommet>,
    );

    await user.click(screen.getByRole('button', { name: /Open Drop/i }));
    const input = screen.getByRole('searchbox');
    await user.type(input, 'th');

    expect(onSearch).toBeCalledWith(expect.stringMatching(/^th/));
  });

  test('null value', () => {
    const { asFragment } = render(
      <Grommet>
        {/* @ts-ignore */}
        <SelectMultiple options={['a', 'b']} value={null} />
      </Grommet>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test('object value', () => {
    render(
      <Grommet>
        <SelectMultiple
          showSelectedInline
          options={[
            { label: 'a', value: 1 },
            { label: 'b', value: 2 },
          ]}
          labelKey="label"
          valueKey="value"
          value={[{ label: 'a', value: 1 }]}
        />
      </Grommet>,
    );
    expect(screen.getByRole('option', { name: /a selected/ })).toBeVisible();
  });

  test('search with select and clear', () => {
    render(<TestManyOptions />);

    // open drop
    fireEvent.click(screen.getByRole('button', { name: /Select/ }));
    const search = screen.getByRole('searchbox', { name: /Search/ });
    const selectAll = screen.getByRole('button', { name: /Select all/ });
    // search
    fireEvent.change(search, { target: { value: 'p' } });
    // select all
    fireEvent.click(selectAll);

    expect(
      screen.queryByRole('option', { name: /Apple selected/ }),
    ).not.toBeNull();
    expect(
      screen.queryByRole('option', { name: /Grape selected/ }),
    ).not.toBeNull();
    expect(
      screen.queryByRole('option', { name: /Raspberry selected/ }),
    ).not.toBeNull();

    // search
    fireEvent.change(search, { target: { value: 'w' } });
    // select all
    fireEvent.click(selectAll);
    expect(
      screen.queryByRole('option', { name: /Strawberry selected/ }),
    ).not.toBeNull();
    expect(
      screen.queryByRole('option', { name: /Kiwi selected/ }),
    ).not.toBeNull();

    // search
    fireEvent.change(search, { target: { value: 'b' } });
    // Clear
    fireEvent.click(screen.getByRole('button', { name: /Clear all/ }));
    // clear search
    fireEvent.change(search, { target: { value: '' } });
    expect(
      screen.queryByRole('option', { name: /Grape selected/ }),
    ).not.toBeNull();
    expect(
      screen.queryByRole('option', { name: /Strawberry selected/ }),
    ).toBeNull();
  });

  test('should display custom messages', async () => {
    const user = userEvent.setup();
    const defaultOptions = [
      'Apple',
      'Orange',
      'Banana',
      'Grape',
      'Melon',
      'Strawberry',
      'Kiwi',
      'Mango',
      'Raspberry',
      'Rhubarb',
    ];
    const Test = () => {
      const [options, setOptions] = useState(defaultOptions);
      const [valueMultiple, setValueMultiple] = useState([]);
      return (
        <Grommet>
          <SelectMultiple
            options={options}
            value={valueMultiple}
            placeholder="Select"
            onClose={() => setOptions(defaultOptions)}
            onChange={({ value }) => {
              setValueMultiple(value);
            }}
            messages={{
              clearAll: 'Clear ALL',
              summarizedValue: 'Multiple Selected',
              selected: '{selected} SELECTED',
              selectedOfTotal: '{selected} of {total} SELECTED',
              selectAll: 'Select ALL',
            }}
          />
        </Grommet>
      );
    };
    const { asFragment } = render(<Test />);

    await user.click(screen.getByRole('button', { name: /Select/ }));
    await user.click(screen.getByRole('option', { name: /Apple/i }));
    await user.click(screen.getByRole('option', { name: /Banana/i }));
    await user.click(screen.getByRole('option', { name: /Grape/i }));
    expect(asFragment()).toMatchSnapshot();

    await user.click(screen.getByRole('button', { name: /Clear ALL/i }));
    expect(asFragment()).toMatchSnapshot();

    await user.click(screen.getByRole('button', { name: /Select ALL/i }));
    expect(asFragment()).toMatchSnapshot();
  });

  test('additional options onSearch', () => {
    jest.useFakeTimers();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    render(
      <Grommet>
        <TestOnSearch />
      </Grommet>,
    );
    // open SelectMultiple
    fireEvent.click(screen.getByRole('button', { name: /Open Drop/i }));
    // search for 'c'
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'c' },
    });
    act(() => jest.advanceTimersByTime(200)); // wait for options to update
    // select 'c'
    fireEvent.click(screen.getByRole('option', { name: /c not selected/i }));
    // expect option 'c' to be selected
    expect(screen.queryByRole('option', { name: /c selected/ })).not.toBeNull();
  });
});

describe('SelectMultiple with portal', () => {
  window.scrollTo = jest.fn();
  beforeEach(createPortal);

  test('disabled option', () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    render(
      <Grommet>
        <SelectMultiple
          id="test-select__drop"
          options={[0, 1, 2]}
          disabled={[1]}
          sortSelectedOnClose
        />
      </Grommet>,
    );
    // open SelectMultiple
    fireEvent.click(screen.getByRole('button', { name: /Open Drop/i }));
    // try to click all the options
    fireEvent.click(screen.getByRole('option', { name: /0/i }));
    fireEvent.click(screen.getByRole('option', { name: /1/i }));
    fireEvent.click(screen.getByRole('option', { name: /2/i }));

    // only 2 options should be selected (0 and 2)
    expectPortal('test-select__drop').toMatchSnapshot();
  });

  test('limit', () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    render(
      <Grommet>
        <SelectMultiple id="test-select__drop" options={[0, 1, 2]} limit={2} />
      </Grommet>,
    );
    // open SelectMultiple
    fireEvent.click(screen.getByRole('button', { name: /Open Drop/i }));
    // select 2 options
    fireEvent.click(screen.getByRole('option', { name: /0/i }));
    fireEvent.click(screen.getByRole('option', { name: /1/i }));
    fireEvent.click(screen.getByRole('option', { name: /2/i }));

    // option 2 should be disabled
    expectPortal('test-select__drop').toMatchSnapshot();
  });

  test('select all and clear', () => {
    render(
      <Grommet>
        <SelectMultiple
          id="test-select__drop"
          options={['one', 'two', 'three', 'four']}
          valueKey={{ key: 'value', reduce: true }}
        />
      </Grommet>,
    );

    fireEvent.click(screen.getByRole('button', { name: /Open Drop/i }));
    fireEvent.click(screen.getByRole('button', { name: /Select All/i }));

    expectPortal('test-select__drop').toMatchSnapshot();

    fireEvent.click(screen.getByRole('button', { name: /Clear All/i }));

    expectPortal('test-select__drop').toMatchSnapshot();
  });

  test('empty options', () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    render(
      <Grommet>
        <SelectMultiple id="test-select__drop" options={[]} />
      </Grommet>,
    );
    // open SelectMultiple
    fireEvent.click(screen.getByRole('button', { name: /Open Drop/i }));

    expectPortal('test-select__drop').toMatchSnapshot();
  });

  const TestOnLimit = () => {
    const defaultOptions = ['0', '1', '2', '3', '01', '02'];
    const [options, setOptions] = useState(defaultOptions);
    return (
      <SelectMultiple
        onSearch={(text) => {
          const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
          const exp = new RegExp(escapedText, 'i');
          setOptions(defaultOptions.filter((o) => exp.test(o)));
        }}
        id="test-select__drop"
        options={options}
        limit={2}
      />
    );
  };

  test.only('limit with SelectAll', async () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    render(
      <Grommet>
        <TestOnLimit />
      </Grommet>,
    );
    // Open SelectMultiple
    fireEvent.click(screen.getByRole('button', { name: /Open Drop/i }));

    // Check if selectAll buttons exist
    const selectAllButton = screen.queryByRole('button', {
      name: /Select All/i,
    });

    expect(selectAllButton).toBeNull();

    // Select an option
    fireEvent.click(screen.getByRole('option', { name: /3/i }));
    // open search
    const input = screen.getByRole('searchbox');
    // type 0
    fireEvent.change(input, { target: { value: '0' } });
    expect(selectAllButton).toBeNull();
    fireEvent.change(input, { target: { value: '05' } });
    expect(selectAllButton).toBeNull();
  });
});
