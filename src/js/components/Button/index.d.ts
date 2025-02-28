import { string } from 'prop-types';
import * as React from 'react';
import {
  A11yTitleType,
  AlignSelfType,
  BackgroundType,
  ColorType,
  FillType,
  GapType,
  GridAreaType,
  HoverIndicatorType,
  MarginType,
  Omit,
  PadType,
  PolymorphicType,
} from '../../utils';

import { TipProps } from '../Tip';

export interface ButtonProps {
  a11yTitle?: A11yTitleType;
  alignSelf?: AlignSelfType;
  badge?:
    | boolean
    | number
    | {
        background?: BackgroundType;
        max?: number;
        value?: boolean | number;
      }
    | JSX.Element;
  children?:
    | React.ReactNode
    | (({
        disabled,
        hover,
        focus,
      }: {
        disabled: boolean;
        hover: boolean;
        focus: boolean;
      }) => React.ReactNode);
  busy?: boolean;
  gridArea?: GridAreaType;
  margin?: MarginType;
  active?: boolean;
  color?: ColorType;
  disabled?: boolean;
  fill?: FillType;
  focusIndicator?: boolean;
  gap?: GapType;
  hoverIndicator?: HoverIndicatorType;
  href?: string;
  justify?:
    | 'around'
    | 'between'
    | 'center'
    | 'end'
    | 'evenly'
    | 'start'
    | 'stretch';
  target?: '_self' | '_blank' | '_parent' | '_top' | string;
  icon?: JSX.Element;
  kind?: string;
  label?: React.ReactNode;
  messages?: {
    busy?: string;
    success?: string;
  };
  pad?: PadType;
  plain?: boolean;
  primary?: boolean;
  reverse?: boolean;
  secondary?: boolean;
  size?: 'small' | 'medium' | 'large' | string;
  success?: boolean;
  tip?: TipProps | string;
  type?: 'button' | 'reset' | 'submit';
  as?: PolymorphicType;
}

type anchorType = Omit<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >,
  'color'
>;
type buttonType = Omit<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  'color'
>;
type extendType = anchorType & buttonType;

export interface ButtonExtendedProps
  extends ButtonProps,
    Omit<extendType, 'target' | 'children'> {}

// Keep type alias for backwards compatibility.
export type ButtonType = ButtonProps & extendType;

declare const Button: React.FC<ButtonExtendedProps>;

export { Button };
