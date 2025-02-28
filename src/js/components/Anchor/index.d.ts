import * as React from 'react';
import {
  A11yTitleType,
  AlignSelfType,
  ColorType,
  GapType,
  GridAreaType,
  MarginType,
  Omit,
  PolymorphicType,
} from '../../utils';

export interface AnchorProps {
  a11yTitle?: A11yTitleType;
  alignSelf?: AlignSelfType;
  as?: PolymorphicType;
  color?: ColorType;
  disabled?: boolean;
  gap?: GapType;
  gridArea?: GridAreaType;
  href?: string;
  icon?: JSX.Element;
  label?: React.ReactNode;
  margin?: MarginType;
  reverse?: boolean;
  size?:
    | 'xsmall'
    | 'small'
    | 'medium'
    | 'large'
    | 'xlarge'
    | 'xxlarge'
    | string;
  weight?: 'normal' | 'bold' | string | number;
}

type aProps = Omit<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >,
  'color'
>;

export interface AnchorExtendedProps extends AnchorProps, aProps {}

export type AnchorType = AnchorExtendedProps;

declare const Anchor: React.FC<AnchorExtendedProps>;

export { Anchor };
