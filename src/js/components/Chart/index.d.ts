import * as React from 'react';
import {
  A11yTitleType,
  AlignSelfType,
  ColorType,
  EdgeSizeType,
  GapType,
  GridAreaType,
  MarginType,
  ThicknessType,
} from '../../utils';

export interface ChartProps {
  a11yTitle?: A11yTitleType;
  alignSelf?: AlignSelfType;
  animate?: boolean;
  gridArea?: GridAreaType;
  margin?: MarginType;
  // caller must align with direction
  bounds?:
    | { x: { min: number; max: number }; y: { min: number; max: number } }
    | number[][];
  color?:
    | ColorType
    | { color: ColorType; value: number | number[] }[]
    // deprecated
    | {
        color?: ColorType;
        opacity?: 'weak' | 'medium' | 'strong' | boolean | number;
      };
  dash?: boolean;
  direction?: 'horizontal' | 'vertical';
  gap?: GapType;
  onClick?: (event: React.MouseEvent) => void;
  onHover?: (over: boolean) => void;
  opacity?: 'weak' | 'medium' | 'strong' | boolean | number;
  overflow?: boolean;
  pad?: EdgeSizeType | { horizontal?: EdgeSizeType; vertical?: EdgeSizeType };
  pattern?:
    | 'squares'
    | 'circles'
    | 'stripesHorizontal'
    | 'stripesVertical'
    | 'stripesDiagonalDown'
    | 'stripesDiagonalUp';
  point?:
    | 'circle'
    | 'diamond'
    | 'square'
    | 'star'
    | 'triangle'
    | 'triangleDown';
  round?: boolean;
  size?:
    | 'xxsmall'
    | 'xsmall'
    | 'small'
    | 'medium'
    | 'large'
    | 'xlarge'
    | 'fill'
    | 'full'
    | {
        height?:
          | 'xxsmall'
          | 'xsmall'
          | 'small'
          | 'medium'
          | 'large'
          | 'xlarge'
          | 'fill'
          | 'full'
          | 'auto'
          | string;
        width?:
          | 'xxsmall'
          | 'xsmall'
          | 'small'
          | 'medium'
          | 'large'
          | 'xlarge'
          | 'fill'
          | 'full'
          | 'auto'
          | string;
      }
    | string;
  thickness?: ThicknessType;
  type?: 'bar' | 'line' | 'area' | 'point';
  values: (
    | number
    | number[]
    | {
        color?: ColorType;
        label?: string;
        onClick?: (event: React.MouseEvent) => void;
        onHover?: (over: boolean) => void;
        opacity?: 'weak' | 'medium' | 'strong' | boolean | number;
        thickness?: ThicknessType;
        value: number | number[];
      }
  )[];
}

export interface ChartExtendedProps
  extends ChartProps,
    Omit<
      React.DetailedHTMLProps<
        React.SVGAttributes<SVGSVGElement>,
        SVGSVGElement
      >,
      keyof ChartProps
    > {}

declare const Chart: React.FC<ChartExtendedProps>;

type Bounds =
  | { x: { min: number; max: number }; y: { min: number; max: number } }
  | [[number, number], [number, number]]
  | [[], []];

interface CalcsResult {
  axis: { x: number[]; y: number[] } | [number[], number[]];
  bounds: Bounds;
  dimensions: { width: number; height: number } | [number, number];
  pad: string;
  thickness: string;
}

interface CalcsOptions {
  min?: number;
  max?: number;
  bounds?: Bounds;
  thickness?: string;
}

declare const calcs: (
  values: number[] | number[][],
  options?: CalcsOptions,
) => CalcsResult;

export { Chart, calcs };
