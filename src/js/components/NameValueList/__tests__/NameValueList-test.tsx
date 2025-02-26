import React from 'react';
import 'jest-styled-components';
import 'jest-axe/extend-expect';
import 'regenerator-runtime/runtime';
import { axe } from 'jest-axe';

import { render } from '@testing-library/react';

import { ThemeType } from '../../../themes';
import { Grommet } from '../../Grommet';
import { NameValueList } from '..';
import { NameValuePair } from '../../NameValuePair';

const data = {
  name: 'entry',
  location: 'San Francisco',
  health: 80,
};

describe('NameValueList', () => {
  test('should have no accessibility violations', async () => {
    const { container } = render(
      <Grommet>
        <NameValueList>
          {Object.entries(data).map(([name, value]) => (
            <NameValuePair key={name} name={name}>
              {value}
            </NameValuePair>
          ))}
        </NameValueList>
      </Grommet>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test(`should render`, () => {
    const { container } = render(
      <Grommet>
        <NameValueList>
          {Object.entries(data).map(([name, value]) => (
            <NameValuePair key={name} name={name}>
              {value}
            </NameValuePair>
          ))}
        </NameValueList>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should render outside grommet wrapper`, () => {
    const { container } = render(
      <NameValueList>
        {Object.entries(data).map(([name, value]) => (
          <NameValuePair key={name} name={name}>
            {value}
          </NameValuePair>
        ))}
      </NameValueList>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should render correct width of name`, () => {
    const { container } = render(
      <Grommet>
        <NameValueList nameProps={{ width: 'xsmall' }}>
          {Object.entries(data).map(([name, value]) => (
            <NameValuePair key={name} name={name}>
              {value}
            </NameValuePair>
          ))}
        </NameValueList>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should render correct width of value`, () => {
    const { container } = render(
      <Grommet>
        <NameValueList valueProps={{ width: 'xsmall' }}>
          {Object.entries(data).map(([name, value]) => (
            <NameValuePair key={name} name={name}>
              {value}
            </NameValuePair>
          ))}
        </NameValueList>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should render correct width of value when value is array`, () => {
    const { asFragment } = render(
      <Grommet>
        <NameValueList valueProps={{ width: 'xsmall' }}>
          {Object.entries(data).map(([name, value]) => (
            <NameValuePair key={name} name={name}>
              {value}
            </NameValuePair>
          ))}
        </NameValueList>
      </Grommet>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test(`should render correct width of array of strings`, () => {
    const { asFragment } = render(
      <Grommet>
        <NameValueList nameProps={{ width: ['xsmall', 'max-content'] }}>
          {Object.entries(data).map(([name, value]) => (
            <NameValuePair key={name} name={name}>
              {value}
            </NameValuePair>
          ))}
        </NameValueList>
      </Grommet>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test(`should render correct alignment of name`, () => {
    const { container } = render(
      <Grommet>
        <NameValueList nameProps={{ align: 'end' }}>
          {Object.entries(data).map(([name, value]) => (
            <NameValuePair key={name} name={name}>
              {value}
            </NameValuePair>
          ))}
        </NameValueList>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should render correct alignment of value`, () => {
    const { container } = render(
      <Grommet>
        <NameValueList valueProps={{ align: 'start' }}>
          {Object.entries(data).map(([name, value]) => (
            <NameValuePair key={name} name={name}>
              {value}
            </NameValuePair>
          ))}
        </NameValueList>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should render pairs in a grid when layout="grid"`, () => {
    const { container } = render(
      <Grommet>
        <NameValueList layout="grid">
          {Object.entries(data).map(([name, value]) => (
            <NameValuePair key={name} name={name}>
              {value}
            </NameValuePair>
          ))}
        </NameValueList>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should accept and apply Grid props`, () => {
    const { container } = render(
      <Grommet>
        <NameValueList
          align="center"
          justify="center"
          gap={{ row: 'large', column: 'xlarge' }}
        >
          {Object.entries(data).map(([name, value]) => (
            <NameValuePair key={name} name={name}>
              {value}
            </NameValuePair>
          ))}
        </NameValueList>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should render name/value as a column when pairProps = { direction: 
    'column' }`, () => {
    const { container } = render(
      <Grommet>
        <NameValueList pairProps={{ direction: 'column' }}>
          {Object.entries(data).map(([name, value]) => (
            <NameValuePair key={name} name={name}>
              {value}
            </NameValuePair>
          ))}
        </NameValueList>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should render value above name when pairProps = { direction: 
    'column-reverse' }`, () => {
    const { container } = render(
      <Grommet>
        <NameValueList pairProps={{ direction: 'column-reverse' }}>
          {Object.entries(data).map(([name, value]) => (
            <NameValuePair key={name} name={name}>
              {value}
            </NameValuePair>
          ))}
        </NameValueList>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should render correct gap between rows and columns`, () => {
    const customGapTheme: ThemeType = {
      nameValueList: {
        gap: { column: 'small', row: 'large' },
      },
    };

    const { container } = render(
      <Grommet theme={customGapTheme}>
        <NameValueList>
          {Object.entries(data).map(([name, value]) => (
            <NameValuePair key={name} name={name}>
              {value}
            </NameValuePair>
          ))}
        </NameValueList>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should support custom theme`, () => {
    const customTheme: ThemeType = {
      nameValueList: {
        gap: { column: 'small', row: 'large' },
        pair: {
          column: {
            gap: {
              column: 'medium',
              row: 'small',
            },
          },
        },
        name: {
          width: 'xsmall',
        },
        value: {
          width: 'small',
        },
      },
      nameValuePair: {
        name: {
          color: 'brand',
          weight: 'bold',
        },
        value: {
          weight: 'lighter',
        },
      },
    };

    const { container } = render(
      <Grommet theme={customTheme}>
        <NameValueList>
          {Object.entries(data).map(([name, value]) => (
            <NameValuePair key={name} name={name}>
              {value}
            </NameValuePair>
          ))}
        </NameValueList>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
