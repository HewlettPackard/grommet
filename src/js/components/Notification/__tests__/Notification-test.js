import React from 'react';
import 'jest-styled-components';
import 'jest-axe/extend-expect';
import 'regenerator-runtime/runtime';

import { axe } from 'jest-axe';
import { render, fireEvent, screen } from '@testing-library/react';

import { Grommet, Notification } from '../..';

describe('Notification', () => {
  test('should have no accessibility violations', async () => {
    const { container } = render(
      <Grommet>
        <Notification title="title" />
      </Grommet>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
    expect(container).toMatchSnapshot();
  });

  test('should have no accessibility violations for toast', async () => {
    const { container } = render(
      <Grommet>
        <Notification toast title="title" message="message" />
      </Grommet>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
    expect(container).toMatchSnapshot();
  });

  test('onClose', () => {
    const onClose = jest.fn();
    render(
      <Grommet>
        <Notification title="Title" onClose={onClose} />
      </Grommet>,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toBeCalled();
  });
});
