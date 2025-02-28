import * as React from 'react';
import {
  A11yTitleType,
  AlignType,
  AlignContentType,
  AlignSelfType,
  BackgroundType,
  BasisType,
  BorderType,
  DirectionType,
  ElevationType,
  FillType,
  GapType,
  GridAreaType,
  HeightType,
  MarginType,
  PadType,
  PolymorphicType,
  RoundType,
  WidthType,
  AnimationType,
  SkeletonType,
} from '../../utils';

export interface BoxProps {
  a11yTitle?: A11yTitleType;
  alignSelf?: AlignSelfType;
  gridArea?: GridAreaType;
  margin?: MarginType;
  align?: AlignType;
  alignContent?: AlignContentType;
  animation?: AnimationType;
  background?: BackgroundType;
  basis?: BasisType;
  border?: BorderType;
  cssGap?: boolean;
  direction?: DirectionType;
  elevation?: ElevationType;
  flex?: 'grow' | 'shrink' | boolean | { grow?: number; shrink?: number };
  fill?: FillType;
  focusIndicator?: boolean;
  gap?: GapType | { row?: GapType; column?: GapType };
  height?: HeightType;
  hoverIndicator?:
    | { background?: BackgroundType; elevation?: ElevationType }
    | BackgroundType
    | boolean;
  justify?:
    | 'around'
    | 'between'
    | 'center'
    | 'end'
    | 'evenly'
    | 'start'
    | 'stretch';
  overflow?:
    | 'auto'
    | 'hidden'
    | 'scroll'
    | 'visible'
    | {
        horizontal?: 'auto' | 'hidden' | 'scroll' | 'visible';
        vertical?: 'auto' | 'hidden' | 'scroll' | 'visible';
      }
    | string;
  pad?: PadType;
  responsive?: boolean;
  round?: RoundType;
  skeleton?: SkeletonType;
  tag?: PolymorphicType;
  as?: PolymorphicType;
  width?: WidthType;
  wrap?: boolean | 'reverse';
}

export interface BoxExtendedProps
  extends BoxProps,
    Omit<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >,
      keyof BoxProps
    > {}

// Keep type alias for backwards compatibility.
export type BoxTypes = BoxProps &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

declare const Box: React.FC<BoxExtendedProps>;

export { Box };
