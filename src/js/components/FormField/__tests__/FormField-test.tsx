import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import 'jest-styled-components';
import React from 'react';
import 'regenerator-runtime/runtime';
import styled from 'styled-components';

import { Alert, New, StatusInfo } from 'grommet-icons';
import { FormField } from '..';
import { CheckBox } from '../../CheckBox';
import { Form } from '../../Form';
import { Grommet } from '../../Grommet';
import { TextInput } from '../../TextInput';
import { TextArea } from '../../TextArea';
import { Text } from '../../Text';

const CustomFormField = styled(FormField)`
  font-size: 40px;
`;

describe('FormField', () => {
  test(`should have no accessibility violations`, async () => {
    const { container } = render(
      <Grommet>
        <FormField />
      </Grommet>,
    );
    const results = await axe(container);
    expect(container.firstChild).toMatchSnapshot();
    expect(results).toHaveNoViolations();
  });

  test('default', () => {
    const { container } = render(
      <Grommet>
        <FormField />
        <FormField>
          <TextInput />
        </FormField>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('default outside grommet wrapper', () => {
    const { container } = render(<FormField />);

    expect(container.firstChild).toMatchSnapshot();
  });

  test('label', () => {
    const { container } = render(
      <Grommet>
        <FormField label="test label" />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('help', () => {
    const { container } = render(
      <Grommet>
        <FormField help="test help" />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('error', () => {
    const { container } = render(
      <Grommet>
        <FormField error="test error" />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('info', () => {
    const { container } = render(
      <Grommet>
        <FormField info="test info" />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('htmlFor', () => {
    const { container } = render(
      <Grommet>
        <FormField htmlFor="test-id" />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('margin', () => {
    const { container } = render(
      <Grommet>
        <FormField margin="medium" />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('empty margin', () => {
    const { container } = render(
      <Grommet>
        <FormField margin="none" />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('pad', () => {
    const { container } = render(
      <Grommet>
        <FormField pad />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('abut', () => {
    const { container } = render(
      <Grommet
        theme={{
          formField: {
            border: {
              color: 'border',
              error: {
                color: {
                  dark: 'white',
                  light: 'status-critical',
                },
              },
              size: 'large',
              position: 'outer',
              side: 'all',
            },
            margin: { bottom: 'small' },
          },
        }}
      >
        <FormField htmlFor="test-id" />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('abut with margin', () => {
    const { container } = render(
      <Grommet
        theme={{
          formField: {
            border: {
              color: 'border',
              error: {
                color: {
                  dark: 'white',
                  light: 'status-critical',
                },
              },
              size: 'large',
              position: 'outer',
              side: 'all',
            },
            margin: { bottom: 'small' },
          },
        }}
      >
        <FormField margin="medium" htmlFor="test-id" />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('info and help label colors', () => {
    const { container } = render(
      <Grommet
        theme={{
          formField: {
            disabled: { label: { color: 'teal' } },
            help: { color: 'blue' },
            info: { color: 'green' },
          },
        }}
      >
        <FormField
          label="Label"
          disabled
          help="Text to help the user know what is possible"
          info="Additional contextual information"
        />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('custom formfield', () => {
    const { container } = render(
      <Grommet>
        <CustomFormField htmlFor="test-id" />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('disabled', () => {
    const { container } = render(
      <Grommet>
        <FormField disabled /> {/* don't use FormField without Form */}
        <Form>
          <FormField disabled />
        </Form>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('required', () => {
    const { container } = render(
      <Grommet>
        <FormField required /> {/* don't use FormField without Form */}
        <Form>
          <FormField required />
        </Form>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('custom label', () => {
    const { container } = render(
      <Grommet
        theme={{
          formField: {
            label: {
              color: 'red',
              size: 'small',
              margin: 'xsmall',
              weight: 600,
            },
          },
        }}
      >
        <Form>
          <FormField label="label" />
        </Form>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('disabled with custom label for help and info', () => {
    const { container } = render(
      <Grommet
        theme={{
          formField: {
            label: {
              color: 'red',
              size: 'small',
              margin: 'xsmall',
              weight: 600,
            },
            disabled: {
              label: {
                color: 'teal',
              },
              help: {
                color: 'blue',
              },
              info: {
                color: 'green',
              },
            },
          },
        }}
      >
        <Form>
          <FormField
            help="Text to help the user know what is possible"
            info="Additional contextual information"
            htmlFor="text-input"
            disabled
            label="label"
          >
            <TextInput
              id="text-input"
              placeholder="placeholder"
              value="Value"
            />
          </FormField>
        </Form>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('pad with border undefined', () => {
    const { container } = render(
      <Grommet
        theme={{
          formField: {
            border: undefined,
            content: {
              pad: 'large',
            },
          },
        }}
      >
        <Form>
          <FormField label="label" pad />
        </Form>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('custom input margin', () => {
    const { container } = render(
      <Grommet
        theme={{
          formField: {
            content: {
              margin: { vertical: 'large' },
            },
          },
        }}
      >
        <Form>
          <FormField label="label" />
        </Form>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('contentProps', () => {
    const { container } = render(
      <Grommet>
        <Form>
          <FormField
            label="label"
            contentProps={{
              border: false,
            }}
          />
        </Form>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('custom error and info icon and container', () => {
    const { container } = render(
      <Grommet
        theme={{
          formField: {
            error: {
              icon: <Alert />,
              container: {
                background: {
                  color: 'green',
                },
              },
            },
            info: {
              icon: <StatusInfo />,
              container: {
                pad: { horizontal: 'large' },
              },
            },
          },
        }}
      >
        <Form>
          <FormField
            label="label"
            error="This is an error message."
            info="Here is a little added info on FormField."
            contentProps={{
              border: false,
            }}
          />
        </Form>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render asterisk when requiredIndicator === true', () => {
    const { container } = render(
      <Grommet
        theme={{
          formField: {
            label: {
              requiredIndicator: true,
            },
          },
        }}
      >
        <Form>
          <FormField label="label" required />
        </Form>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should render custom indicator when requiredIndicator is
  element`, () => {
    const { container } = render(
      <Grommet
        theme={{
          formField: {
            label: {
              requiredIndicator: <New size="small" />,
            },
          },
        }}
      >
        <Form>
          <FormField label="label" required />
        </Form>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should not render asterisk when required.indicator === false', () => {
    const { container } = render(
      <Grommet
        theme={{
          formField: {
            label: {
              requiredIndicator: true,
            },
          },
        }}
      >
        <Form>
          <FormField label="label" required={{ indicator: false }} />
        </Form>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('checkbox pad is defined in formfield', () => {
    const { container } = render(
      <Grommet
        theme={{
          formField: {
            checkBox: {
              pad: {
                horizontal: 'small',
                vertical: 'xsmall',
              },
            },
          },
        }}
      >
        <Form>
          <FormField label="label">
            <CheckBox label="checkbox with pad" />
          </FormField>
          <CheckBox label="checkbox without pad" />
        </Form>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('max and threshold validation', () => {
    const { container } = render(
      <Grommet>
        <Form validate="change">
          <FormField
            label="label"
            validate={{ max: 10, threshold: 0.5 }}
            name="issue-description"
            htmlFor="issue-description"
          >
            <TextInput
              id="issue-description"
              name="issue-description"
              placeholder="placeholder"
            />
          </FormField>
        </Form>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('typing something into the input that meets the threshold', () => {
    render(
      <Grommet>
        <Form validate="change">
          <FormField
            label="label"
            validate={{ max: 10, threshold: 0.5 }}
            name="issue-description"
            htmlFor="issue-description"
          >
            <TextInput
              data-testid="test-input"
              id="issue-description"
              name="issue-description"
              placeholder="placeholder"
            />
          </FormField>
        </Form>
      </Grommet>,
    );

    fireEvent.change(screen.getByTestId('test-input'), {
      target: { value: '12345' },
    });

    expect(screen.queryByText('characters left', { exact: false })).toBeNull();
  });

  test('checks that the "X characters left" message appears', async () => {
    render(
      <Grommet>
        <Form validate="change">
          <FormField
            label="label"
            validate={{ max: 10, threshold: 0.5 }}
            name="issue-description"
            htmlFor="issue-description"
          >
            <TextInput
              data-testid="test-input"
              id="issue-description"
              name="issue-description"
              placeholder="placeholder"
            />
          </FormField>
        </Form>
      </Grommet>,
    );

    fireEvent.change(screen.getByTestId('test-input'), {
      target: { value: '123456' },
    });

    await waitFor(() => {
      expect(screen.getByText('4 characters left')).toBeTruthy();
    });
  });

  // eslint-disable-next-line max-len
  test('checks that the "X characters over limit" message appears.', async () => {
    render(
      <Grommet>
        <Form validate="change">
          <FormField
            label="label"
            validate={{ max: 10, threshold: 0.5 }}
            name="issue-description"
            htmlFor="issue-description"
          >
            <TextInput
              data-testid="test-input"
              id="issue-description"
              name="issue-description"
              placeholder="placeholder"
            />
          </FormField>
        </Form>
      </Grommet>,
    );

    fireEvent.change(screen.getByTestId('test-input'), {
      target: { value: '1234567890$' },
    });

    await waitFor(() => {
      expect(screen.getAllByText('1 character over limit')).toBeTruthy();
    });
  });

  test('Field with autoFocus', () => {
    const mockFocus = jest.fn();
    render(
      <Grommet>
        <FormField label="Label" htmlFor="select">
          <TextArea onFocus={mockFocus} autoFocus />
        </FormField>
      </Grommet>,
    );
    expect(mockFocus).toHaveBeenCalledTimes(1);
  });

  test('Field with null as child', () => {
    const { container } = render(
      <Grommet>
        <FormField label="Label">
          <TextInput />
          {false && <Text>foobar</Text>}
        </FormField>
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
