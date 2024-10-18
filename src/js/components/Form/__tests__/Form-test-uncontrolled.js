import React from 'react';

import 'jest-styled-components';
import 'jest-axe/extend-expect';
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';

import { act, render, fireEvent, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

import { Grommet } from '../../Grommet';
import { Form } from '..';
import { FormField } from '../../FormField';
import { Button } from '../../Button';
import { Text } from '../../Text';
import { TextInput } from '../../TextInput';
import { Select } from '../../Select';
import { CheckBox } from '../../CheckBox';
import { RadioButtonGroup } from '../../RadioButtonGroup';
import { Box } from '../../Box';
import { DateInput } from '../../DateInput';

describe('Form accessibility', () => {
  test(`TextInput in Form should have
  no accessibility violations`, async () => {
    const { container } = render(
      <Grommet>
        <Form>
          <FormField a11yTitle="test" />
        </Form>
      </Grommet>,
    );
    const results = await axe(container);
    expect(container.firstChild).toMatchSnapshot();
    expect(results).toHaveNoViolations();
  });

  test('Select in Form should have no accessibility violations', async () => {
    const { container } = render(
      <Grommet>
        <Form>
          <FormField>
            <Select options={['small', 'medium', 'large']} a11yTitle="test" />
          </FormField>
        </Form>
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

  test('CheckBox in Form should have no accessibility violations', async () => {
    const { container } = render(
      <Grommet>
        <Form>
          <FormField>
            <CheckBox label="test" />
          </FormField>
        </Form>
      </Grommet>,
    );
    const results = await axe(container);
    expect(container.firstChild).toMatchSnapshot();
    expect(results).toHaveNoViolations();
  });

  test(`FormField with an explicit TextInput child
  should have no accessibility violations`, async () => {
    const { container } = render(
      <Grommet>
        <Form>
          <FormField>
            <TextInput a11yTitle="test" />
          </FormField>
        </Form>
      </Grommet>,
    );
    const results = await axe(container);
    expect(container.firstChild).toMatchSnapshot();
    expect(results).toHaveNoViolations();
  });

  test(`Box with TextInput in Form should
  have no accessibility violations`, async () => {
    const { container } = render(
      <Grommet>
        <Form>
          <FormField>
            <Box>
              <TextInput a11yTitle="test" />
            </Box>
          </FormField>
        </Form>
      </Grommet>,
    );
    const results = await axe(container);
    expect(container.firstChild).toMatchSnapshot();
    expect(results).toHaveNoViolations();
  });
});

describe('Form uncontrolled', () => {
  test('empty', () => {
    const { container } = render(
      <Grommet>
        <Form />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('empty outside of grommet wrapper', () => {
    const { container } = render(<Form />);

    expect(container.firstChild).toMatchSnapshot();
  });

  test('with field', () => {
    const { container } = render(
      <Grommet>
        <Form>
          <FormField name="test" />
        </Form>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('errors', () => {
    const { container } = render(
      <Grommet>
        <Form errors={{ test: 'missing' }}>
          <FormField name="test" />
        </Form>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('infos', () => {
    const { container } = render(
      <Grommet>
        <Form infos={{ test: 'missing' }}>
          <FormField name="test" />
        </Form>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('uncontrolled', () => {
    const onSubmit = jest.fn();
    const { getByPlaceholderText, getByText, container } = render(
      <Grommet>
        <Form onSubmit={onSubmit}>
          <FormField name="test">
            <TextInput name="test" placeholder="test input" />
          </FormField>
          <Button type="submit" primary label="Submit" />
        </Form>
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
    fireEvent.change(getByPlaceholderText('test input'), {
      target: { value: 'v' },
    });
    expect(container.firstChild).toMatchSnapshot();
    fireEvent.click(getByText('Submit'));
    expect(onSubmit).toBeCalledWith(
      expect.objectContaining({
        value: { test: 'v' },
        touched: { test: true },
      }),
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('uncontrolled onValidate', () => {
    const onValidate = jest.fn();
    const { getByText, container } = render(
      <Grommet>
        <Form onValidate={onValidate}>
          <FormField name="test" required>
            <TextInput name="test" placeholder="test input" />
          </FormField>
          <Button type="submit" primary label="Submit" />
        </Form>
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
    fireEvent.click(getByText('Submit'));
    expect(onValidate).toBeCalledWith(
      expect.objectContaining({
        errors: { test: 'required' },
        infos: {},
      }),
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('uncontrolled onValidate custom error', () => {
    const onValidate = jest.fn();
    const errorMessage = 'One uppercase letter';
    const testRules = {
      regexp: /(?=.*?[A-Z])/,
      message: errorMessage,
      status: 'error',
    };

    const { getByText, container } = render(
      <Grommet>
        <Form onValidate={onValidate}>
          <FormField name="test" validate={testRules}>
            <TextInput name="test" placeholder="test input" />
          </FormField>
          <Button type="submit" primary label="Submit" />
        </Form>
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
    fireEvent.click(getByText('Submit'));
    expect(onValidate).toBeCalledWith(
      expect.objectContaining({
        errors: { test: errorMessage },
        infos: {},
      }),
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('uncontrolled onValidate custom info', () => {
    const onValidate = jest.fn();
    const infoMessage = 'One uppercase letter';
    const testRules = {
      regexp: /(?=.*?[A-Z])/,
      message: infoMessage,
      status: 'info',
    };

    const { getByText, container } = render(
      <Grommet>
        <Form onValidate={onValidate}>
          <FormField name="test" validate={testRules}>
            <TextInput name="test" placeholder="test input" />
          </FormField>
          <Button type="submit" primary label="Submit" />
        </Form>
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
    fireEvent.click(getByText('Submit'));
    expect(onValidate).toBeCalledWith(
      expect.objectContaining({
        errors: {},
        infos: { test: infoMessage },
      }),
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('update', () => {
    const validate = jest
      .fn()
      .mockReturnValueOnce('too short')
      .mockReturnValueOnce(undefined);
    const validate2 = jest.fn().mockReturnValue(undefined);

    const onSubmit = jest.fn();
    const { getByPlaceholderText, getByText, container } = render(
      <Grommet>
        <Form onSubmit={onSubmit}>
          <FormField
            name="test"
            required
            validate={validate}
            placeholder="test input"
          />
          <FormField
            name="test2"
            placeholder="test-2 input"
            validate={[validate2]}
          />
          <Button type="submit" primary label="Submit" />
        </Form>
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
    fireEvent.change(getByPlaceholderText('test input'), {
      target: { value: 'v' },
    });
    fireEvent.click(getByText('Submit'));

    expect(validate).toBeCalledWith('v', { test: 'v' });
    expect(validate2).toBeCalledWith(undefined, { test: 'v' });

    fireEvent.change(getByPlaceholderText('test input'), {
      target: { value: 'value' },
    });
    fireEvent.change(getByPlaceholderText('test-2 input'), {
      target: { value: 'value-2' },
    });

    fireEvent.click(getByText('Submit'));
    expect(validate).toBeCalledWith('value', {
      test: 'value',
      test2: 'value-2',
    });
    expect(validate2).toBeCalledWith('value-2', {
      test: 'value',
      test2: 'value-2',
    });

    expect(onSubmit).toBeCalledWith(
      expect.objectContaining({
        value: { test: 'value', test2: 'value-2' },
        touched: { test: true, test2: true },
      }),
    );
  });

  test('regexp validation', () => {
    const onSubmit = jest.fn();
    const { getByPlaceholderText, getByText, queryByText } = render(
      <Grommet>
        <Form onSubmit={onSubmit}>
          <FormField
            name="test"
            required
            validate={{ regexp: /^[a-z]/i }}
            placeholder="test input"
          />
          <Button type="submit" primary label="Submit" />
        </Form>
      </Grommet>,
    );

    fireEvent.change(getByPlaceholderText('test input'), {
      target: { value: '1' },
    });
    fireEvent.click(getByText('Submit'));
    expect(getByText('invalid')).toMatchSnapshot();

    fireEvent.change(getByPlaceholderText('test input'), {
      target: { value: 'a' },
    });
    fireEvent.click(getByText('Submit'));
    expect(queryByText('invalid')).toBeNull();
  });

  test('validate', () => {
    const onSubmit = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <Grommet>
        <Form onSubmit={onSubmit}>
          <FormField
            name="test"
            required
            validate={[
              (value) => (value.length === 1 ? 'simple string' : undefined),
              (value) =>
                value.length === 2 ? <Text> ReactNode </Text> : undefined,
              (value) =>
                value.length === 3
                  ? { message: 'status error', status: 'error' }
                  : undefined,
              (value) =>
                value.length === 4
                  ? { message: 'status info', status: 'info' }
                  : undefined,
            ]}
            placeholder="test input"
          />
          <Button type="submit" primary label="Submit" />
        </Form>
      </Grommet>,
    );

    fireEvent.change(getByPlaceholderText('test input'), {
      target: { value: 'a' },
    });
    fireEvent.click(getByText('Submit'));
    expect(getByText('simple string')).toMatchSnapshot();

    fireEvent.change(getByPlaceholderText('test input'), {
      target: { value: 'ab' },
    });
    fireEvent.click(getByText('Submit'));
    expect(getByText('ReactNode')).toMatchSnapshot();

    fireEvent.change(getByPlaceholderText('test input'), {
      target: { value: 'abc' },
    });
    fireEvent.click(getByText('Submit'));
    expect(getByText('status error')).toMatchSnapshot();

    fireEvent.change(getByPlaceholderText('test input'), {
      target: { value: 'abcd' },
    });
    fireEvent.click(getByText('Submit'));
    expect(getByText('status info')).toMatchSnapshot();
  });

  test('required validation', () => {
    const onSubmit = jest.fn();
    const { getByPlaceholderText, getByText, queryByText } = render(
      <Grommet>
        <Form onSubmit={onSubmit}>
          <FormField name="test" required placeholder="test input" />
          <Button type="submit" primary label="Submit" />
        </Form>
      </Grommet>,
    );

    fireEvent.click(getByText('Submit'));
    expect(queryByText('required')).toMatchSnapshot();
    fireEvent.change(getByPlaceholderText('test input'), {
      target: { value: '1' },
    });
    expect(queryByText('required')).toBeNull();
  });

  test('should not submit when field is required and value is "[]"', () => {
    const onSubmit = jest.fn();
    render(
      <Grommet>
        <Form onSubmit={onSubmit}>
          <FormField
            label="Date Range"
            htmlFor="date-range"
            name="date-range"
            required
          >
            <DateInput
              name="date-range"
              value={[]}
              format="mm/dd/yyyy-mm/dd/yyyy"
            />
          </FormField>
          <Button type="submit" label="Submit" />
        </Form>
      </Grommet>,
    );

    expect(screen.queryByText('required')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('required')).toBeInTheDocument();
  });

  test('reset clears form', () => {
    const onReset = jest.fn();
    const { getByPlaceholderText, getByText, queryByText } = render(
      <Grommet>
        <Form onReset={onReset}>
          <FormField name="test" required placeholder="test input" />
          <Button type="reset" primary label="Reset" />
        </Form>
      </Grommet>,
    );
    fireEvent.change(getByPlaceholderText('test input'), {
      target: { value: 'Input has changed' },
    });
    fireEvent.click(getByText('Reset'));
    expect(queryByText('Input has changed')).toBeNull();
  });

  test('initial values', () => {
    const onSubmit = jest.fn();
    const { getByText, queryByText } = render(
      <Grommet>
        {/* this test continues running forever if the whole event
                passed to onSubmit */}
        <Form onSubmit={({ value, touched }) => onSubmit({ value, touched })}>
          <FormField
            name="test"
            required
            placeholder="test input"
            value="Initial value"
          />
          <FormField name="test2" value="Initial value2" />
          <Button type="submit" primary label="Submit" />
        </Form>
      </Grommet>,
    );
    fireEvent.click(getByText('Submit'));
    expect(queryByText('required')).toBeNull();
    expect(onSubmit).toBeCalledWith(
      expect.objectContaining({
        value: { test: 'Initial value', test2: 'Initial value2' },
        touched: {},
      }),
    );
  });

  test('validate on change', async () => {
    jest.useFakeTimers();
    const onChange = jest.fn();
    window.scrollTo = jest.fn();

    const { getByPlaceholderText, queryAllByText } = render(
      <Grommet>
        <Form validate="change">
          <FormField
            label="Name"
            name="name"
            placeholder="name"
            required
            validate={[
              { regexp: /^[a-z]/i },
              (name) => {
                if (name && name.length === 1) return 'must be >1 character';
                return undefined;
              },
              (name) => {
                if (name === 'good')
                  return {
                    message: 'good',
                    status: 'info',
                  };
                return undefined;
              },
            ]}
          />

          <FormField label="Email" name="email" required>
            <TextInput
              a11yTitle="test"
              name="email"
              type="email"
              placeholder="email"
            />
          </FormField>
          <FormField
            label="Size"
            name="test-select"
            htmlFor="test-select"
            required
            validate={(val) => {
              if (val === 'small')
                return {
                  message: 'good',
                  status: 'info',
                };
              return undefined;
            }}
          >
            <Select
              a11yTitle="select form"
              id="test-select"
              name="test-select"
              placeholder="test input"
              options={['small', 'medium', 'large']}
              onChange={onChange}
            />
          </FormField>
          <Button label="submit" type="submit" />
        </Form>
      </Grommet>,
    );

    // change input of first field
    fireEvent.change(getByPlaceholderText('name'), {
      target: { value: 'Input has changed' },
    });
    // change input of second field
    fireEvent.change(getByPlaceholderText('email'), {
      target: { value: 'Input has changed' },
    });
    // empty second field
    fireEvent.change(getByPlaceholderText('email'), {
      target: { value: '' },
    });
    act(() => jest.advanceTimersByTime(1000)); // allow validations to run
    // emulate error on first field
    fireEvent.change(getByPlaceholderText('name'), {
      target: { value: 'a' },
    });
    act(() => jest.advanceTimersByTime(1000)); // allow validations to run
    // change value of select
    fireEvent.click(getByPlaceholderText('test input'));
    fireEvent.click(document.activeElement.querySelector('button'));
    window.scrollTo.mockRestore();
    act(() => jest.advanceTimersByTime(1000)); // allow validations to run

    expect(queryAllByText('required')).toHaveLength(1);
    expect(queryAllByText('must be >1 character')).toHaveLength(1);
    expect(queryAllByText('good')).toHaveLength(1);
  });

  test('validate on mount', () => {
    const defaultValue = {
      firstName: 'J',
      lastName: '',
    };

    const { queryAllByText } = render(
      <Grommet>
        <Form value={defaultValue} validate="change">
          <FormField
            label="First Name"
            name="firstName"
            required
            validate={[
              { regexp: /^[a-z]/i },
              (firstName) => {
                if (firstName && firstName.length === 1)
                  return 'must be >1 character';
                return undefined;
              },
            ]}
          />

          <FormField
            label="Last Name"
            name="lastName"
            required
            validate={[
              { regexp: /^[a-z]/i },
              (lastName) => {
                if (lastName && lastName.length === 1)
                  return 'must be >1 character';
                return undefined;
              },
            ]}
          />
        </Form>
      </Grommet>,
    );

    expect(queryAllByText('must be >1 character')).toHaveLength(1);
  });

  test('validate on blur', async () => {
    jest.useFakeTimers();
    const onFocus = jest.fn();
    const { getByText, getByPlaceholderText, queryAllByText, queryByText } =
      render(
        <Grommet>
          <Form validate="blur">
            <FormField
              onFocus={onFocus}
              label="Name"
              name="name"
              placeholder="name"
              required
              validate={[
                { regexp: /^[a-z]/i },
                (name) => {
                  if (name && name.length === 1) return 'must be >1 character';
                  return undefined;
                },
                (name) => {
                  if (name === 'good')
                    return {
                      message: 'good',
                      status: 'info',
                    };
                  return undefined;
                },
              ]}
            />

            <FormField onFocus={onFocus} label="Email" name="email" required>
              <TextInput
                a11yTitle="test"
                name="email"
                type="email"
                placeholder="email"
              />
            </FormField>
            <Button onFocus={onFocus} label="submit" type="submit" />
          </Form>
        </Grommet>,
      );

    // both fields have required error message
    act(() => getByText('submit').focus());
    fireEvent.click(getByText('submit'));
    expect(queryAllByText('required')).toHaveLength(2);

    // one fields has required error message
    act(() => getByPlaceholderText('name').focus());
    fireEvent.change(getByPlaceholderText('name'), {
      target: { value: 'Input has changed' },
    });
    act(() => getByText('submit').focus());
    act(() => jest.advanceTimersByTime(200)); // allow validations to run
    expect(queryAllByText('required')).toHaveLength(1);

    // name field has new error and email field still has required error message
    act(() => getByPlaceholderText('name').focus());
    fireEvent.change(getByPlaceholderText('name'), {
      target: { value: 'a' },
    });
    act(() => getByText('submit').focus());
    act(() => jest.advanceTimersByTime(200)); // allow validations to run
    expect(queryByText('required')).toBeTruthy();
    expect(queryByText('must be >1 character')).toBeTruthy();

    //  new value in name does not remove the error message in email
    act(() => getByPlaceholderText('name').focus());
    fireEvent.change(getByPlaceholderText('name'), {
      target: { value: 'abc' },
    });
    expect(onFocus).toBeCalledTimes(6);
    expect(queryByText('required')).toBeTruthy();
    expect(queryByText('must be >1 character')).toBe(null);
  });

  test('validate on blur with Select', async () => {
    jest.useFakeTimers();
    window.scrollTo = jest.fn();
    render(
      <Grommet>
        <Form validate="blur">
          <FormField
            label="Size"
            name="select-size"
            htmlFor="select-size"
            required
          >
            <Select
              name="select-size"
              id="select-size"
              options={['small', 'medium', 'large']}
            />
          </FormField>
          <Button label="submit" type="submit" />
        </Form>
      </Grommet>,
    );

    act(() => screen.getByRole('button', { name: /Size/i }).focus());
    fireEvent.click(screen.getByRole('button', { name: /Size/i }));
    act(() => screen.getByRole('option', { name: /small/i }).focus());

    act(() => jest.advanceTimersByTime(200)); // allow validations to run
    expect(screen.queryAllByText('required')).toHaveLength(0);

    act(() => screen.getByText('submit').focus());
    act(() => jest.advanceTimersByTime(200)); // allow validations to run
    expect(screen.queryAllByText('required')).toHaveLength(1);

    window.scrollTo.mockRestore();
  });

  test('form validity', async () => {
    jest.useFakeTimers();
    let valid;
    const { getByPlaceholderText, getByText } = render(
      <Grommet>
        <Form
          validate="change"
          onValidate={(validationResults) => {
            valid = validationResults.valid;
          }}
        >
          <FormField
            label="First Name"
            name="firstName"
            placeholder="First Name"
            required
            validate={[
              { regexp: /^[a-z]/i },
              (firstName) => {
                if (firstName && firstName.length === 1)
                  return 'must be >1 character';
                return undefined;
              },
            ]}
          />
          <FormField
            label="Last Name"
            name="lastName"
            placeholder="Last Name"
            required
            validate={[
              { regexp: /^[a-z]/i },
              (lastName) => {
                if (lastName && lastName.length === 1)
                  return 'must be >1 character';
                return undefined;
              },
            ]}
          />
          <FormField
            label="Address"
            name="address"
            placeholder="Address"
            validate={[
              { regexp: /^[a-z]/i },
              (address) => {
                if (address && address.length === 1)
                  return 'must be >1 character';
                return undefined;
              },
            ]}
          />
          <FormField
            label="Agree"
            name="test-checkbox"
            htmlFor="test-checkbox"
            required
          >
            <CheckBox
              label="test-checkbox"
              name="test-checkbox"
              id="test-checkbox"
            />
          </FormField>
          <Button label="submit" type="submit" />
        </Form>
      </Grommet>,
    );

    // verify validate on change
    fireEvent.change(getByPlaceholderText('First Name'), {
      target: { value: 'J' },
    });
    act(() => jest.advanceTimersByTime(1000)); // allow validations to run
    expect(valid).toBeFalsy();

    // first field fails validation, second field passes validation,
    // form validity should be false
    fireEvent.change(getByPlaceholderText('First Name'), {
      target: { value: 'J' },
    });
    fireEvent.change(getByPlaceholderText('Last Name'), {
      target: { value: 'Doe' },
    });
    act(() => jest.advanceTimersByTime(1000)); // allow validations to run
    expect(valid).toBeFalsy();

    // first field passes validation, second field fails validation,
    // form validity should be false
    fireEvent.change(getByPlaceholderText('First Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(getByPlaceholderText('Last Name'), {
      target: { value: 'D' },
    });
    act(() => jest.advanceTimersByTime(1000)); // allow validations to run
    expect(valid).toBeFalsy();

    // first field fails validation, second field fails validation,
    // form validity should be false
    fireEvent.change(getByPlaceholderText('First Name'), {
      target: { value: 'J' },
    });
    fireEvent.change(getByPlaceholderText('Last Name'), {
      target: { value: 'D' },
    });
    act(() => jest.advanceTimersByTime(1000)); // allow validations to run
    expect(valid).toBeFalsy();

    // first field passes validation, second field passes validation,
    // third field fails validation, form validity should be false
    fireEvent.change(getByPlaceholderText('First Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(getByPlaceholderText('Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(getByPlaceholderText('Address'), {
      target: { value: 'K' },
    });
    act(() => jest.advanceTimersByTime(1000)); // allow validations to run
    expect(valid).toBeFalsy();

    // all fields pass validation except for checkbox,
    // form validity should be false
    fireEvent.change(getByPlaceholderText('First Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(getByPlaceholderText('Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(getByPlaceholderText('Address'), {
      target: { value: 'Easter Ave' },
    });
    act(() => jest.advanceTimersByTime(1000)); // allow validations to run
    expect(valid).toBeFalsy();

    // all fields pass validation, form validity should be true
    fireEvent.change(getByPlaceholderText('First Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(getByPlaceholderText('Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.click(getByText('test-checkbox'));
    act(() => jest.advanceTimersByTime(1000)); // allow validations to run
    expect(valid).toBeTruthy();
  });

  test('uncontrolled without name', () => {
    const onSubmit = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <Grommet>
        <Form onSubmit={onSubmit}>
          <FormField>
            <TextInput a11yTitle="test" placeholder="test input" />
          </FormField>
          <Button type="submit" primary label="Submit" />
        </Form>
      </Grommet>,
    );
    fireEvent.change(getByPlaceholderText('test input'), {
      target: { value: 'v' },
    });
    expect(getByPlaceholderText('test input').value).toBe('v');
    fireEvent.click(getByText('Submit'));
    expect(onSubmit).toBeCalledTimes(1);
  });

  test('uncontrolled reset without value', () => {
    const onChange = jest.fn();
    const { getByPlaceholderText, getByText, queryByText } = render(
      <Grommet>
        <Form onChange={onChange}>
          <FormField
            name="test"
            required
            placeholder="test input"
            a11yTitle="test"
          />
          <Button type="reset" primary label="Reset" />
        </Form>
      </Grommet>,
    );
    fireEvent.change(getByPlaceholderText('test input'), {
      target: { value: 'Input has changed' },
    });
    expect(getByPlaceholderText('test input').value).toBe('Input has changed');
    expect(onChange).toBeCalledTimes(1);
    fireEvent.click(getByText('Reset'));
    expect(queryByText('Input has changed')).toBeNull();
  });

  test('disabled FormField', () => {
    const onSubmit = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <Grommet>
        <Form onSubmit={onSubmit}>
          <FormField disabled>
            <TextInput a11yTitle="test" placeholder="test input" />
          </FormField>
          <Button type="submit" primary label="Submit" />
        </Form>
      </Grommet>,
    );
    fireEvent.change(getByPlaceholderText('test input'), {
      target: { value: 'v' },
    });
    expect(getByPlaceholderText('test input').value).toBe('v');
    fireEvent.click(getByText('Submit'));
    expect(onSubmit).not.toBeCalledWith(
      expect.objectContaining({
        value: { test: 'v' },
        touched: { test: true },
      }),
    );
  });

  test('regexp validation with status', () => {
    const onSubmit = jest.fn();
    const { getByPlaceholderText, getByText, getAllByText } = render(
      <Grommet>
        <Form onSubmit={onSubmit}>
          <FormField
            name="test"
            required
            error="invalid"
            validate={{
              regexp: /^[a-z]/i,
              status: 'info',
            }}
            placeholder="test input"
            a11yTitle="test"
          />
          <Button type="submit" primary label="Submit" />
        </Form>
      </Grommet>,
    );

    fireEvent.change(getByPlaceholderText('test input'), {
      target: { value: '1' },
    });
    expect(getByPlaceholderText('test input').value).toBe('1');
    fireEvent.click(getByText('Submit'));
    expect(onSubmit).toBeCalledTimes(1);
    expect(getAllByText('invalid')).toMatchSnapshot();
  });

  test('custom component', () => {
    const CustomTextInput = ({ name, value, onChange }) => (
      <div>
        <input
          type="text"
          placeholder="Username"
          name={name}
          id="test"
          value={value}
          onChange={onChange}
        />
      </div>
    );
    const onChange = jest.fn();
    const { getByPlaceholderText } = render(
      <Grommet>
        <Form onChange={onChange}>
          <FormField required>
            <CustomTextInput name="test" onChange={onChange} />
          </FormField>
        </Form>
      </Grommet>,
    );
    fireEvent.change(getByPlaceholderText('Username'), {
      target: { value: 'v' },
    });
    expect(getByPlaceholderText('Username').value).toBe('v');
    expect(onChange).toBeCalledTimes(1);
  });

  /* The three following tests align with FormField's supported 'validate' types
   * FormField's 'validate' prop accepts the following types:
   * 1) object in the shape of: {
   *  regexp?: object,
   *  message?: string | React.ReactNode,
   *  status?: 'error' | 'info'
   * }
   * 2) function: (...args: any[]) => any )
   * 3) array of 1) and/or 2) above
   */
  test('should validate when supplied an object', () => {
    const regexValidation = {
      regexp: /(?=.*?[#?!@$ %^&*-])/,
      message: 'At least one special character or space',
      status: 'error',
    };
    const expectedMessage = 'At least one special character or space';

    const { getByPlaceholderText, getByText, queryByText } = render(
      <Grommet>
        <Form>
          <FormField
            label="Create a Password"
            name="password"
            // required
            validate={regexValidation}
            // placeholder="Enter Password"
          >
            <TextInput name="password" placeholder="Enter Password" />
          </FormField>
          <Button type="submit" label="Submit" />
        </Form>
      </Grommet>,
    );

    const input = getByPlaceholderText('Enter Password');
    const submitButton = getByText('Submit');

    // Absence of a special character in input should display
    // 'special character' error message
    fireEvent.change(input, {
      target: { value: 'abcde' },
    });
    fireEvent.click(submitButton);
    expect(getByText(expectedMessage).innerHTML).toBeTruthy();

    // Including a special character should validate. 'Special character'
    // error message should not be displayed.
    fireEvent.change(input, {
      target: { value: 'abcde%' },
    });
    fireEvent.click(submitButton);
    expect(queryByText(expectedMessage)).toBeNull();
  });

  test('should validate when supplied a function', () => {
    const functionValidation = (combination) =>
      combination === '12345'
        ? {
            message:
              "That's amazing. I've got the same combination on my luggage!",
            status: 'info',
          }
        : undefined;
    const infoMessage =
      "That's amazing. I've got the same combination on my luggage!";

    const { getByPlaceholderText, getByText, queryByText } = render(
      <Grommet>
        <Form>
          <FormField
            label="Druidia Shield Combination"
            name="combination"
            validate={functionValidation}
          >
            <TextInput name="combination" placeholder="Enter Combination" />
          </FormField>
          <Button type="submit" label="Submit" />
        </Form>
      </Grommet>,
    );

    const input = getByPlaceholderText('Enter Combination');
    const submitButton = getByText('Submit');

    // If combination input matches value in function, should display
    // info message
    fireEvent.change(input, {
      target: { value: '12345' },
    });
    fireEvent.click(submitButton);
    expect(getByText(infoMessage)).toBeTruthy();

    // Combination info message should not be shown if value does not match.
    fireEvent.change(input, {
      target: { value: 'abcde%' },
    });
    fireEvent.click(submitButton);
    expect(queryByText(infoMessage)).toBeNull();
  });

  test(`should validate with array of objects and/or functions`, () => {
    const validationArray = [
      {
        regexp: /(?=.*?[0-9])/,
        message: 'At least one number',
        status: 'error',
      },
      {
        regexp: /.{5,}/,
        message: 'At least five characters',
        status: 'error',
      },
      (combination) =>
        combination === '12345'
          ? {
              message:
                "That's amazing. I've got the same combination on my luggage!",
              status: 'info',
            }
          : undefined,
      {
        regexp: /(?=.*?[#?!@$ %^&*-])/,
        message: 'At least one special character or space',
        status: 'error',
      },
    ];

    const validationMessages = [
      'At least one number',
      'At least five characters',
      "That's amazing. I've got the same combination on my luggage!",
      'At least one special character or space',
    ];

    const { getByPlaceholderText, getByText, queryByText } = render(
      <Grommet>
        <Form>
          <FormField
            label="Druidia Shield Combination"
            name="combination"
            validate={validationArray}
          >
            <TextInput name="combination" placeholder="Enter Combination" />
          </FormField>
          <Button type="submit" label="Submit" />
        </Form>
      </Grommet>,
    );

    const input = getByPlaceholderText('Enter Combination');
    const submitButton = getByText('Submit');

    // Needs to include a number. Show message.
    fireEvent.change(input, {
      target: { value: 'a' },
    });
    fireEvent.click(submitButton);
    expect(getByText('At least one number')).toBeTruthy();

    // Needs five characters. Show message.
    fireEvent.change(input, {
      target: { value: '1' },
    });
    fireEvent.click(submitButton);
    expect(getByText('At least five characters')).toBeTruthy();

    // Still needs five characters. Show message.
    fireEvent.change(input, {
      target: { value: '12' },
    });
    fireEvent.click(submitButton);
    expect(getByText('At least five characters')).toBeTruthy();

    // Input satifies condition in funciton. Show message.
    fireEvent.change(input, {
      target: { value: '12345' },
    });
    fireEvent.click(submitButton);

    expect(
      getByText("That's amazing. I've got the same combination on my luggage!"),
    ).toBeTruthy();

    // No special character included. Show message.
    fireEvent.change(input, {
      target: { value: '123456' },
    });
    fireEvent.click(submitButton);
    expect(getByText('At least one special character or space')).toBeTruthy();

    // All validation criteria met, so none of the messages should appear.
    fireEvent.change(input, {
      target: { value: '123456%' },
    });
    fireEvent.click(submitButton);
    validationMessages.forEach((message) =>
      expect(queryByText(message)).toBeNull(),
    );
  });

  test('form with select', () => {
    const onChange = jest.fn();
    window.scrollTo = jest.fn();
    const { getByPlaceholderText } = render(
      <Grommet>
        <Form>
          <FormField>
            <Select
              a11yTitle="select form"
              name="select"
              placeholder="test input"
              options={['small', 'medium', 'large']}
              onChange={onChange}
            />
          </FormField>
          <Button type="submit" primary label="Submit" />
        </Form>
      </Grommet>,
    );

    fireEvent.click(getByPlaceholderText('test input'));
    fireEvent.click(document.activeElement.querySelector('button'));
    expect(getByPlaceholderText('test input').value).toEqual('small');
    expect(onChange).toBeCalledWith(
      expect.objectContaining({ value: 'small' }),
    );
    window.scrollTo.mockRestore();
  });

  test('uncontrolled onChange with touched', () => {
    const onChange = jest.fn();
    const { getByPlaceholderText } = render(
      <Grommet>
        <Form onChange={onChange}>
          <FormField
            name="test"
            required
            placeholder="test input"
            a11yTitle="test"
          />
          <Button type="reset" primary label="Reset" />
        </Form>
      </Grommet>,
    );

    fireEvent.change(getByPlaceholderText('test input'), {
      target: { value: 'Input has changed' },
    });

    expect(onChange).toBeCalledWith(
      { test: 'Input has changed' },
      { touched: { test: true } },
    );
  });

  test('reset clears select, checkbox, radiobuttongroup', () => {
    const onReset = jest.fn();
    const { container, getByPlaceholderText, getByText } = render(
      <Grommet>
        <Form onReset={onReset}>
          <FormField
            label="Select Size"
            htmlFor="test-select"
            name="test-select"
          >
            <Select
              options={['small', 'medium', 'large']}
              name="test-select"
              id="test-select"
              placeholder="test select"
            />
          </FormField>
          <FormField
            label="CheckBox"
            htmlFor="test-checkbox"
            name="test-checkbox"
          >
            <CheckBox
              label="test-checkbox"
              name="test-checkbox"
              id="test-checkbox"
            />
          </FormField>
          <FormField
            label="RadioButtonGroup"
            htmlFor="test-radiobuttongroup"
            name="test-radiobuttongroup"
          >
            <RadioButtonGroup
              options={['one', 'two', 'three']}
              name="test-radiobuttongroup"
              id="test-radiobuttongroup"
            />
          </FormField>
          <Button type="reset" primary label="Reset" />
        </Form>
      </Grommet>,
    );

    fireEvent.click(getByPlaceholderText('test select'));
    fireEvent.click(getByText('small'));
    fireEvent.click(getByText('test-checkbox'));
    fireEvent.click(getByText('two'));

    expect(container.firstChild).toMatchSnapshot();
    fireEvent.click(getByText('Reset'));
    expect(container.firstChild).toMatchSnapshot();
  });

  test('form with select without name prop', () => {
    const onChange = jest.fn();
    window.scrollTo = jest.fn();
    const { getByPlaceholderText } = render(
      <Grommet>
        <Form>
          <FormField>
            <Select
              a11yTitle="select form"
              placeholder="test input"
              options={['small', 'medium', 'large']}
              onChange={onChange}
            />
          </FormField>
          <Button type="submit" primary label="Submit" />
        </Form>
      </Grommet>,
    );

    fireEvent.click(getByPlaceholderText('test input'));
    fireEvent.click(document.activeElement.querySelector('button'));
    expect(getByPlaceholderText('test input').value).toEqual('small');
    expect(onChange).toBeCalledWith(
      expect.objectContaining({ value: 'small' }),
    );
    window.scrollTo.mockRestore();
  });

  test(`dynamicly removed fields using blur validation
  don't keep validation errors`, () => {
    jest.useFakeTimers();
    const onValidate = jest.fn();
    const onSubmit = jest.fn();

    const Test = () => {
      const [toggle, setToggle] = React.useState(false);

      return (
        <Form validate="blur" onValidate={onValidate} onSubmit={onSubmit}>
          <FormField name="name">
            <TextInput name="name" placeholder="test name" />
          </FormField>
          <FormField name="toggle">
            <CheckBox
              name="toggle"
              label="toggle"
              onChange={({ target: { checked } }) => setToggle(checked)}
            />
          </FormField>
          {toggle && (
            <FormField name="mood" required>
              <TextInput name="mood" placeholder="test mood" />
            </FormField>
          )}
          <Button type="submit" primary label="Submit" />
        </Form>
      );
    };
    const { getByPlaceholderText, getByLabelText, container } = render(
      <Grommet>
        <Test />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();

    const nameField = getByPlaceholderText('test name');
    const toggleField = getByLabelText('toggle');

    // add mood
    fireEvent.click(toggleField);

    expect(container.firstChild).toMatchSnapshot();
    const moodField = getByPlaceholderText('test mood');

    // focus in and out of mood, should fail validation
    act(() => moodField.focus());
    act(() => toggleField.focus());
    act(() => jest.advanceTimersByTime(200)); // allow validations to run
    expect(onValidate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        errors: { mood: 'required' },
        infos: {},
        valid: false,
      }),
    );

    // set mood, should pass validation
    act(() => moodField.focus());
    fireEvent.change(moodField, { target: { value: 'testy' } });
    act(() => toggleField.focus());
    act(() => jest.advanceTimersByTime(200)); // allow validations to run
    expect(onValidate).toHaveBeenLastCalledWith(
      expect.objectContaining({ errors: {}, infos: {}, valid: true }),
    );

    // clear mood, should fail validation
    act(() => moodField.focus());
    fireEvent.change(moodField, { target: { value: '' } });
    act(() => toggleField.focus());
    act(() => jest.advanceTimersByTime(200)); // allow validations to run
    expect(onValidate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        errors: { mood: 'required' },
        infos: {},
        valid: false,
      }),
    );

    // remove mood, should clear validation
    fireEvent.click(toggleField);

    act(() => nameField.focus());
    act(() => toggleField.focus());
    act(() => jest.advanceTimersByTime(200)); // allow validations to run
    expect(onValidate).toHaveBeenLastCalledWith(
      expect.objectContaining({ errors: {}, infos: {}, valid: true }),
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`valid flag on component mount`, () => {
    jest.useFakeTimers();
    const onValidate = jest.fn();

    const defaultValue = {
      name: 'J',
      mood: '',
    };

    const Test = () => {
      const [value, setValue] = React.useState(defaultValue);

      return (
        <Form
          value={value}
          validate="blur"
          onChange={(nextValue) => {
            setValue(nextValue);
          }}
          onValidate={onValidate}
        >
          <FormField
            validate={[
              (name) => {
                if (name && name.length === 1) return 'must be >1 character';
                return undefined;
              },
            ]}
            name="name"
          >
            <TextInput name="name" placeholder="test name" />
          </FormField>
          <Button label="Focus out" />
        </Form>
      );
    };
    const { getByPlaceholderText, getByText } = render(
      <Grommet>
        <Test />
      </Grommet>,
    );

    expect(onValidate).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        errors: { name: 'must be >1 character' },
        infos: {},
        valid: false,
      }),
    );

    const nameField = getByPlaceholderText('test name');

    act(() => nameField.focus());
    fireEvent.change(nameField, { target: { value: 'John' } });
    act(() => getByText('Focus out').focus());

    act(() => jest.advanceTimersByTime(200)); // allow validations to run
    expect(onValidate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        errors: {},
        infos: {},
        valid: true,
      }),
    );
  });

  test(`dynamicly removed fields should be removed from form value`, () => {
    jest.useFakeTimers();
    const onValidate = jest.fn();
    const onSubmit = jest.fn();

    const Test = () => {
      const [toggle, setToggle] = React.useState(false);

      return (
        <Form validate="blur" onValidate={onValidate} onSubmit={onSubmit}>
          <FormField name="name">
            <TextInput name="name" placeholder="test name" />
          </FormField>
          <FormField name="toggle">
            <CheckBox
              name="toggle"
              label="toggle"
              onChange={({ target: { checked } }) => setToggle(checked)}
            />
          </FormField>
          {toggle && (
            <FormField name="mood" required>
              <TextInput name="mood" placeholder="test mood" />
            </FormField>
          )}
          <Button type="submit" primary label="Submit" />
        </Form>
      );
    };
    const { getByPlaceholderText, getByLabelText, getByText, container } =
      render(
        <Grommet>
          <Test />
        </Grommet>,
      );

    expect(container.firstChild).toMatchSnapshot();

    const nameField = getByPlaceholderText('test name');
    const toggleField = getByLabelText('toggle');

    // add name
    fireEvent.change(nameField, { target: { value: 'name' } });

    // add mood
    fireEvent.click(toggleField);

    const moodField = getByPlaceholderText('test mood');

    // set mood
    fireEvent.change(moodField, { target: { value: 'happy' } });

    // remove mood
    fireEvent.click(toggleField);

    expect(container.firstChild).toMatchSnapshot();
    fireEvent.click(getByText('Submit'));
    expect(onSubmit).toBeCalledWith(
      expect.objectContaining({
        value: { name: 'name', toggle: false },
      }),
    );
  });

  test('should validate when submit is fired directly on input', () => {
    render(
      <Grommet>
        <Form>
          <FormField
            label="My field"
            name="my-field"
            htmlFor="my-field"
            validate={{
              regexp: /^some-value/,
              message: 'Invalid email address',
              status: 'error',
            }}
          >
            <TextInput
              name="my-field"
              id="my-field"
              placeholder="placeholder text"
            />
          </FormField>
          <Button label="Submit" type="submit" />
        </Form>
      </Grommet>,
    );

    const element = screen.getByPlaceholderText('placeholder text');
    fireEvent.submit(element);
    expect(screen.getByText('Invalid email address')).toBeTruthy();
  });
});
