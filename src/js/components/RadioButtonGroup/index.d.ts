import * as React from 'react';
import { BoxProps } from '../Box/index';

export interface RadioButtonGroupProps {
  children?: Function;
  disabled?: boolean;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options: (
    | string
    | number
    | boolean
    | {
        disabled?: boolean;
        id?: string;
        label?: string | React.ReactNode;
        value: string | number | boolean;
      }
  )[];
  trapFocus?: boolean;
  value?: string | number | boolean | object;
}

export interface RadioButtonGroupExtendedProps
  extends RadioButtonGroupProps,
    BoxProps,
    Omit<JSX.IntrinsicElements['div'], 'children' | 'onClick' | 'onChange'> {}

declare const RadioButtonGroup: React.FC<RadioButtonGroupExtendedProps>;

export { RadioButtonGroup };
