import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import 'jest-styled-components';
import 'jest-axe/extend-expect';
import 'regenerator-runtime/runtime';

import { Grommet } from '../../Grommet';
import { Image } from '..';
import { Button } from '../../Button';

const opacityTypes = ['weak', 'medium', 'strong', '0.3', true, false];
const SRC =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABGdBTUEAALGPC/xhBQAAAA1JREFUCB1jYGBg+A8AAQQBAB5znEAAAAAASUVORK5CYII='; // eslint-disable-line max-len

test('image should have no violations', async () => {
  const { container } = render(
    <Grommet>
      <Image src={SRC} a11yTitle="Alt Text" />
    </Grommet>,
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('Image renders', () => {
  const { container } = render(
    <Grommet>
      <Image src={SRC} />
    </Grommet>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('Image renders outside grommet wrapper', () => {
  const { container } = render(<Image src={SRC} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('Image renders with aria-label', () => {
  const { container, getByLabelText } = render(
    <Grommet>
      <Image a11yTitle="aria-label-text" src={SRC} />
      <Image aria-label="aria-label-text-2" src={SRC} />
    </Grommet>,
  );

  expect(getByLabelText('aria-label-text')).toBeTruthy();
  expect(getByLabelText('aria-label-text-2')).toBeTruthy();
  expect(container.firstChild).toMatchSnapshot();
});

test('Image fit renders', () => {
  const { container } = render(
    <Grommet>
      <Image fit="cover" src={SRC} />
      <Image fit="contain" src={SRC} />
    </Grommet>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

opacityTypes.forEach((opacity) => {
  test(`Image opacity of ${opacity} renders`, () => {
    const { container } = render(
      <Grommet>
        <Image opacity={opacity} src={SRC} />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});

test('Image fillProp renders', () => {
  const { container } = render(
    <Grommet>
      <Image fill src={SRC} />
      <Image fill={false} src={SRC} />
      <Image fill="horizontal" src={SRC} />
      <Image fill="vertical" src={SRC} />
    </Grommet>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('Image onError', () => {
  const onError = jest.fn();
  const { getByAltText } = render(
    <Grommet>
      <Image src="test.png" alt="test" onError={onError} />
    </Grommet>,
  );

  fireEvent(getByAltText('test'), new Event('error'));

  expect(onError).toHaveBeenCalledTimes(1);
});

test('Image onLoad', () => {
  const onLoad = jest.fn();
  render(
    <Grommet>
      <Image src="test.png" alt="test" onLoad={onLoad} />
    </Grommet>,
  );

  expect(onLoad).not.toHaveBeenCalled();

  const image = screen.getByRole('img', { name: 'test' });
  fireEvent.load(image);

  expect(onLoad).toHaveBeenCalledTimes(1);
});

test('Image fallback', async () => {
  const user = userEvent.setup();

  const onError = jest.fn();
  const fallbackImage = 'https://v2.grommet.io/assets/IMG_4245.jpg';
  const regularImage = 'https://v2.grommet.io/img/stak-hurrah.svg';

  const Test = () => {
    const [imgSrc, setImgSrc] = useState('test.png');
    return (
      <Grommet>
        <Image
          fill="horizontal"
          fallback={fallbackImage}
          src={imgSrc}
          alt="test"
          onError={onError}
        />
        <Button
          label="Update Image"
          onClick={() => {
            setImgSrc(regularImage);
          }}
        />
      </Grommet>
    );
  };

  const { getByAltText } = render(<Test />);

  fireEvent(getByAltText('test'), new Event('error'));
  let imgSrc = screen.getByRole<HTMLImageElement>('img').src;
  expect(imgSrc).toEqual(fallbackImage);

  await user.click(screen.getByRole('button', { name: /Update Image/i }));
  imgSrc = screen.getByRole<HTMLImageElement>('img').src;
  expect(imgSrc).toEqual(regularImage);
});
