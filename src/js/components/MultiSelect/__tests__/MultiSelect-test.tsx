import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import 'regenerator-runtime/runtime';
import 'jest-styled-components';
import '@testing-library/jest-dom';

import { Grommet } from '../..';
import { MultiSelect } from '..';

describe('MultiSelect Controlled', () => {
  test('should not have accessibility violations', async () => {
    const { container } = render(
      <Grommet>
        <MultiSelect options={['one', 'two', 'three']} a11yTitle="test" />
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
});
