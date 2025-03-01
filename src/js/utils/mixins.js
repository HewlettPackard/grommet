import { css } from 'styled-components';

export const parseMetricToNum = (metric) => {
  if (typeof metric === 'number') return metric;
  if (metric.match(/\s/) && process.env.NODE_ENV !== 'production') {
    console.warn(`Invalid single measurement value: "${metric}"`);
  }
  return parseFloat(metric.match(/\d+(\.\d+)?/), 10);
};

export const edgeToNum = (size, theme) =>
  size ? parseMetricToNum(theme.global.edgeSize[size] || size) : 0;

export const fontSize = (size, lineHeight) => css`
  font-size: ${(props) =>
    `${
      (parseMetricToNum(size) /
        parseMetricToNum(props.theme.global.font.size)) *
      1
    }rem`};
  line-height: ${(props) =>
    lineHeight ||
    `${
      Math.ceil(
        parseMetricToNum(size) /
          parseMetricToNum(props.theme.global.lineHeight),
      ) *
      (parseMetricToNum(props.theme.global.lineHeight) / parseMetricToNum(size))
    }px`};
`;

export const breakpointStyle = (breakpoint, content, responsive) => {
  const st = 
  responsive === 'container'
    ? css`
        @container ${breakpoint.value && `(max-width: ${breakpoint.value}px)`} {
          ${content};
        }
      `
    : css`
        @media only screen ${breakpoint.value &&
          `and (max-width: ${breakpoint.value}px)`} {
          ${content};
        }
      `;
  console.log('Breakpoint', responsive, st);
  return st;
};

export const findAllByType = (component, type) => {
  let matches = [];

  if (component.type === type) {
    matches.push(component);
  }

  if (component.children) {
    component.children.forEach((child) => {
      matches = matches.concat(findAllByType(child, type));
    });
  }

  return matches;
};

export const getAvailableAtBadge = (availableAt, componentType) => [
  {
    url: `https://storybook.grommet.io/?selectedKind=${componentType}-${availableAt}&full=0&stories=1&panelRight=0`,
    badge:
      'https://cdn-images-1.medium.com/fit/c/120/120/1*TD1P0HtIH9zF0UEH28zYtw.png',
    label: 'Storybook',
  },
  {
    url: `https://codesandbox.io/s/github/grommet/grommet-sandbox?initialpath=/${availableAt.toLowerCase()}&module=%2Fsrc%2F${availableAt}.js`,
    badge: 'https://codesandbox.io/static/img/play-codesandbox.svg',
    label: 'CodeSandbox',
  },
];
