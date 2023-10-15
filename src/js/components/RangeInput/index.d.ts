import * as React from 'react';
import { A11yTitleType, ColorType } from '../../utils';

interface ColorInterface {
  color: ColorType;
  value: number;
  opacity?: number;
}

export interface RangeInputProps {
  a11yTitle?: A11yTitleType;
  id?: string;
  min?: number | string;
  max?: number | string;
  name?: string;
  step?: number;
  color?: ColorType | ColorInterface[];
  value?: number | string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface RangeInputExtendedProps
  extends RangeInputProps,
    Omit<
      JSX.IntrinsicElements['input'],
      'color' | 'step' | 'value' | 'onChange'
    > {}

declare const RangeInput: React.FC<RangeInputExtendedProps>;

export { RangeInput };
