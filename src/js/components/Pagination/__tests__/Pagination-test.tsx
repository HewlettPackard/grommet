import React, { useState } from 'react';
import 'jest-styled-components';
import 'jest-axe/extend-expect';
import 'regenerator-runtime/runtime';
import 'jest-styled-components';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { render, fireEvent, screen } from '@testing-library/react';

import { Grommet } from '../../Grommet';
import { Select } from '../../Select';
import { Pagination } from '..';

const NUM_ITEMS = 237;
const STEP = 10;
const data: string[] = [];
for (let i = 0; i < 95; i += 1) {
  data.push(`entry-${i}`);
}

describe('Pagination', () => {
  test(`should display the correct last page based on items length
  and step`, () => {
    const { container, getByText } = render(
      <Grommet>
        <Pagination numberItems={NUM_ITEMS} />
      </Grommet>,
    );

    // default step is 10
    const expectedPageCount = Math.ceil(NUM_ITEMS / 10);
    const lastPageButton = getByText(expectedPageCount.toString());

    expect(lastPageButton).toBeTruthy();
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correct numberEdgePages', () => {
    const { container } = render(
      <Grommet>
        <Pagination numberItems={NUM_ITEMS} numberEdgePages={3} page={10} />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render outside grommet wrapper', () => {
    const { container } = render(
      <Pagination numberItems={NUM_ITEMS} page={10} />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correct numberMiddlePages when odd', () => {
    const { container } = render(
      <Grommet>
        <Pagination numberItems={NUM_ITEMS} numberMiddlePages={5} page={10} />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correct numberMiddlePages when even', () => {
    const { container } = render(
      <Grommet>
        <Pagination numberItems={NUM_ITEMS} numberMiddlePages={4} page={10} />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should show correct page when "page" is provided ', () => {});

  test(`should disable previous and next controls when numberItems
  < step`, () => {
    const { container } = render(
      <Grommet>
        <Pagination numberItems={10} step={20} />
      </Grommet>,
    );

    const previousButtonDisabled = (
      container.querySelector(
        `[aria-label="Go to previous page"]`,
      ) as HTMLButtonElement
    ).hasAttribute('disabled');
    const nextButtonDisabled = (
      container.querySelector(
        `[aria-label="Go to next page"]`,
      ) as HTMLButtonElement
    ).hasAttribute('disabled');

    expect(previousButtonDisabled).toBeTruthy();
    expect(nextButtonDisabled).toBeTruthy();
    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should disable previous and next controls when numberItems
  === step`, () => {
    const { container } = render(
      <Grommet>
        <Pagination numberItems={20} step={20} />
      </Grommet>,
    );

    const previousButtonDisabled = (
      container.querySelector(
        `[aria-label="Go to previous page"]`,
      ) as HTMLButtonElement
    ).hasAttribute('disabled');
    const nextButtonDisabled = (
      container.querySelector(
        `[aria-label="Go to next page"]`,
      ) as HTMLButtonElement
    ).hasAttribute('disabled');

    expect(previousButtonDisabled).toBeTruthy();
    expect(nextButtonDisabled).toBeTruthy();
    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should disable previous and next controls when numberItems
  === 0`, () => {
    const { container } = render(
      <Grommet>
        <Pagination numberItems={0} />
      </Grommet>,
    );

    const previousButtonDisabled = (
      container.querySelector(
        `[aria-label="Go to previous page"]`,
      ) as HTMLButtonElement
    ).hasAttribute('disabled');
    const nextButtonDisabled = (
      container.querySelector(
        `[aria-label="Go to next page"]`,
      ) as HTMLButtonElement
    ).hasAttribute('disabled');

    expect(previousButtonDisabled).toBeTruthy();
    expect(nextButtonDisabled).toBeTruthy();
    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should set page to last page if page prop > total possible
  pages`, () => {
    const numberItems = 500;
    const step = 50;
    const { container, getByText } = render(
      <Grommet>
        <Pagination numberItems={numberItems} step={step} page={700} />
      </Grommet>,
    );

    const expectedPage = `${Math.ceil(numberItems / step)}`;
    fireEvent.click(getByText(expectedPage));
    const activePage = (
      container.querySelector(`[aria-current="page"]`) as HTMLButtonElement
    ).innerHTML;

    expect(activePage).toEqual(expectedPage);
    expect(container.firstChild).toMatchSnapshot();
  });

  // how to not hard code so many values
  test(`should allow user to control page via state with page +
  onChange`, () => {
    const onChange = jest.fn();
    const { container, getByLabelText } = render(
      <Grommet>
        <Pagination numberItems={NUM_ITEMS} page={1} onChange={onChange} />
      </Grommet>,
    );

    const nextPageButton = getByLabelText('Go to next page');
    fireEvent.click(nextPageButton);

    // step is 10 by default, so startIndex/endIndex are based on that
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2, startIndex: 10, endIndex: 20 }),
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should display next page of results when "next" is
  selected`, () => {
    const onChange = jest.fn();
    const { container, getByLabelText } = render(
      <Grommet>
        <Pagination numberItems={NUM_ITEMS} onChange={onChange} />
      </Grommet>,
    );

    const nextPageButton = getByLabelText('Go to next page');

    // mouse click
    fireEvent.click(nextPageButton);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(container.firstChild).toMatchSnapshot();

    // keyboard enter
    fireEvent.keyDown(nextPageButton, {
      key: 'Enter',
      keyCode: 13,
      which: 13,
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should display previous page of results when "previous" is
  selected`, () => {
    const onChange = jest.fn();
    const { container, getByLabelText } = render(
      <Grommet>
        <Pagination numberItems={NUM_ITEMS} page={3} onChange={onChange} />
      </Grommet>,
    );

    const previousPageButton = getByLabelText('Go to previous page');

    // mouse click
    fireEvent.click(previousPageButton);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(container.firstChild).toMatchSnapshot();

    // keyboard enter
    fireEvent.keyDown(previousPageButton, {
      key: 'Enter',
      keyCode: 13,
      which: 13,
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should display page 'n' of results when "page n" is
  selected`, () => {
    const { container, getByText } = render(
      <Grommet>
        <Pagination numberItems={NUM_ITEMS} />
      </Grommet>,
    );

    const desiredPage = '2';
    fireEvent.click(getByText(desiredPage));
    const activePage = (
      container.querySelector(`[aria-current="page"]`) as HTMLButtonElement
    ).innerHTML;

    expect(activePage).toEqual(desiredPage);
    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should disable previous button if on first page`, () => {
    const { container } = render(
      <Grommet>
        <Pagination numberItems={NUM_ITEMS} />
      </Grommet>,
    );

    const previousButtonDisabled = (
      container.querySelector(
        `[aria-label="Go to previous page"]`,
      ) as HTMLButtonElement
    ).hasAttribute('disabled');

    expect(previousButtonDisabled).toBeTruthy();
    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should disable next button if on last page`, () => {
    const lastPage = Math.ceil(NUM_ITEMS / STEP);
    const { container } = render(
      <Grommet>
        <Pagination numberItems={NUM_ITEMS} page={lastPage} />
      </Grommet>,
    );

    const nextButtonDisabled = (
      container.querySelector(
        `[aria-label="Go to next page"]`,
      ) as HTMLButtonElement
    ).hasAttribute('disabled');

    expect(nextButtonDisabled).toBeTruthy();
    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should set numberMiddlePages = 1 if user provides value < 1`, () => {
    console.warn = jest.fn();
    const { container } = render(
      <Grommet>
        <Pagination numberItems={NUM_ITEMS} numberMiddlePages={0} />
      </Grommet>,
    );

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should apply custom theme`, () => {
    const customTheme = {
      pagination: {
        container: {
          extend: `background: red;`,
        },
      },
    };

    const { container } = render(
      <Grommet theme={customTheme}>
        <Pagination numberItems={NUM_ITEMS} />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should apply button kind style when referenced by a string`, () => {
    const customTheme = {
      button: {
        default: {},
        bright: {
          color: 'text-strong',
          border: {
            color: 'skyblue',
            width: '2px',
          },
        },
        active: {
          bright: {
            background: {
              color: '#CA9CEA',
            },
            border: {
              color: 'transparent',
            },
            color: 'text',
          },
        },
      },
      pagination: {
        button: 'bright',
      },
    };

    const { container } = render(
      <Grommet theme={customTheme}>
        <Pagination numberItems={NUM_ITEMS} />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should apply size`, () => {
    const { container } = render(
      <Grommet>
        <Pagination numberItems={NUM_ITEMS} />
        <Pagination numberItems={NUM_ITEMS} size="small" />
        <Pagination numberItems={NUM_ITEMS} size="large" />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should change the page on prop change`, () => {
    const { container, rerender } = render(
      <Grommet>
        <Pagination numberItems={NUM_ITEMS} page={1} />
      </Grommet>,
    );

    expect(
      (container.querySelector(`[aria-current="page"]`) as HTMLButtonElement)
        .innerHTML,
    ).toBe('1');

    rerender(
      <Grommet>
        <Pagination numberItems={NUM_ITEMS} page={2} />
      </Grommet>,
    );

    expect(
      (container.querySelector(`[aria-current="page"]`) as HTMLButtonElement)
        .innerHTML,
    ).toBe('2');
    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should apply a11yTitle and aria-label`, () => {
    const { container, getByLabelText } = render(
      <Grommet>
        <Pagination a11yTitle="pagination-test" numberItems={NUM_ITEMS} />
        <Pagination aria-label="pagination-test-2" numberItems={NUM_ITEMS} />
      </Grommet>,
    );

    expect(getByLabelText('pagination-test')).toBeTruthy();
    expect(getByLabelText('pagination-test-2')).toBeTruthy();
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should apply a select component with default values for stepOptions', async () => {
    window.scrollTo = jest.fn();
    const user = userEvent.setup();
    const { asFragment } = render(
      <Grommet>
        <Pagination
          border={{ color: 'skyblue', side: 'top' }}
          numberItems={NUM_ITEMS}
          stepOptions
        />
      </Grommet>,
    );
    // open stepOptions
    await user.click(screen.getByRole('button', { name: /Open Drop/i }));
    // click on first option
    await user.click(screen.getByRole('option', { name: /50/i }));
    // expect input value to be 50
    const updatedSelectButton = screen.getByRole('button', {
      name: 'Open Drop; Selected: 50',
    });
    expect(updatedSelectButton).toBeTruthy();
    expect(asFragment()).toMatchSnapshot();
  });

  test('should apply a select component with custom values for stepOptions', async () => {
    window.scrollTo = jest.fn();
    const user = userEvent.setup();
    render(
      <Grommet>
        <Pagination
          numberItems={NUM_ITEMS}
          stepOptions={[10, 20, 30, 40, 50]}
        />
      </Grommet>,
    );
    // open stepOptions
    await user.click(screen.getByRole('button', { name: /Open Drop/i }));
    // click on first option
    await user.click(screen.getByRole('option', { name: /10/i }));
    // expect input value to be 10
    const updatedSelectButton = screen.getByRole('button', {
      name: 'Open Drop; Selected: 10',
    });
    expect(updatedSelectButton).toBeTruthy();
  });

  test('should respect stepOptions and controlled step', async () => {
    window.scrollTo = jest.fn();
    const user = userEvent.setup();
    const App = () => {
      const [step, setStep] = useState(10);
      return (
        <Grommet>
          <Select
            a11yTitle="Controlled select"
            options={[10, 25, 50, 100]}
            onChange={({ option }) => setStep(option)}
          />
          <Pagination numberItems={NUM_ITEMS} step={step} stepOptions />
        </Grommet>
      );
    };
    render(<App />);
    await user.click(
      screen.getByRole('button', { name: /Controlled select/i }),
    );
    await user.click(screen.getByRole('option', { name: '50' }));
    // stepOptions should have updated
    const updatedSelectButton = screen.getByRole('button', {
      name: 'Open Drop; Selected: 50',
    });
    expect(updatedSelectButton).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Go to page 5' })).toBeTruthy();
    // there should only be 5 pages based on step = 50 and NUM_ITEMS
    expect(
      screen.queryByRole('button', { name: 'Go to page 6' }),
    ).not.toBeInTheDocument();
    await user.click(updatedSelectButton);
    await user.click(screen.getByRole('option', { name: '25' }));
    expect(screen.getByRole('button', { name: 'Go to page 10' })).toBeTruthy();
    // there should only be 10 pages based on step = 25 and NUM_ITEMS
    expect(
      screen.queryByRole('button', { name: 'Go to page 11' }),
    ).not.toBeInTheDocument();
  });

  test('should apply a text component with summary', () => {
    const { asFragment } = render(
      <Grommet>
        <Pagination numberItems={NUM_ITEMS} summary />
      </Grommet>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('should update summary when page changes', () => {
    render(
      <Grommet>
        <Pagination numberItems={NUM_ITEMS} summary />
      </Grommet>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Go to page 2' }));
    expect(screen.getByText(`Showing 11-20 of ${NUM_ITEMS}`)).toBeTruthy();
  });

  test('should have no items', () => {
    const { asFragment } = render(
      <Grommet>
        <Pagination numberItems={0} summary />
      </Grommet>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  const TestComponent = () => {
    const NUM_ITEMS = 100;
    const [itemPerPage, setItemPerPage] = useState(20); // Initialize itemPerPage state

    return (
      <Grommet>
        <Select
          options={[10, 20, 50, 100]}
          value={itemPerPage} // Set value of Select to itemPerPage
          onChange={({ option }) => {
            // Update itemPerPage state when Select value changes
            setItemPerPage(option);
          }}
        />
        <Pagination step={itemPerPage} numberItems={NUM_ITEMS} summary />
      </Grommet>
    );
  };

  test('should update page range based on step prop dynamically changing', async () => {
    render(<TestComponent />);
    // Open select
    await userEvent.click(screen.getByRole('button', { name: /Open Drop/i }));
    // Click on the option '10'
    await userEvent.click(screen.getByRole('option', { name: '10' }));

    // Expect input value to be 10
    const updatedSelectButton = screen.getByRole('button', {
      name: 'Open Drop; Selected: 10',
    });
    expect(updatedSelectButton).toBeTruthy();
    expect(screen.getByText(`Showing 1-10 of 100`)).toBeTruthy();

    // Open select again
    await userEvent.click(screen.getByRole('button', { name: /Open Drop/i }));

    // Click on the option '50'
    await userEvent.click(screen.getByRole('option', { name: /50/i }));

    // Expect input value to be 50
    const updatedSelectButton1 = screen.getByRole('button', {
      name: 'Open Drop; Selected: 50',
    });
    expect(updatedSelectButton1).toBeTruthy();
    expect(screen.getByText(`Showing 1-50 of 100`)).toBeTruthy();

    // Open select again
    await userEvent.click(screen.getByRole('button', { name: /Open Drop/i }));

    // Click on the option '100'
    await userEvent.click(screen.getByRole('option', { name: /100/i }));

    // Expect input value to be 100
    const updatedSelectButton2 = screen.getByRole('button', {
      name: 'Open Drop; Selected: 100',
    });
    expect(updatedSelectButton2).toBeTruthy();
    expect(screen.getByText(`Showing 1-100 of 100`)).toBeTruthy();
  });
});
