import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import 'regenerator-runtime/runtime';
import 'jest-styled-components';

import { createPortal, expectPortal } from '../../../utils/portal';

import { Grommet } from '../../Grommet';
import { DropButton } from '..';

describe('DropButton', () => {
  beforeEach(createPortal);

  test('should have no accessibility violations', async () => {
    const { container } = render(
      <Grommet>
        <DropButton
          a11yTitle="test"
          dropContent={<div id="drop-contents">drop contents</div>}
        />
      </Grommet>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
    expect(container.firstChild).toMatchSnapshot();
  });

  test('closed', () => {
    window.scrollTo = jest.fn();

    const { container } = render(
      <Grommet>
        <DropButton
          label="Dropper"
          dropContent={<div id="drop-contents">drop contents</div>}
        />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('closed outside grommet wrapper', () => {
    window.scrollTo = jest.fn();

    const { container } = render(
      <DropButton
        label="Dropper"
        dropContent={<div id="drop-contents">drop contents</div>}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('opened', () => {
    const { container } = render(
      <Grommet>
        <DropButton
          label="Dropper"
          open
          dropContent={<div id="drop-contents">drop contents</div>}
        />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('open and close', () => {
    window.scrollTo = jest.fn();
    const onClose = jest.fn((event) => event.persist());

    const { getByText, container } = render(
      <Grommet>
        <DropButton
          label="Dropper"
          onClose={onClose}
          dropContent={<div id="drop-contents">Drop Contents</div>}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
    expect(document.getElementById('drop-contents')).toBeNull();

    fireEvent.click(getByText('Dropper'));
    expectPortal('drop-contents').toMatchSnapshot();
    expect(document.getElementById('drop-contents')).not.toBeNull();

    fireEvent.click(getByText('Dropper'));
    expect(document.getElementById('drop-contents')).toBeNull();
    expect(window.scrollTo).toBeCalled();

    expect(onClose).toBeCalledWith(expect.objectContaining({ type: 'click' }));
  });

  test('close by clicking outside', (done) => {
    const onClose = jest.fn();
    const onOpen = jest.fn((event) => event.persist());

    const { getByText, container } = render(
      <Grommet>
        <DropButton
          label="Dropper"
          onClose={onClose}
          onOpen={onOpen}
          dropContent={<div id="drop-contents">Drop Contents</div>}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
    expect(document.getElementById('drop-contents')).toBeNull();

    fireEvent.click(getByText('Dropper'));
    expectPortal('drop-contents').toMatchSnapshot();

    expect(onOpen).toBeCalledWith(expect.objectContaining({ type: 'click' }));
    expect(document.getElementById('drop-contents')).not.toBeNull();

    fireEvent(
      document,
      new MouseEvent('mousedown', { bubbles: true, cancelable: true }),
    );

    setTimeout(() => {
      expect(document.getElementById('drop-contents')).toBeNull();
      done();
    }, 50);

    expect(onClose).toBeCalledWith(
      expect.objectContaining({ type: 'mousedown' }),
    );
  });

  test('disabled', () => {
    const { getByText, container } = render(
      <Grommet>
        <DropButton
          disabled
          label="Dropper"
          dropContent={<div id="drop-contents">Drop Contents</div>}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
    expect(document.getElementById('drop-contents')).toBeNull();

    fireEvent.click(getByText('Dropper'));
    expect(document.getElementById('drop-contents')).toBeNull();
  });

  test('opened ref', () => {
    const ref: React.RefObject<HTMLButtonElement | null> = React.createRef();
    const { container } = render(
      <Grommet>
        <DropButton
          ref={ref}
          open
          label="Dropper"
          dropContent={<div id="drop-contents">Drop Contents</div>}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
    expectPortal('drop-contents').toMatchSnapshot();
  });

  test('ref function', () => {
    const ref: React.Ref<HTMLElement> = jest.fn();
    const { container } = render(
      <Grommet>
        <DropButton
          ref={ref}
          open
          label="Dropper"
          dropContent={<div id="drop-contents">Drop Contents</div>}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
    expect(ref).toBeCalled();
    expectPortal('drop-contents').toMatchSnapshot();
  });

  test('rendersr a11yTitle and aria-label', () => {
    const LABEL = 'Test Label';
    const { container, getByLabelText } = render(
      <Grommet>
        <DropButton
          label="Dropper"
          aria-label={LABEL}
          dropContent={<div id="drop-contents">drop contents</div>}
        />
        <DropButton
          label="Dropper"
          a11yTitle={`${LABEL}-2`}
          dropContent={<div id="drop-contents">drop contents</div>}
        />
      </Grommet>,
    );
    expect(getByLabelText(LABEL)).toBeTruthy();
    expect(getByLabelText(`${LABEL}-2`)).toBeTruthy();
    expect(container.firstChild).toMatchSnapshot();
  });
});
