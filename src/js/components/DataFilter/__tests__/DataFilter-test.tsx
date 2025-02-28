import React from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'jest-styled-components';
import '@testing-library/jest-dom';
import { Data } from '../../Data';
import { DataFilters } from '../../DataFilters';
import { Grommet } from '../../Grommet';
import { TextInput } from '../../TextInput';
import { DataFilter } from '..';
import { Toolbar } from '../../Toolbar';
import { DataTable } from '../../DataTable';
import { createPortal } from '../../../utils/portal';

const data = [
  {
    name: 'aa',
    enabled: true,
    rating: 2.3,
    type: { name: 'ZZ', id: 1 },
    blank: '',
    zero: 0,
    total: 4,
  },
  {
    name: 'bb',
    enabled: false,
    rating: 4.3,
    type: { name: 'YY', id: 2 },
    blank: '',
    zero: 0,
    total: 200,
  },
  { name: 'cc', type: { name: 'ZZ', id: 1 }, blank: '', zero: 0, total: 35 },
];

describe('DataFilter', () => {
  window.scrollTo = jest.fn();
  beforeEach(createPortal);

  test('renders', () => {
    const { container } = render(
      <Grommet>
        <Data data={data}>
          <DataFilters>
            <DataFilter property="name" />
            <DataFilter property="enabled" />
            <DataFilter property="rating" />
            <DataFilter property="blank" />
            <DataFilter property="zero" />
          </DataFilters>
        </Data>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('options', () => {
    const { container } = render(
      <Grommet>
        <Data
          data={data}
          properties={{
            enabled: {
              label: 'Enabled',
              options: [
                { label: 'Enabled', value: true },
                { label: 'Disabled', value: false },
              ],
            },
            'type.name': {
              label: 'Type',
            },
          }}
        >
          <DataFilters>
            <DataFilter property="name" />
            <DataFilter property="enabled" />
            <DataFilter
              property="type.name"
              options={[
                { label: 'ZZ', value: 1 },
                { label: 'YY', value: 2 },
              ]}
            />
          </DataFilters>
        </Data>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('select multiple options', async () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    const user = userEvent.setup();
    const { asFragment } = render(
      <Grommet>
        <Data
          data={data}
          properties={{
            'type.name': {
              label: 'Type',
            },
          }}
        >
          <DataFilters drop>
            <DataFilter
              property="type.name"
              options={['ZZ', 'YY', 'aa', 'bb', 'cc']}
            />
          </DataFilters>
        </Data>
      </Grommet>,
    );

    const { getByRole } = screen;

    const filterButton = getByRole('button', { name: 'Open filters' });
    expect(filterButton).toBeTruthy();
    await user.click(filterButton);

    // open SelectMultiple
    const selectInput = getByRole('button', { name: /Open Drop/i });
    expect(selectInput).toBeTruthy();
    await user.click(selectInput);

    // click the first option 'ZZ'
    await user.click(getByRole('option', { name: /ZZ/i }));

    // close SelectMultiple
    await user.click(getByRole('button', { name: /Close Select/i }));

    // click Apply Filters button
    const applyFiltersButton = getByRole('button', { name: 'Apply filters' });
    expect(applyFiltersButton).toBeTruthy();
    await user.click(applyFiltersButton);

    // snapshot on selected filter
    expect(asFragment()).toMatchSnapshot();
  });

  test('select multiple options search', async () => {
    const user = userEvent.setup();
    const { asFragment } = render(
      <Grommet>
        <Data
          id="test-data"
          data={data}
          properties={{
            'type.name': {
              label: 'Type',
            },
          }}
        >
          <DataFilters drop>
            <DataFilter
              property="type.name"
              options={[
                'ZZ',
                'YY',
                'aa',
                'bb',
                'cc',
                'dd',
                'ee',
                'ff',
                'gg',
                'hh',
              ]}
            />
          </DataFilters>
        </Data>
      </Grommet>,
    );

    expect(asFragment()).toMatchSnapshot();
    const filterButton = screen.getByRole('button', { name: 'Open filters' });
    expect(filterButton).toBeTruthy();
    await user.click(filterButton);

    // open SelectMultiple
    const selectInput = screen.getByLabelText('Type');
    expect(selectInput).toBeTruthy();
    await user.click(selectInput);

    const searchInput = screen.getByLabelText(/Search to filter/);
    expect(searchInput).toBeTruthy();
  });

  test('range prop', () => {
    const { container } = render(
      <Grommet>
        <Data data={data}>
          <DataFilters>
            <DataFilter property="rating" range={{ min: 0, max: 5 }} />
          </DataFilters>
        </Data>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('range prop step', async () => {
    render(
      <Grommet>
        <Data data={data}>
          <DataFilters>
            <DataFilter
              property="total"
              range={{ step: 15, min: 0, max: 250 }}
            />
          </DataFilters>
        </Data>
      </Grommet>,
    );

    const lowerBound = screen.getByRole('slider', { name: 'Lower Bounds' });
    fireEvent.mouseDown(lowerBound);
    fireEvent.mouseMove(lowerBound, { clientX: 31, clientY: 20 });
    fireEvent.mouseUp(lowerBound);
    expect(lowerBound.getAttribute('aria-valuenow')).toEqual('45');
  });

  test('range step Data', () => {
    render(
      <Grommet>
        <Data
          data={data}
          properties={{
            total: {
              label: 'Total',
            },
          }}
        >
          <DataFilters>
            <DataFilter property="total" range={{ step: 15 }} />
          </DataFilters>
        </Data>
      </Grommet>,
    );

    const lowerBound = screen.getByRole('slider', { name: 'Lower Bounds' });
    fireEvent.mouseDown(lowerBound);
    fireEvent.mouseMove(lowerBound, { clientX: 31, clientY: 20 });
    fireEvent.mouseUp(lowerBound);
    expect(lowerBound.getAttribute('aria-valuenow')).toEqual('49');
  });

  test('range Data', () => {
    const { container } = render(
      <Grommet>
        <Data
          data={data}
          properties={{
            rating: {
              label: 'Rating',
              range: { min: 0, max: 5 },
            },
          }}
        >
          <DataFilters>
            <DataFilter property="rating" />
          </DataFilters>
        </Data>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('includes range min and max in filtered results', () => {
    const { getByRole } = render(
      <Grommet>
        <Data data={[{ age: 1 }, { age: 2 }, { age: 3 }, { age: 4 }]}>
          <DataFilters>
            <DataFilter range={{ min: 1, max: 4, step: 1 }} property="age" />
          </DataFilters>
          <DataTable />
        </Data>
      </Grommet>,
    );

    const lowerBound = screen.getByRole('slider', { name: 'Lower Bounds' });
    act(() => {
      lowerBound.focus();
    });
    fireEvent.keyDown(lowerBound, { key: 'Right', keyCode: 39 });
    const applyFiltersButton = getByRole('button', { name: 'Apply filters' });
    fireEvent.click(applyFiltersButton);

    expect(screen.queryByText('1')).not.toBeInTheDocument();
    expect(screen.queryAllByText('2')[1]).toBeInTheDocument();
  });

  test('children', () => {
    const { container } = render(
      <Grommet>
        <Data data={data}>
          <DataFilters>
            <DataFilter property="name">
              <TextInput />
            </DataFilter>
          </DataFilters>
        </Data>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('!inDataForm', () => {
    const { container } = render(
      <Grommet>
        <Data data={data}>
          <Toolbar>
            <DataFilter property="name" />
            <DataFilter property="enabled" />
            <DataFilter property="rating" />
          </Toolbar>
        </Data>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should allow filtering on multiple sub-properties from same parent property', () => {
    const { asFragment } = render(
      <Grommet>
        <Data
          data={data}
          properties={{
            'type.name': {
              label: 'Type',
            },
            'type.id': {
              label: 'ID',
            },
          }}
        >
          <DataFilters drop>
            <DataFilter
              property="type.name"
              options={['ZZ', 'YY', 'aa', 'bb', 'cc']}
            />
            <DataFilter property="type.id" options={['1', '2']} />
          </DataFilters>
        </Data>
      </Grommet>,
    );

    const { getByRole, getByLabelText } = screen;

    const filterButton = getByRole('button', { name: 'Open filters' });
    expect(filterButton).toBeTruthy();
    fireEvent.click(filterButton);

    // open SelectMultiple
    const selectInput = getByRole('button', { name: /Open Drop/i });
    expect(selectInput).toBeTruthy();
    fireEvent.click(selectInput);

    // click the first option 'ZZ'
    fireEvent.click(getByRole('option', { name: /ZZ/i }));

    // close SelectMultiple
    fireEvent.click(getByRole('button', { name: /Close Select/i }));

    const checkBox = getByLabelText(1);

    fireEvent.click(checkBox);

    // click Apply Filters button
    const applyFiltersButton = getByRole('button', { name: 'Apply filters' });
    expect(applyFiltersButton).toBeTruthy();
    fireEvent.click(applyFiltersButton);

    const updatedFilterButton = getByRole('button', {
      name: 'Open filters, 2 filters applied',
    });

    expect(updatedFilterButton).toBeTruthy();
    // snapshot on selected filter
    expect(asFragment()).toMatchSnapshot();
  });
});
