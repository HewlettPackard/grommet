import React, { useState } from 'react';
import 'jest-styled-components';
import 'jest-axe/extend-expect';
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';

import { axe } from 'jest-axe';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createPortal, expectPortal } from '../../../utils/portal';

import { Grommet, Notification, Button } from '../..';

describe('Notification', () => {
  beforeEach(createPortal);
  test('should have no accessibility violations', async () => {
    const { container, asFragment } = render(
      <Grommet>
        <Notification title="title" />
      </Grommet>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
    expect(asFragment()).toMatchSnapshot();
  });

  test('should have no accessibility violations for toast', async () => {
    const { container, asFragment } = render(
      <Grommet>
        <Notification toast title="title" message="message" />
      </Grommet>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
    expect(asFragment()).toMatchSnapshot();
  });

  test('onClose', () => {
    const onClose = jest.fn();
    render(
      <Grommet>
        <Notification title="Title" onClose={onClose} />
      </Grommet>,
    );

    userEvent.click(screen.getByRole('button'));
    expect(onClose).toBeCalled();
  });

  [
    'top',
    'bottom',
    'left',
    'right',
    'start',
    'end',
    'center',
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ].forEach((positions) =>
    test(`position ${positions}`, () => {
      render(
        <Grommet>
          <Notification
            id="position-test"
            toast={{ position: positions }}
            title="title"
            message="message"
          >
            This is a layer
          </Notification>
        </Grommet>,
      );
      expectPortal('position-test').toMatchSnapshot();
    }),
  );

  test('autoClose true', () => {
    jest.useFakeTimers('modern');
    const onOpen = jest.fn();
    const onClose = jest.fn();
    const Test = () => {
      const [visible, setVisible] = useState(false);
      return (
        <Grommet>
          <Button
            label="Show Notification"
            onClick={() => {
              onOpen();
              setVisible(true);
            }}
          />
          {visible && (
            <Notification
              toast={{ autoClose: true }}
              title="Status Title"
              message="Messages should be at max two lines of text."
              onClose={() => {
                onClose();
                setVisible(false);
              }}
            />
          )}
        </Grommet>
      );
    };
    render(<Test />);
    userEvent.click(screen.getByRole('button', { name: 'Show Notification' }));
    expect(screen.getByText('Status Title')).toBeInTheDocument();
    expect(onOpen).toHaveBeenCalled();
    act(() => {
      jest.advanceTimersByTime(9000);
    });
    expect(onClose).toHaveBeenCalled();
  });

  test('autoClose false', () => {
    jest.useFakeTimers('modern');
    const onOpen = jest.fn();
    const onClose = jest.fn();
    const Test = () => {
      const [visible, setVisible] = useState(false);
      return (
        <Grommet>
          <Button
            label="Show Notification"
            onClick={() => {
              onOpen();
              setVisible(true);
            }}
          />
          {visible && (
            <Notification
              toast={{ autoClose: false }}
              title="Status Title"
              message="Messages should be at max two lines of text."
              onClose={() => {
                onClose();
                setVisible(false);
              }}
            />
          )}
        </Grommet>
      );
    };
    render(<Test />);
    userEvent.click(screen.getByRole('button', { name: 'Show Notification' }));
    expect(onOpen).toHaveBeenCalled();
    act(() => {
      jest.advanceTimersByTime(9000);
    });
    expect(onClose).not.toHaveBeenCalled();
  });
});
