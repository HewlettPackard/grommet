import React from 'react';
import 'jest-styled-components';
import { render } from '@testing-library/react';

import { Grommet } from '../../Grommet';
import { Distribution } from '..';

describe('Distribution', () => {
  test('renders', () => {
    const { container } = render(
      <Grommet>
        <Distribution values={[]} />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('values renders', () => {
    const { container } = render(
      <Grommet>
        <Distribution
          values={[{ value: 20 }, { value: 3 }, { value: 2 }, { value: 1 }]}
        >
          {value => <span>{value.value}</span>}
        </Distribution>
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('undefined value', () => {
    const { container } = render(
      <Grommet>
        <Distribution values={[{ value: 20 }, { value: undefined }]}>
          {value => <span>{value.value}</span>}
        </Distribution>
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('gap renders', () => {
    const { container } = render(
      <Grommet>
        {['xsmall', 'small', 'medium', 'large'].map(gap => (
          <Distribution
            key={gap}
            gap={gap}
            values={[{ value: 3 }, { value: 2 }, { value: 1 }]}
          >
            {value => <span>{value.value}</span>}
          </Distribution>
        ))}
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('no value should throw error', () => {
    console.error = jest.fn();
    expect(() => {
      render(
        <Grommet>
          <Distribution values={[{ name: 'val1' }, { name: 'val2' }]}>
            {value => <span>{value.value}</span>}
          </Distribution>
        </Grommet>,
      );
      /* eslint-disable-next-line max-len */
    }).toThrow(
      `Distribution should have set 'value' for each item in 'values'.`,
    );
  });
});
