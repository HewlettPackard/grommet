import * as React from 'react';
import { A11yTitleType } from '../../utils';

export interface RangeInputProps {
  a11yTitle?: A11yTitleType;
  id?: string;
  inputDirection?: 'right' | 'left' | 'above' | 'below' | string;
  inputValue?: boolean;
  min?: number | string;
  max?: number | string;
  name?: string;
  step?: number;
  value?: number | string;
}

declare const RangeInput: React.FC<RangeInputProps &
  JSX.IntrinsicElements['input']>;

export { RangeInput };
