import React from 'react';
import renderer from 'react-test-renderer';
import { cleanup, fireEvent, render } from '@testing-library/react';
import 'jest-styled-components';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import 'regenerator-runtime/runtime';

import { Grommet } from '../../Grommet';
import { TextArea } from '..';

describe('TextArea', () => {
  afterEach(cleanup);

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
    const component = renderer.create(
      <Grommet>
        <TextArea id="item" name="item" />
      </Grommet>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('placeholder', () => {
    const component = renderer.create(
      <Grommet>
        <TextArea id="item" name="item" placeholder="placeholder" />
      </Grommet>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('plain', () => {
    const component = renderer.create(
      <Grommet>
        <TextArea id="item" name="item" plain />
      </Grommet>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('disabled', () => {
    const component = renderer.create(
      <Grommet>
        <TextArea disabled id="item" name="item" plain />
      </Grommet>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('focusIndicator', () => {
    const component = renderer.create(
      <Grommet>
        <TextArea id="item" name="item" focusIndicator />
      </Grommet>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('fill', () => {
    const component = renderer.create(
      <Grommet>
        <TextArea id="item" name="item" fill />
      </Grommet>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  [true, false, 'horizontal', 'vertical'].forEach(resize => {
    test(`resize ${resize}`, () => {
      const component = renderer.create(
        <Grommet>
          <TextArea id="item" name="item" resize={resize} />
        </Grommet>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  ['small', 'medium', 'large'].forEach(size => {
    test(`size ${size}`, () => {
      const component = renderer.create(
        <Grommet>
          <TextArea id="item" name="item" size={size} />
        </Grommet>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Event tests', () => {
    afterEach(cleanup);
    const keyEvent = {
      key: 'Backspace',
      keyCode: 8,
      which: 8,
    };

    test(`onKeyDown`, () => {
      let capturedEvent = null;
      const callback = event => {
        const { key, keyCode, which } = event;
        capturedEvent = { key, keyCode, which };
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
      let capturedEvent = null;
      const callback = event => {
        const { key, keyCode, which } = event;
        capturedEvent = { key, keyCode, which };
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
  });
});
