import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { axe } from 'jest-axe';
import 'jest-styled-components';
import 'jest-axe/extend-expect';
import 'regenerator-runtime/runtime';

import { Grommet } from '../../Grommet';
import { TextArea, TextAreaProps } from '..';

describe('TextArea', () => {
  test('should not have accessibility violations', async () => {
    const { container } = render(
      <Grommet>
        <TextArea a11yTitle="test" id="item" name="item" />
      </Grommet>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('basic', () => {
    const { container } = render(
      <Grommet>
        <TextArea id="item" name="item" />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('basic outside grommet wrapper', () => {
    const { container } = render(<TextArea id="item" name="item" />);

    expect(container.firstChild).toMatchSnapshot();
  });

  test('placeholder', () => {
    const { container } = render(
      <Grommet>
        <TextArea id="item" name="item" placeholder="placeholder" />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('plain', () => {
    const { container } = render(
      <Grommet>
        <TextArea id="item" name="item" plain />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('disabled', () => {
    const { container } = render(
      <Grommet>
        <TextArea disabled id="item" name="item" plain />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('focusIndicator', () => {
    const { container } = render(
      <Grommet>
        <TextArea id="item" name="item" focusIndicator />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('fill', () => {
    const { container } = render(
      <Grommet>
        <TextArea id="item" name="item" fill />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  const resizes: TextAreaProps['resize'][] = [
    true,
    false,
    'horizontal',
    'vertical',
  ];
  resizes.forEach((resize) => {
    test(`resize ${resize}`, () => {
      const { container } = render(
        <Grommet>
          <TextArea id="item" name="item" resize={resize} />
        </Grommet>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  ['small', 'medium', 'large'].forEach((size) => {
    test(`size ${size}`, () => {
      const { container } = render(
        <Grommet>
          <TextArea id="item" name="item" size={size} />
        </Grommet>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Event tests', () => {
    const keyEvent = {
      key: 'Backspace',
      keyCode: 8,
      which: 8,
    };

    test(`onKeyDown`, () => {
      let capturedEvent: React.KeyboardEvent<HTMLTextAreaElement> | null = null;
      const callback: React.KeyboardEventHandler<HTMLTextAreaElement> = (
        event,
      ) => {
        capturedEvent = event;
      };

      const component = render(
        <Grommet>
          <TextArea
            id="item"
            name="item"
            placeholder="item"
            onKeyDown={callback}
          />
        </Grommet>,
      );

      const textArea = component.getByPlaceholderText('item');

      fireEvent.keyDown(textArea, keyEvent);
      expect(capturedEvent).toEqual(expect.objectContaining(keyEvent));
    });

    test(`onKeyUp`, () => {
      let capturedEvent: React.KeyboardEvent<HTMLTextAreaElement> | null = null;
      const callback: React.KeyboardEventHandler<HTMLTextAreaElement> = (
        event,
      ) => {
        capturedEvent = event;
      };

      const component = render(
        <Grommet>
          <TextArea
            id="item"
            name="item"
            placeholder="item"
            onKeyUp={callback}
          />
        </Grommet>,
      );

      const textArea = component.getByPlaceholderText('item');

      fireEvent.keyUp(textArea, keyEvent);

      expect(capturedEvent).toEqual(expect.objectContaining(keyEvent));
    });

    test('onFocus', () => {
      const onFocus = jest.fn();
      const { container, getByPlaceholderText } = render(
        <Grommet>
          <TextArea name="item" placeholder="item" onFocus={onFocus} />
        </Grommet>,
      );
      fireEvent.focus(getByPlaceholderText('item'));
      expect(container.firstChild).toMatchSnapshot();
      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    test('onChange', () => {
      const onChange = jest.fn();
      const { getByPlaceholderText } = render(
        <Grommet>
          <TextArea name="item" placeholder="item" onChange={onChange} />
        </Grommet>,
      );
      const input = getByPlaceholderText('item') as HTMLInputElement;
      fireEvent.change(input, {
        target: { value: 'Test' },
      });
      expect(input.value).toEqual('Test');
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('onBlur is being called', () => {
      const onBlur = jest.fn();
      const { getByPlaceholderText } = render(
        <Grommet>
          <TextArea name="item" placeholder="item" onBlur={onBlur} />
        </Grommet>,
      );
      fireEvent.blur(getByPlaceholderText('item'));
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    test('renders size', () => {
      const { container } = render(
        <Grommet>
          <TextArea size="xsmall" />
          <TextArea size="small" />
          <TextArea size="medium" />
          <TextArea size="large" />
          <TextArea size="xlarge" />
          <TextArea size="xxlarge" />
          <TextArea size="2xl" />
          <TextArea size="3xl" />
          <TextArea size="4xl" />
          <TextArea size="5xl" />
          <TextArea size="6xl" />
          <TextArea size="16px" />
          <TextArea size="1rem" />
          <TextArea size="100%" />
        </Grommet>,
      );
      expect(container.children).toMatchSnapshot();
    });
  });

  test('custom theme input font size', () => {
    const { container } = render(
      <Grommet theme={{ global: { input: { font: { size: '16px' } } } }}>
        <TextArea />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should apply a11yTitle or aria-label', () => {
    const { container, getByLabelText } = render(
      <Grommet>
        <TextArea a11yTitle="item" id="item" name="item" />
        <TextArea aria-label="item-2" id="item-2" name="item-2" />
      </Grommet>,
    );

    expect(getByLabelText('item')).toBeTruthy();
    expect(getByLabelText('item-2')).toBeTruthy();
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('resize keyboard controls', () => {
    beforeEach(() => {
      // Mock getBoundingClientRect
      Element.prototype.getBoundingClientRect = jest.fn(() => ({
        width: 100,
        height: 100,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));
    });

    test('should resize horizontally with arrow keys when resize="horizontal"', () => {
      // Mock document.activeElement
      Object.defineProperty(document, 'activeElement', {
        get: jest.fn(),
        configurable: true,
      });

      const { getByRole } = render(
        <Grommet>
          <TextArea resize="horizontal" value="" />
        </Grommet>,
      );

      const textarea = getByRole('textbox');
      const initialWidth = textarea.getBoundingClientRect().width;

      // Set the mock to return the textarea
      jest.spyOn(document, 'activeElement', 'get').mockReturnValue(textarea);

      fireEvent.keyDown(textarea, { code: 'ArrowUp' });
      expect(textarea.style.width).toBe(`${initialWidth + 10}px`);
      expect(textarea.style.height).toBe('');

      fireEvent.keyDown(textarea, { code: 'ArrowDown' });
      expect(textarea.style.width).toBe(`${initialWidth - 10}px`);
      expect(textarea.style.height).toBe('');
    });

    test('should resize vertically with arrow keys when resize="vertical"', () => {
      // Mock document.activeElement
      Object.defineProperty(document, 'activeElement', {
        get: jest.fn(),
        configurable: true,
      });

      const { getByRole } = render(
        <Grommet>
          <TextArea resize="vertical" value="" />
        </Grommet>,
      );

      const textarea = getByRole('textbox');
      const initialHeight = textarea.getBoundingClientRect().height;

      // Set the mock to return the textarea
      jest.spyOn(document, 'activeElement', 'get').mockReturnValue(textarea);

      fireEvent.keyDown(textarea, { code: 'ArrowUp' });
      expect(textarea.style.height).toBe(`${initialHeight + 10}px`);
      expect(textarea.style.width).toBe('');

      fireEvent.keyDown(textarea, { code: 'ArrowDown' });
      expect(textarea.style.height).toBe(`${initialHeight - 10}px`);
      expect(textarea.style.width).toBe('');
    });

    test('should resize both dimensions with arrow keys when resize=true', () => {
      // Mock document.activeElement
      Object.defineProperty(document, 'activeElement', {
        get: jest.fn(),
        configurable: true,
      });

      const { getByRole } = render(
        <Grommet>
          <TextArea resize={true} value="" />
        </Grommet>,
      );

      const textarea = getByRole('textbox');
      const initialHeight = textarea.getBoundingClientRect().height;
      const initialWidth = textarea.getBoundingClientRect().width;

      // Set the mock to return the textarea
      jest.spyOn(document, 'activeElement', 'get').mockReturnValue(textarea);

      fireEvent.keyDown(textarea, { code: 'ArrowUp' });
      expect(textarea.style.width).toBe(`${initialWidth + 10}px`);
      expect(textarea.style.height).toBe(`${initialHeight + 10}px`);

      fireEvent.keyDown(textarea, { code: 'ArrowDown' });
      expect(textarea.style.width).toBe(`${initialWidth - 10}px`);
      expect(textarea.style.height).toBe(`${initialHeight - 10}px`);
    });

    test('should not resize when resize=false', () => {
      const { getByRole } = render(
        <Grommet>
          <TextArea resize={false} value="" />
        </Grommet>,
      );

      const textarea = getByRole('textbox');

      fireEvent.keyDown(textarea, { code: 'ArrowUp' });
      expect(textarea.style.width).toBe('');
      expect(textarea.style.height).toBe('');

      fireEvent.keyDown(textarea, { code: 'ArrowDown' });
      expect(textarea.style.width).toBe('');
      expect(textarea.style.height).toBe('');
    });

    test('should not resize when textarea has value', () => {
      const { getByRole } = render(
        <Grommet>
          <TextArea resize={true} value="test value" />
        </Grommet>,
      );

      const textarea = getByRole('textbox');

      fireEvent.keyDown(textarea, { code: 'ArrowUp' });
      expect(textarea.style.width).toBe('');
      expect(textarea.style.height).toBe('');

      fireEvent.keyDown(textarea, { code: 'ArrowDown' });
      expect(textarea.style.width).toBe('');
      expect(textarea.style.height).toBe('');
    });
  });
});
