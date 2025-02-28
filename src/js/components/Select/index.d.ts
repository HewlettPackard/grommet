import * as React from 'react';
import { DropType } from '../Drop';
import {
  A11yTitleType,
  AlignSelfType,
  GridAreaType,
  MarginType,
  PlaceHolderType,
} from '../../utils';

export interface BasicSelectProps {
  a11yTitle?: A11yTitleType;
  alignSelf?: AlignSelfType;
  gridArea?: GridAreaType;
  children?: (...args: any[]) => any;
  disabled?: boolean | (number | string | object)[];
  disabledKey?: string | ((...args: any[]) => any);
  dropAlign?: {
    top?: 'top' | 'bottom';
    bottom?: 'top' | 'bottom';
    right?: 'left' | 'right';
    left?: 'left' | 'right';
  };
  dropHeight?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | string;
  dropTarget?: object;
  dropProps?: DropType;
  emptySearchMessage?: string | React.ReactNode;
  focusIndicator?: boolean;
  icon?: boolean | ((...args: any[]) => any) | React.ReactNode | React.FC;
  id?: string;
  labelKey?: string | ((...args: any[]) => string | React.ReactNode);
  margin?: MarginType;
  messages?: { multiple?: string };
  name?: string;
  onChange?: (...args: any[]) => void;
  onClose?: (...args: any[]) => any;
  onMore?: () => void;
  onOpen?: (...args: any[]) => any;
  onSearch?: (search: string) => void;
  options: (string | boolean | number | JSX.Element | object)[];
  open?: boolean;
  placeholder?: PlaceHolderType;
  plain?: boolean;
  replace?: boolean;
  searchPlaceholder?: PlaceHolderType;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | string;
  valueKey?:
    | string
    | { key: string; reduce?: boolean }
    | ((...args: any[]) => string);
  valueLabel?: React.ReactNode | ((...args: any[]) => string | React.ReactNode);
}
export interface SelectProps extends BasicSelectProps {
  clear?: boolean | { position?: 'top' | 'bottom'; label?: string };
  closeOnChange?: boolean;
  defaultValue?: string | number | object | (string | number | object)[];
  multiple?: boolean;
  selected?: number | number[];
  value?: string | JSX.Element | number | object | (string | number | object)[];
}

// Try without Omit<> to see where we define our own attributes for overrides
// value, name, id, onChange, placeholder
export interface SelectExtendedProps
  extends SelectProps,
    Omit<
      React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >,
      keyof SelectProps | 'readOnly'
    > {}

declare const Select: React.FC<SelectExtendedProps>;

export { Select };
