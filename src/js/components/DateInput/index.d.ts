import * as React from 'react';

import { ButtonType } from '../Button';
import { CalendarType } from '../Calendar/index';
import { DropType } from '../Drop';
import { MaskedInputType } from '../MaskedInput';

export interface DateInputProps {
  buttonProps?: ButtonType;
  calendarProps?: CalendarType;
  defaultValue?: string | string[];
  dropProps?: DropType;
  format?: string;
  icon?: JSX.Element;
  id?: string;
  inline?: boolean;
  reverse?: boolean;
  inputProps?: MaskedInputType;
  messages?: {
    enterCalendar?: string;
    exitCalendar?: string;
  };
  name?: string;
  onChange?: (event: { value: string | string[] }) => void;
  readOnlyCopy?: boolean;
  size?:
    | 'xsmall'
    | 'small'
    | 'medium'
    | 'large'
    | 'xlarge'
    | 'xxlarge'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | string;
  value?: string | string[];
}
export interface DateInputExtendedProps
  extends DateInputProps,
    Omit<
      React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >,
      'defaultValue' | 'onChange' | 'value' | 'size'
    > {}

declare const DateInput: React.FC<DateInputExtendedProps>;

export { DateInput };
