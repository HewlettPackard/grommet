import styled, { css } from 'styled-components';

import {
  alignContentStyle,
  alignStyle,
  backgroundStyle,
  borderStyle,
  breakpointStyle,
  edgeStyle,
  elevationStyle,
  fillStyle,
  focusStyle,
  genericStyles,
  getBreakpointStyle,
  getHoverIndicatorStyle,
  heightStyle,
  overflowStyle,
  parseMetricToNum,
  responsiveBorderStyle,
  widthStyle,
} from '../../utils';

import { roundStyle, styledComponentsConfig } from '../../utils/styles';

import { animationBounds, animationObjectStyle } from '../../utils/animation';

const BASIS_MAP = {
  auto: 'auto',
  full: '100%',
  '1/2': '50%',
  '1/4': '25%',
  '2/4': '50%',
  '3/4': '75%',
  '1/3': '33.33%',
  '2/3': '66.66%',
};

const basisStyle = css`
  flex-basis: ${(props) =>
    BASIS_MAP[props.basis] ||
    props.theme.global.size[props.basis] ||
    props.basis};
`;

// min-width and min-height needed because of this
// https://stackoverflow.com/questions/36247140/why-doesnt-flex-item-shrink-past-content-size
// we assume we are in the context of a Box going the other direction
// TODO: revisit this
const directionStyle = (direction, responsive, theme) => {
  const styles = [
    css`
      min-width: 0;
      min-height: 0;
      flex-direction: ${direction === 'row-responsive' ? 'row' : direction};
    `,
  ];
  if (direction === 'row-responsive' && theme.box.responsiveBreakpoint) {
    const breakpoint = getBreakpointStyle(
      theme,
      theme.box.responsiveBreakpoint,
    );
    if (breakpoint) {
      styles.push(
        breakpointStyle(
          breakpoint,
          `
        flex-direction: column;
        flex-basis: auto;
        justify-content: flex-start;
        align-items: stretch;
      `,
          responsive,
        ),
      );
    }
  }
  return styles;
};

const FLEX_MAP = {
  [true]: '1 1',
  [false]: '0 0',
  grow: '1 0',
  shrink: '0 1',
};

const flexGrowShrinkProp = (flex) => {
  if (typeof flex === 'boolean' || typeof flex === 'string') {
    return FLEX_MAP[flex];
  }

  return `${flex.grow ? flex.grow : 0} ${flex.shrink ? flex.shrink : 0}`;
};

const flexStyle = css`
  flex: ${(props) =>
    `${flexGrowShrinkProp(props.flex)}${
      props.flex !== true && !props.basis ? ' auto' : ''
    }`};
`;

const JUSTIFY_MAP = {
  around: 'space-around',
  between: 'space-between',
  center: 'center',
  end: 'flex-end',
  evenly: 'space-evenly',
  start: 'flex-start',
};

const justifyStyle = css`
  justify-content: ${(props) => JUSTIFY_MAP[props.justify]};
`;

const WRAP_MAP = {
  true: 'wrap',
  reverse: 'wrap-reverse',
};

const wrapStyle = css`
  flex-wrap: ${(props) => WRAP_MAP[props.wrapProp]};
`;

const animationItemStyle = (item, theme) => {
  if (typeof item === 'string') {
    return animationObjectStyle({ type: item }, theme);
  }
  if (Array.isArray(item)) {
    return item.reduce(
      (style, a, index) =>
        css`
          ${style}${index > 0 ? ',' : ''} ${animationItemStyle(a, theme)}
        `,
      '',
    );
  }
  if (typeof item === 'object') {
    return animationObjectStyle(item, theme);
  }
  return '';
};

const animationAncilaries = (animation) => {
  if (animation.type === 'flipIn' || animation.type === 'flipOut') {
    return 'perspective: 1000px; transform-style: preserve-3d;';
  }
  return '';
};

const animationObjectInitialStyle = (animation) => {
  const bounds = animationBounds(animation.type, animation.size);
  if (bounds) {
    return `${bounds[0]} ${animationAncilaries(animation)}`;
  }
  return '';
};

const animationInitialStyle = (item) => {
  if (typeof item === 'string') {
    return animationObjectInitialStyle({ type: item });
  }
  if (Array.isArray(item)) {
    return item
      .map((a) =>
        typeof a === 'string'
          ? animationObjectInitialStyle({ type: a })
          : animationObjectInitialStyle(a),
      )
      .join('');
  }
  if (typeof item === 'object') {
    return animationObjectInitialStyle(item);
  }
  return '';
};

const animationStyle = css`
  ${(props) => css`
    ${animationInitialStyle(props.animation)}
    animation: ${animationItemStyle(props.animation, props.theme)};
  `};
`;

const interactiveStyle = css`
  cursor: pointer;

  &:hover {
    ${(props) =>
      props.kindProp?.hover &&
      getHoverIndicatorStyle(props.kindProp.hover, props.theme)}
    ${(props) =>
      props.hoverIndicator &&
      getHoverIndicatorStyle(props.hoverIndicator, props.theme)}
  }
`;

const gapStyle = (directionProp, gap, responsive, wrap, theme) => {
  const metric = theme.global.edgeSize[gap] || gap;
  const breakpoint = getBreakpointStyle(theme, theme.box.responsiveBreakpoint);
  const responsiveMetric = responsive && breakpoint && breakpoint.edgeSize[gap];

  const styles = [];
  if (typeof gap === 'object') {
    if (gap.row !== undefined && gap.column !== undefined) {
      styles.push(
        `gap: ${theme.global.edgeSize[gap.row] || gap.row} ${
          theme.global.edgeSize[gap.column] || gap.column
        };`,
      );
      if (responsiveMetric) {
        styles.push(
          breakpointStyle(breakpoint, `gap: ${responsiveMetric};`),
          responsive,
        );
      }
    } else if (gap.row !== undefined) {
      styles.push(`row-gap: ${theme.global.edgeSize[gap.row] || gap.row};`);
      if (responsiveMetric) {
        styles.push(
          breakpointStyle(
            breakpoint,
            `row-gap: ${responsiveMetric};`,
            responsive,
          ),
        );
      }
    } else if (gap.column !== undefined) {
      styles.push(
        `column-gap: ${theme.global.edgeSize[gap.column] || gap.column};`,
      );
      if (responsiveMetric) {
        styles.push(
          breakpointStyle(
            breakpoint,
            `column-gap: ${responsiveMetric};`,
            responsive,
          ),
        );
      }
    }
  } else if (directionProp === 'column' || directionProp === 'column-reverse') {
    styles.push(`row-gap: ${metric};`);
    if (responsiveMetric) {
      styles.push(
        breakpointStyle(breakpoint, `row-gap: ${responsiveMetric};`),
        responsive,
      );
    }
  } else {
    styles.push(`column-gap: ${metric};`);
    if (wrap) styles.push(`row-gap: ${metric};`);
    if (responsiveMetric) {
      if (directionProp === 'row' || directionProp === 'row-reverse') {
        styles.push(
          breakpointStyle(
            breakpoint,
            `column-gap: ${responsiveMetric};`,
            responsive,
          ),
        );
      } else if (directionProp === 'row-responsive') {
        styles.push(
          breakpointStyle(
            breakpoint,
            `
          row-gap: ${responsiveMetric};
        `,
            responsive,
          ),
        );
      }
    }
  }

  return styles;
};

// NOTE: basis must be after flex! Otherwise, flex overrides basis
const StyledBox = styled.div.withConfig(styledComponentsConfig)`
  display: flex;
  box-sizing: border-box;
  ${(props) => !props.basis && 'max-width: 100%;'};
  ${genericStyles}
  ${(props) => props.align && alignStyle}
  ${(props) => props.alignContent && alignContentStyle}
  ${(props) =>
    props.background && backgroundStyle(props.background, props.theme)}
  ${(props) =>
    props.border && borderStyle(props.border, props.responsive, props.theme)}
  ${(props) =>
    props.directionProp &&
    directionStyle(props.directionProp, props.responsive, props.theme)}
  ${(props) => props.heightProp && heightStyle(props.heightProp, props.theme)}
  ${(props) => props.widthProp && widthStyle(props.widthProp, props.theme)}
  ${(props) => props.flex !== undefined && flexStyle}
  ${(props) => props.basis && basisStyle}
  ${(props) => props.fillProp && fillStyle(props.fillProp)}
  ${(props) => props.justify && justifyStyle}
  ${(props) =>
    props.pad &&
    edgeStyle(
      'padding',
      props.pad,
      props.responsive,
      props.theme.box.responsiveBreakpoint,
      props.theme,
    )}
  ${(props) =>
    props.round && roundStyle(props.round, props.responsive, props.theme)}
  ${(props) => props.wrapProp && wrapStyle}
  ${(props) => props.overflowProp && overflowStyle(props.overflowProp)}
  ${(props) => props.elevationProp && elevationStyle(props.elevationProp)}
  ${(props) =>
    props.gap &&
    gapStyle(
      props.directionProp,
      props.gap,
      props.responsive,
      props.wrapProp,
      props.theme,
    )}
  ${(props) => props.animation && animationStyle}
  ${(props) => props.onClick && interactiveStyle}
  ${(props) =>
    props.onClick &&
    props.focus &&
    props.focusIndicator !== false &&
    focusStyle()}
  ${(props) => props.theme.box && props.theme.box.extend}
  ${(props) => props.kindProp && props.kindProp.extend}
`;

const gapGapStyle = (directionProp, gap, responsive, border, theme) => {
  const metric = theme.global.edgeSize[gap] || gap;
  const breakpoint = getBreakpointStyle(theme, theme.box.responsiveBreakpoint);
  const responsiveMetric = responsive && breakpoint && breakpoint.edgeSize[gap];

  const styles = [];
  if (directionProp === 'column' || directionProp === 'column-reverse') {
    styles.push(`height: ${metric};`);
    if (responsiveMetric) {
      styles.push(
        breakpointStyle(breakpoint, `height: ${responsiveMetric};`, responsive),
      );
    }
  } else {
    styles.push(`width: ${metric};`);
    if (responsiveMetric) {
      if (directionProp === 'row' || directionProp === 'row-reverse') {
        styles.push(
          breakpointStyle(
            breakpoint,
            `width: ${responsiveMetric};`,
            responsive,
          ),
        );
      } else if (directionProp === 'row-responsive') {
        styles.push(
          breakpointStyle(
            breakpoint,
            `
          width: auto;
          height: ${responsiveMetric};
        `,
            responsive,
          ),
        );
      }
    }
  }

  if (border === 'between' || (border && border.side === 'between')) {
    const borderSize = border.size || 'xsmall';
    const borderMetric = theme.global.borderSize[borderSize] || borderSize;
    const borderOffset = `${
      parseMetricToNum(metric) / 2 - parseMetricToNum(borderMetric) / 2
    }px`;
    const responsiveBorderMetric =
      responsive &&
      breakpoint &&
      (breakpoint.borderSize[borderSize] || borderSize);
    const responsiveBorderOffset =
      responsiveBorderMetric &&
      `${
        parseMetricToNum(responsiveMetric || metric) / 2 -
        parseMetricToNum(responsiveBorderMetric) / 2
      }px`;

    if (directionProp === 'column' || directionProp === 'column-reverse') {
      const adjustedBorder =
        typeof border === 'string' ? 'top' : { ...border, side: 'top' };
      styles.push(css`
        position: relative;
        &:after {
          content: '';
          position: absolute;
          width: 100%;
          top: ${borderOffset};
          ${borderStyle(adjustedBorder, responsive, theme)}
        }
      `);
      if (responsiveBorderOffset) {
        styles.push(
          breakpointStyle(
            breakpoint,
            `
            &:after {
              content: '';
              top: ${responsiveBorderOffset};
            }`,
            responsive,
          ),
        );
      }
    } else {
      const adjustedBorder =
        typeof border === 'string' ? 'left' : { ...border, side: 'left' };
      styles.push(css`
        position: relative;
        &:after {
          content: '';
          position: absolute;
          height: 100%;
          left: ${borderOffset};
          ${borderStyle(
            adjustedBorder,
            directionProp !== 'row-responsive' && responsive,
            theme,
          )}
        }
      `);
      if (responsiveBorderOffset) {
        if (directionProp === 'row' || directionProp === 'row-reverse') {
          styles.push(
            breakpointStyle(
              breakpoint,
              `
              &:after {
                content: '';
                left: ${responsiveBorderOffset};
              }`,
              responsive,
            ),
          );
        } else if (directionProp === 'row-responsive') {
          const adjustedBorder2 =
            typeof border === 'string' ? 'top' : { ...border, side: 'top' };
          styles.push(
            breakpointStyle(
              breakpoint,
              `
              &:after {
                content: '';
                height: auto;
                left: unset;
                width: 100%;
                top: ${responsiveBorderOffset};
                border-left: none;
                ${responsiveBorderStyle(adjustedBorder2, theme)}
              }`,
              responsive,
            ),
          );
        }
      }
    }
  }

  return styles;
};
const StyledBoxGap = styled.div.withConfig(styledComponentsConfig)`
  flex: 0 0 auto;
  align-self: stretch;
  ${(props) =>
    props.gap &&
    gapGapStyle(
      props.directionProp,
      props.gap,
      props.responsive,
      props.border,
      props.theme,
    )};
`;

export { StyledBox, StyledBoxGap };
