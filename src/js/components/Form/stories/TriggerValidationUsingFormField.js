import React from 'react';

import { StatusGood } from 'grommet-icons';
import { Box, Button, Grommet, Form, FormField } from 'grommet';
import { grommet } from 'grommet/themes';

export const TriggerValidationUsingFormField = () => (
  <Grommet full theme={grommet}>
    <Box fill align="center" justify="center">
      <Box width="medium">
        <Form
          onReset={(event) => console.log(event)}
          onSubmit={({ value }) => console.log('Submit', value)}
        >
          <FormField
            label="First Name"
            name="firstName"
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
                    message: (
                      <Box align="end">
                        <StatusGood />
                      </Box>
                    ),
                    status: 'info',
                  };
                return undefined;
              },
            ]}
            validateOn="blur"
          />

          <FormField
            label="Last Name"
            name="lastName"
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
                    message: (
                      <Box align="end">
                        <StatusGood />
                      </Box>
                    ),
                    status: 'info',
                  };
                return undefined;
              },
            ]}
            validateOn="submit"
          />

          <FormField
            label="Phone Number"
            name="phoneNumber"
            required
            validate={[
              { regexp: /^[0-9]*$/ },
              (number) => {
                if (number && number.length > 10) return 'Only 10 numbers';
                return undefined;
              },
            ]}
            validateOn="change"
          />

          <Box direction="row" justify="between" margin={{ top: 'medium' }}>
            <Button label="Cancel" />
            <Button type="reset" label="Reset" />
            <Button type="submit" label="Update" primary />
          </Box>
        </Form>
      </Box>
    </Box>
  </Grommet>
);

TriggerValidationUsingFormField.storyName =
  'Trigger Validation using Form Field';

export default {
  title: 'Input/Form/Trigger Validation using Form Field',
};
