import * as React from 'react';
import {
  A11yTitleType,
  AlignSelfType,
  GridAreaType,
  MarginType,
} from '../../utils';
import { BoxProps } from '../Box/index';

export interface PaginationProps extends BoxProps {
  a11yTitle?: A11yTitleType;
  alignSelf?: AlignSelfType;
  gridArea?: GridAreaType;
  margin?: MarginType;
  numberEdgePages?: number;
  numberItems?: number;
  numberMiddlePages?: number;
  onChange?: (...args: any[]) => void;
  page?: number;
  size?: 'small' | 'medium' | 'large';
  step?: number;
  stepOptions?: boolean | (string | boolean | number | JSX.Element | object)[];
  summary?: boolean;
}

declare const Pagination: React.FC<PaginationProps>;
export type PaginationType = PaginationProps;

export { Pagination };
