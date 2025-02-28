import * as React from 'react';
import { BoxProps } from '../Box/index';

export interface DataFilterProps {
  options?: (
    | string
    | number
    | {
        label: string;
        value: string | number | boolean;
      }
  )[];
  property: string;
  range?: {
    max?: number;
    min?: number;
    step?: number;
  };
}

type divProps = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'onClick' | 'property'
>;

export interface DataFilterExtendedProps
  extends BoxProps,
    DataFilterProps,
    divProps {}

declare const DataFilter: React.FC<DataFilterExtendedProps>;

export { DataFilter };
