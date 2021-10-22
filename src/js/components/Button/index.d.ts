import * as React from 'react';
import {
  A11yTitleType,
  AlignSelfType,
  BackgroundType,
  ColorType,
  ElevationType,
  FillType,
  GapType,
  GridAreaType,
  MarginType,
  Omit,
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
  gridArea?: GridAreaType;
  margin?: MarginType;
  active?: boolean;
  color?: ColorType;
  disabled?: boolean;
  fill?: FillType;
  focusIndicator?: boolean;
  gap?: GapType;
  hoverIndicator?:
    | {
        background?: BackgroundType;
        elevation?: ElevationType;
        text?: { color: ColorType };
      }
    | BackgroundType
    | boolean;
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
  plain?: boolean;
  primary?: boolean;
  reverse?: boolean;
  secondary?: boolean;
  size?: 'small' | 'medium' | 'large';
  tip?: TipProps | string;
  type?: 'button' | 'reset' | 'submit';
  as?: PolymorphicType;
}

type anchorType = Omit<JSX.IntrinsicElements['a'], 'color'>;
type buttonType = Omit<JSX.IntrinsicElements['button'], 'color'>;
type extendType = anchorType & buttonType;

export interface ButtonExtendedProps extends ButtonProps, extendType {}

// Keep type alias for backwards compatibility.
export type ButtonType = ButtonProps & extendType;

declare const Button: React.FC<
  ButtonExtendedProps & {
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
  }
>;

export { Button };
