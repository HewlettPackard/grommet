import styled, { css } from 'styled-components';

import {
  breakpointStyle,
  genericStyles,
  normalizeColor,
  textAlignStyle,
  styledComponentsConfig,
} from '../../utils';

const sizeStyle = (props) => {
  // size is a combination of the level and size properties
  const size = props.size || 'medium';
  const headingTheme = props.theme.heading;
  const levelStyle = headingTheme.level[props.level];
  if (levelStyle) {
    const data = levelStyle[size];
    const styles = [
      css`
        font-size: ${data ? data.size : size};
        line-height: ${data ? data.height : 'normal'};
        max-width: ${(props.fillProp && 'none') ||
        (data && data.maxWidth) ||
        levelStyle.medium.maxWidth};
        font-weight: ${props.weight ||
        levelStyle.font.weight ||
        headingTheme.weight};
        overflow-wrap: ${props.overflowWrap};
      `,
    ];
    if (props.responsive && headingTheme.responsiveBreakpoint) {
      const breakpoint =
        props.theme.global.breakpoints[headingTheme.responsiveBreakpoint];
      if (breakpoint) {
        const responsiveData = headingTheme.level[props.level + 1]
          ? headingTheme.level[props.level + 1][size]
          : headingTheme.level[props.level][size];
        if (responsiveData) {
          styles.push(
            breakpointStyle(
              breakpoint,
              `
            font-size: ${responsiveData.size};
            line-height: ${responsiveData.height};
            max-width: ${(props.fillProp && 'none') || responsiveData.maxWidth};
          `,
              props.responsive,
            ),
          );
        }
      }
    }
    return styles;
  }
  console.warn(`Heading level ${props.level} is not defined in your theme.`);

  return '';
};

const fontFamily = (props) => {
  const { font } = props.theme.heading.level[props.level] || {};
  if (font && font.family) {
    return css`
      font-family: ${font.family};
    `;
  }
  return props.theme.heading.font
    ? css`
        font-family: ${props.theme.heading.font.family};
      `
    : '';
};

const truncateStyle = `
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const colorStyle = css`
  color: ${(props) =>
    normalizeColor(props.colorProp || props.theme.heading.color, props.theme)};
`;

const StyledHeading = styled.h1.withConfig(styledComponentsConfig)`
  ${genericStyles}
  ${(props) => fontFamily(props)}
  ${(props) => sizeStyle(props)}
  ${(props) => props.textAlign && textAlignStyle}
  ${(props) => props.truncate && truncateStyle}
  ${(props) => (props.colorProp || props.theme.heading.color) && colorStyle}
  ${(props) => props.theme.heading && props.theme.heading.extend}
`;

export { StyledHeading };
