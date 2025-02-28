import * as React from 'react';
import {
  A11yTitleType,
  AlignType,
  AlignContentType,
  AlignSelfType,
  BorderType,
  FillType,
  GapType,
  GridAreaType,
  HeightType,
  JustifyContentType,
  MarginType,
  PadType,
  PolymorphicType,
  WidthType,
} from '../../utils';

export type GridSizeType =
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | 'full'
  | '1/2'
  | '1/3'
  | '2/3'
  | '1/4'
  | '2/4'
  | '3/4'
  | 'flex'
  | 'auto'
  | string
  | string[];

export type GridColumnsType =
  | GridSizeType
  | GridSizeType[]
  | {
      count?: 'fit' | 'fill' | number;
      size?: GridSizeType;
    };

export type GridGapType = GapType | { row?: GapType; column?: GapType };

export type AreasType =
  | { name?: string; start?: number[]; end?: number[] }[]
  | string[][];
export interface GridProps {
  a11yTitle?: A11yTitleType;
  alignSelf?: AlignSelfType;
  align?: AlignType;
  alignContent?: AlignContentType;
  areas?: AreasType;
  as?: PolymorphicType;
  border?: BorderType;
  columns?: GridColumnsType;
  fill?: FillType;
  gap?: GridGapType;
  gridArea?: GridAreaType;
  height?: HeightType;
  justify?: 'start' | 'center' | 'end' | 'stretch';
  justifyContent?: JustifyContentType;
  margin?: MarginType;
  pad?: PadType;
  responsive?: boolean;
  rows?: GridSizeType | GridSizeType[];
  tag?: PolymorphicType;
  width?: WidthType;
}

type divProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export interface GridExtendedProps extends GridProps, divProps {}

declare const Grid: React.FC<GridExtendedProps>;

export { Grid };
