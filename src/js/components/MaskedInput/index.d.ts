import * as React from 'react';
import { A11yTitleType, Omit, TextAlignType } from '../../utils';
import { DropType } from '../Drop';

export interface MaskedInputProps {
  a11yTitle?: A11yTitleType;
  dropHeight?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | string;
  dropProps?: DropType;
  focusIndicator?: boolean;
  icon?: JSX.Element;
  id?: string;
  mask?: Array<{
    length?: number | number[];
    fixed?: string;
    options?: string[] | number[];
    restrictToOptions?: boolean;
    regexp?: {};
    placeholder?: string;
  }>;
  name?: string;
  onBlur?: (event: React.FocusEvent) => any;
  plain?: boolean;
  reverse?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | string;
  textAlign?: TextAlignType;
  value?: string | number;
}

export interface MaskedInputExtendedProps
  extends MaskedInputProps,
    Omit<
      React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >,
      keyof MaskedInputProps
    > {}

// Keep type alias for backwards compatibility.
export type MaskedInputType = MaskedInputExtendedProps;

declare const MaskedInput: React.FC<MaskedInputExtendedProps>;

export { MaskedInput };
