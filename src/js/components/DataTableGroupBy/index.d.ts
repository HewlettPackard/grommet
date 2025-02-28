import * as React from 'react';
import { BoxProps } from '../Box/index';

export interface DataTableGroupByProps {
  options: string[] | { label: string; property: string }[];
}

type selectProps = Omit<
  React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >,
  'onClick' | 'property'
>;

export interface DataTableGroupByExtendedProps
  extends BoxProps,
    DataTableGroupByProps,
    selectProps {}

declare const DataTableGroupBy: React.FC<DataTableGroupByExtendedProps>;

export { DataTableGroupBy };
