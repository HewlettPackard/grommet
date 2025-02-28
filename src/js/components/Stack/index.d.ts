import * as React from 'react';
import {
  A11yTitleType,
  AlignSelfType,
  FillType,
  GridAreaType,
  MarginType,
} from '../../utils';

export interface StackProps {
  a11yTitle?: A11yTitleType;
  alignSelf?: AlignSelfType;
  anchor?:
    | 'center'
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | 'top-left'
    | 'bottom-left'
    | 'top-right'
    | 'bottom-right';
  fill?: FillType;
  gridArea?: GridAreaType;
  guidingChild?: number | 'first' | 'last';
  interactiveChild?: number | 'first' | 'last';
  margin?: MarginType;
}

type divProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export interface StackExtendedProps extends StackProps, divProps {}

declare const Stack: React.FC<StackExtendedProps>;

export { Stack };
