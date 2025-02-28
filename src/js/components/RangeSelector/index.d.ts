import * as React from 'react';
import { Omit, ColorType } from '../../utils';

export interface RangeSelectorProps {
  color?: ColorType;
  defaultValues?: number[];
  direction?: 'horizontal' | 'vertical';
  invert?: boolean;
  label?: boolean | ((value: number) => React.ReactNode);
  max?: number;
  messages?: { lower?: string; upper?: string };
  min?: number;
  onChange?: (range: [number, number]) => void;
  opacity?: 'weak' | 'medium' | 'strong' | string | boolean;
  round?: 'xsmall' | 'small' | 'medium' | 'large' | 'full' | string;
  size?:
    | 'xxsmall'
    | 'xsmall'
    | 'small'
    | 'medium'
    | 'large'
    | 'xlarge'
    | 'full'
    | string;
  step?: number;
  values?: number[];
}

export interface RangeSelectorExtendedProps
  extends RangeSelectorProps,
    Omit<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >,
      'color' | 'onChange'
    > {}

declare const RangeSelector: React.FC<
  RangeSelectorProps &
    Omit<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >,
      'color'
    >
>;

export { RangeSelector };
