import * as React from 'react';
import {
  A11yTitleType,
  AlignSelfType,
  ColorType,
  GridAreaType,
  MarginType,
  Omit,
  PolymorphicType,
  TextAlignType,
} from '../../utils';

export interface HeadingProps {
  a11yTitle?: A11yTitleType;
  alignSelf?: AlignSelfType;
  as?: PolymorphicType;
  color?: ColorType;
  gridArea?: GridAreaType;
  fill?: boolean;
  level?: '1' | '2' | '3' | '4' | '5' | '6' | 1 | 2 | 3 | 4 | 5 | 6;
  margin?: MarginType;
  overflowWrap?: 'normal' | 'break-word' | 'anywhere' | string;
  responsive?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | string;
  textAlign?: TextAlignType;
  truncate?: boolean;
  weight?: 'normal' | 'bold' | 'lighter' | 'bolder' | number | string;
}

type hProps =
  | Omit<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >,
      'color'
    >
  | Omit<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >,
      'color'
    >
  | Omit<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >,
      'color'
    >
  | Omit<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >,
      'color'
    >
  | Omit<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >,
      'color'
    >
  | Omit<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >,
      'color'
    >;

export interface HeadingExtendedProps extends HeadingProps, hProps {}

declare const Heading: React.FC<HeadingExtendedProps>;

export { Heading };
