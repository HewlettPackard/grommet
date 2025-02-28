import * as React from 'react';
import { BoxProps } from '../Box/index';

export interface DataFiltersProps {
  clearFilters?: boolean;
  drop?: boolean;
  heading?: string | React.ReactNode;
  layer?: boolean;
  // when view changes should be delivered
  updateOn?: 'change' | 'submit';
}

type divProps = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'onClick'
>;

export interface DataFiltersExtendedProps
  extends BoxProps,
    DataFiltersProps,
    divProps {}

declare const DataFilters: React.FC<DataFiltersExtendedProps>;

export { DataFilters };
