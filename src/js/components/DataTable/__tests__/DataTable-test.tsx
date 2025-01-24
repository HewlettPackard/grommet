import React, { useState } from 'react';
import 'jest-styled-components';
import { render, fireEvent, screen } from '@testing-library/react';

import { Grommet } from '../../Grommet';
import { Box } from '../../Box';
import { Button } from '../../Button';
import { Data } from '../../Data';
import { Pagination } from '../../Pagination';
import { Text } from '../../Text';
import { DataTable, Sections, SortType } from '..';
import { BackgroundType, BorderType } from '../../../utils';

interface TestDataItem {
  a: string;
  b: number;
  c?: string;
}

const DATA: TestDataItem[] = [];
for (let i = 0; i < 95; i += 1) {
  DATA.push({
    a: `entry-${i}`,
    b: i,
    c: i === 0 || i === 1 || i === 35 || i === 50 ? 'option 1' : 'option 2',
  });
}

describe('DataTable', () => {
  test('empty', () => {
    const { container } = render(
      <Grommet>
        <DataTable />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders outside grommet wrapper', () => {
    const { container } = render(<DataTable />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('basic', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('!primaryKey', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
          primaryKey={false}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('paths', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b.c', header: 'B' },
          ]}
          data={[
            { a: 'one', b: { c: 1 } },
            { a: 'two', b: { c: 2 } },
          ]}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('primaryKey', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
          primaryKey="b"
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('footer', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A', footer: 'Total' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('footer node', () => {
    const { getByText } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A', footer: <span>Total</span> },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
        />
      </Grommet>,
    );

    expect(getByText('Total')).not.toBeNull();
  });

  test('sortable', () => {
    const { container, getByText } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'zero', b: 0 },
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
          sortable
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();

    const headerCell = getByText('A');
    fireEvent.click(headerCell, {});
    expect(container.firstChild).toMatchSnapshot();
  });

  test('sort null data', () => {
    const { container, getByText } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
            { property: 'c', header: 'C' },
            { property: 'd', header: 'D' },
          ]}
          data={[
            { a: undefined, b: 0, c: 'first', d: 'y' },
            { a: 'one', b: 1, c: null },
            { a: 'two', b: 2, c: 'second' },
            { a: undefined, b: 3, c: null, d: 'z' },
          ]}
          sortable
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();

    let headerCell = getByText('A');
    fireEvent.click(headerCell, {});
    expect(container.firstChild).toMatchSnapshot();
    headerCell = getByText('C');
    fireEvent.click(headerCell, {});
    expect(container.firstChild).toMatchSnapshot();
    headerCell = getByText('D');
    fireEvent.click(headerCell, {});
    expect(container.firstChild).toMatchSnapshot();
  });

  test('onSort', () => {
    const onSort = jest.fn();
    const { container, getByText } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'zero', b: 0 },
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
          onSort={onSort}
          sortable
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();

    const headerCell = getByText('A');
    fireEvent.click(headerCell, {});
    expect(onSort).toBeCalledWith(
      expect.objectContaining({ property: 'a', direction: 'asc' }),
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('onSort external', () => {
    const onSort = jest.fn();
    const { container, getByText } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'zero', b: 0 },
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
          onSort={onSort}
          sort={{ property: 'a', direction: 'asc', external: true }}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();

    const headerCell = getByText('A');
    fireEvent.click(headerCell, {});
    expect(onSort).toBeCalledWith(
      expect.objectContaining({
        property: 'a',
        direction: 'desc',
        external: true,
      }),
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('sort', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'zero', b: 0 },
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
          sort={{ property: 'a', direction: 'asc' }}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('sort controlled', () => {
    const Test = () => {
      const [sort, setSort] = React.useState<SortType>({
        property: 'a',
        direction: 'asc',
      });

      return (
        <Grommet>
          <Button
            label="Sort data"
            onClick={() => setSort({ property: 'a', direction: 'desc' })}
          />
          <DataTable
            columns={[
              { property: 'a', header: 'A' },
              { property: 'b', header: 'B' },
            ]}
            data={[
              { a: 'zero', b: 0 },
              { a: 'one', b: 1 },
              { a: 'two', b: 2 },
            ]}
            sort={sort}
          />
        </Grommet>
      );
    };
    const { asFragment } = render(<Test />);
    expect(asFragment()).toMatchSnapshot();

    const sortButton = screen.getByRole('button', { name: 'Sort data' });
    fireEvent.click(sortButton);

    expect(asFragment()).toMatchSnapshot();
  });

  test('sort nested object', () => {
    const { container, getByText } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            {
              property: 'b.value',
              header: 'Value',
              render: (datum) => datum.b && datum.b.value,
            },
          ]}
          data={[
            { a: 'zero', b: { value: 1 } },
            { a: 'one', b: { value: 2 } },
            { a: 'two', b: { value: 3 } },
          ]}
          sort={{ property: 'b.value', direction: 'asc' }}
        />
      </Grommet>,
    );

    expect(container.querySelectorAll('td').item(0).textContent).toBe('1');
    expect(container.querySelectorAll('td').item(1).textContent).toBe('2');
    expect(container.querySelectorAll('td').item(2).textContent).toBe('3');

    fireEvent.click(getByText('Value'));

    expect(container.querySelectorAll('td').item(0).textContent).toBe('3');
    expect(container.querySelectorAll('td').item(1).textContent).toBe('2');
    expect(container.querySelectorAll('td').item(2).textContent).toBe('1');

    expect(container.firstChild).toMatchSnapshot();
  });

  test('sort nested object with onSort', () => {
    const onSort = jest.fn();
    const { container, getByText } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            {
              property: 'b.value',
              header: 'Value',
              render: (datum) => datum.b && datum.b.value,
            },
          ]}
          data={[
            { a: 'zero', b: { value: 1 } },
            { a: 'one', b: { value: 2 } },
            { a: 'two', b: { value: 3 } },
          ]}
          onSort={onSort}
          sort={{ property: 'b.value', direction: 'asc' }}
        />
      </Grommet>,
    );

    expect(container.querySelectorAll('td').item(0).textContent).toBe('1');
    expect(container.querySelectorAll('td').item(1).textContent).toBe('2');
    expect(container.querySelectorAll('td').item(2).textContent).toBe('3');

    fireEvent.click(getByText('Value'));

    expect(onSort).toBeCalledWith(
      expect.objectContaining({ property: 'b.value' }),
    );

    expect(container.querySelectorAll('td').item(0).textContent).toBe('3');
    expect(container.querySelectorAll('td').item(1).textContent).toBe('2');
    expect(container.querySelectorAll('td').item(2).textContent).toBe('1');

    expect(container.firstChild).toMatchSnapshot();
  });

  test('sort external', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'zero', b: 0 },
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
          sort={{ property: 'a', direction: 'asc', external: true }}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('search', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[{ property: 'a', header: 'A', search: true }]}
          data={[{ a: 'Alpha' }, { a: 'beta' }, { a: '[]' }]}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
    fireEvent.click(
      container.querySelector(
        '[aria-label="Open search by a"]',
      ) as HTMLButtonElement,
    );
    const searchInput = container.querySelector(
      '[name="search-a"]',
    ) as HTMLInputElement;
    expect(document.activeElement).toBe(searchInput);
    fireEvent.change(searchInput, {
      target: { value: '[' },
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  test('resizeable', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
          resizeable
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('aggregate', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            {
              property: 'b',
              header: 'B',
              aggregate: 'sum',
              footer: { aggregate: true },
            },
          ]}
          data={[
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('aggregate with nested object', () => {
    const { container, getByText } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            {
              property: 'obj.value',
              header: 'object',
              aggregate: 'sum',
              footer: { aggregate: true },
            },
            {
              property: 'obj2.value',
              header: 'object 2',
              render: (datum) => datum.obj2.value,
            },
          ]}
          data={[
            { a: 'one', obj: { value: 1 }, obj2: { value: 10 } },
            { a: 'two', obj: { value: 2 }, obj2: { value: 20 } },
          ]}
        />
      </Grommet>,
    );
    expect(getByText('3')).toBeTruthy();
    expect(container.firstChild).toMatchSnapshot();
  });

  test('rowDetails', () => {
    const { container, getAllByLabelText } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'one', b: 1.1 },
            { a: 'one', b: 1.2 },
            { a: 'two', b: 2.1 },
            { a: 'two', b: 2.2 },
          ]}
          rowDetails={(row) => <Box>{row.a}</Box>}
          primaryKey="b"
        />
      </Grommet>,
    );
    const expandButtons = getAllByLabelText('expand', { exact: false });
    fireEvent.click(expandButtons[1], {});
    expect(container.firstChild).toMatchSnapshot();
  });

  test('rowDetails condtional', () => {
    const { container, getAllByLabelText } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'one', b: 1.1 },
            { a: 'one', b: 1.2 },
            { a: 'two', b: 2.1 },
            { a: 'two', b: 2.2 },
          ]}
          rowDetails={(row: TestDataItem) => {
            if (row.b === 1.1) {
              return <Box> {row.a} </Box>;
            }
            return (
              <Box>
                {row.a} : {row.b}{' '}
              </Box>
            );
          }}
          primaryKey="b"
        />
      </Grommet>,
    );
    const expandButtons = getAllByLabelText('expand', { exact: false });
    fireEvent.click(expandButtons[1], {});
    expect(container.firstChild).toMatchSnapshot();
  });

  test('groupBy', () => {
    const { container, getByText } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'one', b: 1.1 },
            { a: 'one', b: 1.2 },
            { a: 'two', b: 2.1 },
            { a: 'two', b: 2.2 },
          ]}
          groupBy="a"
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();

    const headerCell = getByText('A');
    fireEvent.click(headerCell, {});
    expect(container.firstChild).toMatchSnapshot();
  });

  test('groupBy 0 value', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
            { property: 'c', header: 'C' },
          ]}
          data={[
            { a: 'one', b: 1.1, c: 0 },
            { a: 'two', b: 1.2, c: 0 },
            { a: 'three', b: 2.1, c: 1 },
            { a: 'four', b: 2.2, c: 2 },
          ]}
          groupBy="c"
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('groupBy toggle', () => {
    function TestComponent() {
      const [groupBy, setGroupBy] = React.useState<string | undefined>();
      const toggle = () => setGroupBy(groupBy === undefined ? 'a' : undefined);

      return (
        <Grommet>
          <button type="button" onClick={toggle}>
            toggle
          </button>
          <DataTable
            columns={[
              { property: 'a', header: 'A' },
              { property: 'b', header: 'B', primary: true },
            ]}
            data={[
              { a: 'one', b: 1.1 },
              { a: 'one', b: 1.2 },
              { a: 'two', b: 2.1 },
              { a: 'two', b: 2.2 },
            ]}
            groupBy={groupBy}
          />
        </Grommet>
      );
    }
    const { container, getByText } = render(<TestComponent />);
    expect(container.firstChild).toMatchSnapshot();

    fireEvent.click(getByText('toggle'));
    expect(container.firstChild).toMatchSnapshot();

    fireEvent.click(getByText('toggle'));
    expect(container.firstChild).toMatchSnapshot();
  });

  test('click', () => {
    const onClickRow = jest.fn();
    const { container, getByText } = render(
      <Grommet>
        <DataTable
          columns={[{ property: 'a', header: 'A' }]}
          data={[{ a: 'alpha' }, { a: 'beta' }]}
          onClickRow={onClickRow}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
    fireEvent.click(getByText('beta'));
    expect(onClickRow).toBeCalledWith(
      expect.objectContaining({ datum: { a: 'beta' } }),
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('disabled click', () => {
    const onClickRow = jest.fn();
    const { container, getByText } = render(
      <Grommet>
        <DataTable
          columns={[{ property: 'a', header: 'A' }]}
          data={[{ a: 'alpha' }, { a: 'beta' }]}
          disabled={['alpha']}
          onClickRow={onClickRow}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
    fireEvent.click(getByText('beta'));
    expect(onClickRow).toBeCalledWith(
      expect.objectContaining({ datum: { a: 'beta' } }),
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('background', () => {
    const backgrounds: (
      | BackgroundType
      | BackgroundType[]
      | Sections<BackgroundType | string[], BackgroundType, BackgroundType>
    )[] = [
      'accent-1',
      ['accent-1', 'accent-2'],
      { header: 'accent-1', body: 'accent-2', footer: 'accent-3' },
    ];
    const { container } = render(
      <Grommet>
        {backgrounds.map((background) => (
          <DataTable
            key={JSON.stringify(background)}
            columns={[
              { property: 'a', header: 'A', footer: 'Total' },
              { property: 'b', header: 'B' },
            ]}
            data={[
              { a: 'one', b: 1 },
              { a: 'two', b: 2 },
            ]}
            background={background}
          />
        ))}
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('border', () => {
    const borders: (BorderType | Sections<BorderType>)[] = [
      true,
      'top',
      { color: 'accent-1', side: 'top', size: 'small' },
      {
        header: 'top',
        body: { color: 'accent-1', side: 'top', size: 'small' },
      },
    ];
    const { container } = render(
      <Grommet>
        {borders.map((border) => (
          <DataTable
            key={JSON.stringify(border)}
            columns={[
              { property: 'a', header: 'A', footer: 'Total' },
              { property: 'b', header: 'B' },
            ]}
            data={[
              { a: 'one', b: 1 },
              { a: 'two', b: 2 },
            ]}
            border={border}
          />
        ))}
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('pad', () => {
    const { container } = render(
      <Grommet>
        {[
          'small',
          { vertical: 'small', horizontal: 'medium' },
          {
            header: 'small',
            body: { vertical: 'small', horizontal: 'medium' },
          },
        ].map((pad) => (
          <DataTable
            key={JSON.stringify(pad)}
            columns={[
              { property: 'a', header: 'A', footer: 'Total' },
              { property: 'b', header: 'B' },
            ]}
            data={[
              { a: 'one', b: 1 },
              { a: 'two', b: 2 },
            ]}
            pad={pad}
          />
        ))}
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('rowProps', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A', footer: 'Total' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
          rowProps={{
            one: { background: 'accent-1', border: 'bottom', pad: 'large' },
          }}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('groupBy property', () => {
    const { container, getByText } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'one', b: 1.1 },
            { a: 'one', b: 1.2 },
            { a: 'two', b: 2.1 },
            { a: 'two', b: 2.2 },
          ]}
          groupBy={{ property: 'a' }}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();

    const headerCell = getByText('A');
    fireEvent.click(headerCell, {});
    expect(container.firstChild).toMatchSnapshot();
  });

  test('groupBy expand', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'one', b: 1.1 },
            { a: 'one', b: 1.2 },
            { a: 'two', b: 2.1 },
            { a: 'two', b: 2.2 },
          ]}
          primaryKey="b"
          groupBy={{ property: 'a', expand: ['one'] }}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('groupBy onExpand', () => {
    const onExpand = jest.fn((groupState) => groupState);
    const { getAllByLabelText } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'one', b: 1.1 },
            { a: 'one', b: 1.2 },
            { a: 'two', b: 2.1 },
            { a: 'two', b: 2.2 },
          ]}
          primaryKey="b"
          groupBy={{ property: 'a', onExpand }}
        />
      </Grommet>,
    );

    const expandButtons = getAllByLabelText('expand', { exact: false });
    fireEvent.click(expandButtons[1], {});

    expect(onExpand).toBeCalled();
    expect(onExpand.mock.results[0].value).toEqual(['one']);
    expect(onExpand.mock.results[0].value).toMatchSnapshot();
  });

  test('replace', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'one', b: 1.1 },
            { a: 'one', b: 1.2 },
            { a: 'two', b: 2.1 },
            { a: 'two', b: 2.2 },
          ]}
          primaryKey="b"
          step={2}
          replace
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('themeColumnSizes', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A', size: 'medium' },
            { property: 'b', header: 'B', size: 'small' },
          ]}
          data={[
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('absoluteColumnSizes', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A', size: '400px' },
            { property: 'b', header: 'B', size: '200px' },
          ]}
          data={[
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('relativeColumnSizes', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A', size: '2/3' },
            { property: 'b', header: 'B', size: '1/3' },
          ]}
          data={[
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('fill', () => {
    const fills: (boolean | 'vertical' | 'horizontal')[] = [
      true,
      'horizontal',
      'vertical',
    ];
    const { container } = render(
      <Grommet>
        {fills.map((fill) => (
          <DataTable
            key={JSON.stringify(fill)}
            columns={[
              { property: 'a', header: 'A', footer: 'Total' },
              { property: 'b', header: 'B' },
            ]}
            data={[
              { a: 'one', b: 1 },
              { a: 'two', b: 2 },
            ]}
            fill={fill}
          />
        ))}
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('pin', () => {
    const pins: (boolean | 'header' | 'footer')[] = [true, 'header', 'footer'];
    const { container } = render(
      <Grommet>
        {pins.map((pin) => (
          <DataTable
            key={JSON.stringify(pin)}
            columns={[
              { property: 'a', header: 'A', footer: 'Total', pin: true },
              { property: 'b', header: 'B' },
            ]}
            data={[
              { a: 'one', b: 1 },
              { a: 'two', b: 2 },
            ]}
            pin={pin}
          />
        ))}
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('pin + background', () => {
    const theme = {
      dataTable: {
        pinned: {
          header: {
            background: {
              color: 'blue',
            },
          },
          footer: {
            background: {
              color: 'green',
            },
          },
        },
      },
    };

    const pins: (boolean | 'header' | 'footer')[] = [true, 'header', 'footer'];

    const { container } = render(
      <Grommet theme={theme}>
        {pins.map((pin) => (
          <DataTable
            background={{ pinned: 'red' }}
            key={JSON.stringify(pin)}
            columns={[
              { property: 'a', header: 'A', footer: 'Total', pin: true },
              { property: 'b', header: 'B' },
            ]}
            data={[
              { a: 'one', b: 1 },
              { a: 'two', b: 2 },
            ]}
            pin={pin}
          />
        ))}
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('pin + background context', () => {
    const { container } = render(
      <Grommet>
        {[
          'background-back',
          'background-front',
          { color: 'background-back', dark: true },
        ].map((contextBackground) => (
          <Box
            key={JSON.stringify(contextBackground)}
            background={contextBackground}
          >
            <DataTable
              columns={[
                { property: 'a', header: 'A', footer: 'Total', pin: true },
                { property: 'b', header: 'B' },
              ]}
              data={[
                { a: 'one', b: 1 },
                { a: 'two', b: 2 },
              ]}
              pin
            />
          </Box>
        ))}
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('select', () => {
    const onSelect = jest.fn();
    const { container, getByLabelText } = render(
      <Grommet>
        <DataTable
          columns={[{ property: 'a', header: 'A' }]}
          data={[{ a: 'alpha' }, { a: 'beta' }]}
          primaryKey="a"
          select={['alpha']}
          onSelect={onSelect}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
    fireEvent.click(getByLabelText('select beta'));
    expect(onSelect).toBeCalledWith(expect.arrayContaining(['alpha', 'beta']), {
      a: 'beta',
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  test('select with allowSelectAll={false}', () => {
    const onSelect = jest.fn();
    const { container, getByLabelText } = render(
      <Grommet>
        <DataTable
          columns={[{ property: 'a', header: 'A' }]}
          data={[{ a: 'alpha' }, { a: 'beta' }]}
          primaryKey="a"
          select={['alpha']}
          onSelect={onSelect}
          allowSelectAll={false}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
    fireEvent.click(getByLabelText('select beta'));
    expect(onSelect).toBeCalledWith(expect.arrayContaining(['alpha', 'beta']), {
      a: 'beta',
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  test('disabled select', () => {
    const onSelect = jest.fn();
    const { container, getByText } = render(
      <Grommet>
        <DataTable
          columns={[{ property: 'a', header: 'A' }]}
          data={[{ a: 'alpha' }, { a: 'beta' }]}
          primaryKey="a"
          disabled={['alpha']}
          select={['beta']}
          onSelect={onSelect}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
    fireEvent.click(getByText('alpha'));
    expect(onSelect).not.toBeCalled();
  });

  test('custom theme', () => {
    const customTheme = {
      dataTable: {
        header: {
          background: 'skyblue',
          border: {
            color: 'brand',
            size: 'medium',
          },
          gap: 'none',
          pad: { horizontal: 'small', vertical: 'xsmall' },
          font: {
            weight: 'bold',
          },
          hover: {
            background: {
              color: 'light-2',
            },
          },
        },
        resize: {
          hover: {
            border: {
              color: 'red',
              side: 'end',
              size: 'xsmall',
            },
          },
        },
      },
    };

    const { container, getByLabelText } = render(
      <Grommet theme={customTheme}>
        <DataTable
          columns={[{ property: 'a', header: 'A' }]}
          data={[{ a: 'alpha' }, { a: 'beta' }]}
          primaryKey="a"
          select={['alpha']}
          sortable
          resizeable
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();

    fireEvent.mouseOver(getByLabelText('select beta'));
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should apply custom theme for groupHeader', () => {
    const theme = {
      dataTable: {
        groupHeader: {
          background: 'tomato',
          border: {
            side: 'top',
            size: 'medium',
          },
          pad: 'medium',
        },
      },
    };
    const { asFragment } = render(
      <Grommet theme={theme}>
        <DataTable
          columns={[
            { header: 'Group', property: 'group' },
            { header: 'Value', primary: true, property: 'value' },
          ]}
          data={[
            { group: 1, value: 1 },
            { group: 1, value: 2 },
            { group: 2, value: 3 },
            { group: 2, value: 4 },
          ]}
          groupBy="group"
        />
      </Grommet>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('should apply theme for selected row', () => {
    const theme = {
      dataTable: {
        body: {
          selected: {
            background: 'red',
          },
        },
      },
    };
    const { asFragment } = render(
      <Grommet theme={theme}>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
          select={['two']}
        />
      </Grommet>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('should apply theme for selected row group', () => {
    const theme = {
      dataTable: {
        body: {
          selected: {
            background: 'red',
          },
        },
      },
    };
    const { asFragment } = render(
      <Grommet theme={theme}>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'one', b: 1.1 },
            { a: 'one', b: 1.2 },
            { a: 'two', b: 2.1 },
            { a: 'two', b: 2.2 },
            { a: 'three', b: 3.1 },
            { a: 'three', b: 3.2 },
          ]}
          groupBy={{
            property: 'a',
            expand: ['one', 'two'],
          }}
          primaryKey={'b'}
          select={[1.1, 1.2]}
        />
      </Grommet>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('should apply theme for selected row detail parent only', () => {
    const theme = {
      dataTable: {
        body: {
          selected: {
            background: 'red',
          },
        },
      },
    };
    const { asFragment, getAllByLabelText } = render(
      <Grommet theme={theme}>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
          rowDetails={(row) => <div>{row.a}</div>}
          select={['two']}
        />
      </Grommet>,
    );
    // No means to expand row details declaratively
    fireEvent.click(getAllByLabelText('expand', { exact: false })[1]);
    expect(asFragment()).toMatchSnapshot();
  });

  test('units', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A', footer: 'Total' },
            { property: 'b', header: 'B', units: '(TiB)' },
          ]}
          data={[
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('placeholder', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A', footer: 'Total' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
          placeholder="test placeholder"
        />
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
          placeholder={<Text weight="bold">test placeholder</Text>}
        />
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          placeholder={<Text weight="bold">test placeholder</Text>}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should paginate', () => {
    const { container, getAllByText } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={DATA}
          paginate
        />
      </Grommet>,
    );

    const results = getAllByText('entry', { exact: false });
    // default DataTable step 50
    expect(results.length).toEqual(50);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should pin and paginate', () => {
    const { container, getAllByText } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={DATA}
          paginate
          pin
        />
      </Grommet>,
    );

    const results = getAllByText('entry', { exact: false });
    expect(results.length).toEqual(50);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should apply pagination styling', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={DATA}
          paginate={{ background: 'red', margin: 'large' }}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should show correct item index when "show" is a number', () => {
    const show = 15;
    const { container, getByText } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={DATA}
          paginate
          show={show}
        />
      </Grommet>,
    );

    const result = getByText(`entry-${show}`);
    expect(result).toBeTruthy();
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should show correct page when "show" is { page: # }', () => {
    const desiredPage = 2;
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={DATA}
          paginate
          show={{ page: desiredPage }}
        />
      </Grommet>,
    );

    const activePage = (
      container.querySelector(`[aria-current="page"]`) as HTMLButtonElement
    ).innerHTML;

    expect(activePage).toEqual(`${desiredPage}`);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correct num items per page (step)', () => {
    const step = 14;
    const { container, getAllByText } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={DATA}
          paginate
          step={step}
        />
      </Grommet>,
    );

    const results = getAllByText('entry', { exact: false });

    expect(results.length).toEqual(step);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render new data when page changes', () => {
    const { container, getByLabelText } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={DATA}
          paginate
        />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
    fireEvent.click(getByLabelText('Go to next page'));

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should not show paginate controls when data is empty array', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[]}
          paginate
        />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should not show paginate controls when length of data < step', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: `entry-1`, b: 1 },
            { a: `entry-2`, b: 2 },
            { a: `entry-3`, b: 3 },
          ]}
          paginate
        />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('onSelect select/unselect all', () => {
    const onSelect = jest.fn();
    const { container, getByLabelText } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B', primary: true },
          ]}
          data={[
            { a: 'one', b: 1.1 },
            { a: 'one', b: 1.2 },
            { a: 'two', b: 2.1 },
            { a: 'two', b: 2.2 },
          ]}
          onSelect={onSelect}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();

    let headerCheckBox;
    headerCheckBox = getByLabelText('select all');
    fireEvent.click(headerCheckBox);
    expect(onSelect).toBeCalledWith([1.1, 1.2, 2.1, 2.2]);
    expect(container.firstChild).toMatchSnapshot();

    // aria-label should have changed since all entries
    // are selected
    headerCheckBox = getByLabelText('unselect all');
    fireEvent.click(headerCheckBox);
    expect(onSelect).toBeCalledWith([]);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('onSelect + groupBy should select/deselect all when grouped', () => {
    const onSelect = jest.fn();
    const { container, getByLabelText } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B', primary: true },
          ]}
          data={[
            { a: 'one', b: 1.1 },
            { a: 'one', b: 1.2 },
            { a: 'two', b: 2.1 },
            { a: 'two', b: 2.2 },
          ]}
          groupBy="a"
          onSelect={onSelect}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();

    let headerCheckBox;
    headerCheckBox = getByLabelText('select all');
    fireEvent.click(headerCheckBox);
    expect(container.firstChild).toMatchSnapshot();

    // aria-label should have changed since all entries
    // are selected
    headerCheckBox = getByLabelText('unselect all');
    fireEvent.click(headerCheckBox);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('onSelect + groupBy should select all items within a group', () => {
    const onSelect = jest.fn();
    const { container, getByLabelText } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B', primary: true },
          ]}
          data={[
            { a: 'one', b: 1.1 },
            { a: 'one', b: 1.2 },
            { a: 'two', b: 2.1 },
            { a: 'two', b: 2.2 },
          ]}
          groupBy="a"
          onSelect={onSelect}
        />
      </Grommet>,
    );

    const groupCheckBox = getByLabelText('select one');
    fireEvent.click(groupCheckBox);
    expect(onSelect).toBeCalledWith(
      expect.arrayContaining([1.1, 1.2]),
      expect.objectContaining({ a: 'one' }),
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test(`onSelect + groupBy should render indeterminate checkbox on table and
  group if subset of group items are selected`, () => {
    const onSelect = jest.fn();
    const { container, getAllByLabelText, getByLabelText } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'one', b: 1.1 },
            { a: 'one', b: 1.2 },
            { a: 'two', b: 2.1 },
            { a: 'two', b: 2.2 },
          ]}
          groupBy="a"
          primaryKey="b"
          onSelect={onSelect}
        />
      </Grommet>,
    );

    const groupCheckBox = getByLabelText('select one');
    fireEvent.click(groupCheckBox);
    const expandButtons = getAllByLabelText('expand', { exact: false });
    fireEvent.click(expandButtons[1], {});

    fireEvent.click(getByLabelText('unselect 1.1'));
    expect(container.firstChild).toMatchSnapshot();
  });

  test(`onSelect + groupBy should render indeterminate checkbox on table and
  group when controlled`, () => {
    const onSelect = jest.fn();
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B', primary: true },
          ]}
          data={[
            { a: 'one', b: 1.1 },
            { a: 'one', b: 1.2 },
            { a: 'two', b: 2.1 },
            { a: 'two', b: 2.2 },
          ]}
          groupBy="a"
          select={[1.1]}
          onSelect={onSelect}
        />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('verticalAlign', () => {
    const { asFragment } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b.c', header: 'B' },
          ]}
          data={[
            { a: 'one', b: { c: 1 } },
            { a: 'two', b: { c: 2 } },
          ]}
          verticalAlign="top"
        />
        <DataTable
          columns={[
            {
              property: 'This is a long header that wraps',
              header: 'A',
              footer: 'This is a long footer that wraps',
              size: 'xsmall',
            },
            { property: 'b.c', header: 'B' },
          ]}
          data={[
            { a: 'this is long data that might wrap also', b: { c: 1 } },
            { a: 'two', b: { c: 2 } },
          ]}
          verticalAlign={{
            header: 'bottom',
            body: 'top',
            footer: 'top',
          }}
        />
      </Grommet>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test('should base table body max height on global size', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
          size="small"
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should base table body max height on css value', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            { property: 'a', header: 'A' },
            { property: 'b', header: 'B' },
          ]}
          data={[
            { a: 'one', b: 1 },
            { a: 'two', b: 2 },
          ]}
          size="50px"
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('rowProps on group header rows', () => {
    const { container } = render(
      <Grommet>
        <DataTable
          columns={[
            {
              property: 'location',
              header: 'Location',
            },
            {
              property: 'name',
              header: <Text>Name with extra</Text>,
              primary: true,
            },
          ]}
          rowProps={{ 'Fort Collins': { background: 'yellow' } }}
          data={[
            { name: 'Bryan', location: 'Fort Collins' },
            { name: 'Doug', location: 'Fort Collins' },
            { name: 'Tracy', location: 'San Francisco' },
          ]}
          groupBy="location"
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('border on CheckBox cell', () => {
    const { asFragment } = render(
      <Grommet>
        <DataTable
          data={[
            { name: 'Alan', percent: 20 },
            { name: 'Bryan', percent: 30 },
            { name: 'Chris', percent: 20 },
            { name: 'Eric', percent: 80 },
          ]}
          columns={[
            {
              property: 'name',
              header: 'Name',
              primary: true,
            },
            {
              property: 'percent',
              header: 'Percent Complete',
            },
          ]}
          border={{ body: { side: 'bottom' } }}
          onSelect={() => {}}
        />
      </Grommet>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('onSelect datum argument should be defined', () => {
    const onSelect = jest.fn();
    render(
      <Grommet>
        <DataTable
          onSelect={onSelect}
          data={[
            { name: 'Alan', percent: 20 },
            { name: 'Bryan', percent: 30 },
          ]}
          columns={[
            {
              property: 'name',
              header: 'Name',
              primary: true,
            },
            {
              property: 'percent',
              header: 'Percent Complete',
            },
          ]}
        />
      </Grommet>,
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'select Alan' }));
    expect(onSelect).toBeCalledWith(['Alan'], { name: 'Alan', percent: 20 });
  });

  test('Data + onSelect should display correct selected amount', () => {
    const App = () => {
      const [select, setSelect] = useState<(string | number)[]>([]);
      return (
        <Grommet>
          <Data data={DATA} toolbar>
            <DataTable
              select={select}
              onSelect={(select, _) => setSelect(select)}
            />
            <Pagination />
          </Data>
        </Grommet>
      );
    };
    render(<App />);

    const headerCheckBox = screen.getByLabelText('select all');

    // select all first page
    fireEvent.click(headerCheckBox);
    expect(screen.getByText('10 selected')).toBeTruthy();

    // navigate to new page
    const secondPageButton = screen.getByRole('button', {
      name: 'Go to page 2',
    });
    fireEvent.click(secondPageButton);
    // select all second page
    fireEvent.click(headerCheckBox);
    // should add to previous selection
    expect(screen.getByText('20 selected')).toBeTruthy();

    // apply filters and select view
    const filterButton = screen.getByRole('button', { name: 'Open filters' });
    fireEvent.click(filterButton);
    fireEvent.click(screen.getByRole('checkbox', { name: 'option 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Apply filters' }));
    fireEvent.click(headerCheckBox);
    expect(screen.getByText('22 selected')).toBeTruthy();

    // unselect single checkbox
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'unselect entry-35' }),
    );
    expect(screen.getByText('21 selected')).toBeTruthy();

    // clear view + unselect all from current page
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    fireEvent.click(headerCheckBox);
    expect(screen.getByText('11 selected')).toBeTruthy();
  });

  test('onUpdate groupBy.onSelect', () => {
    const onGroupSelect = jest.fn();
    const App = () => {
      const [groupSelected] = React.useState<{
        [key: string]: 'all' | 'some' | 'none';
      }>({ '': 'some', 'Fort Collins': 'some' });

      const groupBy = React.useMemo(() => {
        return {
          property: 'location',
          select: groupSelected,
          onSelect: onGroupSelect,
        };
      }, [groupSelected]);

      return (
        <DataTable
          primaryKey="id"
          columns={[
            {
              property: 'id',
              header: 'ID',
            },
            {
              property: 'b',
              header: 'B',
            },
            {
              property: 'location',
              header: 'Location',
            },
          ]}
          data={[
            {
              id: 0,
              b: 'zero',
              location: 'Fort Collins',
            },
            {
              id: 1,
              b: 'one',
              location: 'Fort Collins',
            },
            {
              id: 2,
              b: 'two',
              location: 'San Francisco',
            },
            {
              id: 3,
              b: 'three',
              location: 'San Francisco',
            },
            {
              id: 4,
              b: 'four',
              location: 'Boise',
            },
            {
              id: 5,
              b: 'five',
              location: 'Los Angeles',
            },
          ]}
          step={10}
          groupBy={groupBy}
          onSelect={() => {}}
          onUpdate={() => {}}
        />
      );
    };

    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();

    fireEvent.click(
      screen.getByRole('checkbox', { name: 'select San Francisco' }),
    );
    expect(onGroupSelect).toHaveBeenCalledWith(
      [2, 3],
      { location: 'San Francisco' },
      { '': 'some', 'Fort Collins': 'some' },
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'select all' }));
    expect(onGroupSelect).toHaveBeenCalledWith([0, 1, 2, 3, 4, 5], undefined, {
      '': 'all',
    });
  });

  test('row click using space key press', () => {
    const onClickRow = jest.fn();
    const { container, getByText } = render(
      <Grommet>
        <DataTable
          columns={[{ property: 'name', header: 'Name' }]}
          data={[{ name: 'alpha' }]}
          onClickRow={onClickRow}
        />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();

    fireEvent.mouseEnter(getByText('alpha'));
    fireEvent.keyDown(getByText('alpha'), {
      code: 'Space',
      keyCode: 32,
    });

    expect(onClickRow).toHaveBeenCalledWith(
      expect.objectContaining({ datum: { name: 'alpha' } }),
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('disable row click using space key press', () => {
    const onClickRow = jest.fn();
    const { container, getByText } = render(
      <Grommet>
        <DataTable
          columns={[{ property: 'name', header: 'Name' }]}
          data={[{ name: 'alpha' }]}
          disabled={['alpha']}
          onClickRow={onClickRow}
        />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();

    fireEvent.mouseEnter(getByText('alpha'));
    fireEvent.keyDown(getByText('alpha'), {
      code: 'Space',
      keyCode: 32,
    });

    expect(onClickRow).not.toHaveBeenCalled();
    expect(container.firstChild).toMatchSnapshot();
  });
});
