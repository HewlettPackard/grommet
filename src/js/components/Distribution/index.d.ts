import * as React from 'react';
import {
  A11yTitleType,
  AlignSelfType,
  BasisType,
  GapType,
  GridAreaType,
  MarginType,
} from '../../utils';

export interface DistributionProps {
  a11yTitle?: A11yTitleType;
  alignSelf?: AlignSelfType;
  basis?: BasisType;
  gridArea?: GridAreaType;
  margin?: MarginType;
  children?: (...args: any[]) => any;
  fill?: boolean;
  gap?: GapType;
  values: {
    value: number;
    color?: string | { dark?: string; light?: string };
  }[];
}

type divProps = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'children'
>;

export interface DistributionExtendedProps
  extends DistributionProps,
    divProps {}

declare const Distribution: React.ComponentClass<DistributionExtendedProps>;

export { Distribution };
