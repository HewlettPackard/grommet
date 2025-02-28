import * as React from 'react';
import {
  A11yTitleType,
  AlignSelfType,
  AnimateType,
  GridAreaType,
  MarginType,
} from '../../utils';

export interface RenderProps {
  date: Date;
  day: number;
  isInRange: boolean;
  isSelected: boolean;
}

export interface CalendarHeaderProps {
  date: Date;
  locale?: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  previousInBound: boolean;
  nextInBound: boolean;
}

export interface CalendarProps {
  a11yTitle?: A11yTitleType;
  alignSelf?: AlignSelfType;
  gridArea?: GridAreaType;
  margin?: MarginType;
  activeDate?: 'start' | 'end';
  animate?: AnimateType;
  bounds?: string[];
  children?: (args: RenderProps) => React.ReactNode;
  date?: string | (string | string[])[];
  dates?: (string | string[])[];
  daysOfWeek?: boolean;
  disabled?: (string | string[])[];
  fill?: boolean;
  firstDayOfWeek?: 0 | 1;
  header?: (args: CalendarHeaderProps) => React.ReactNode;
  level?: '1' | '2' | '3' | '4' | '5' | '6' | 1 | 2 | 3 | 4 | 5 | 6;
  locale?: string;
  messages?: {
    previous?: string;
    next?: string;
  };
  onReference?: (reference: string) => void;
  onSelect?: (select: string | string[]) => any;
  range?: boolean | 'array';
  reference?: string;
  showAdjacentDays?: boolean | 'trim';
  size?: 'small' | 'medium' | 'large' | string;
}

export interface CalendarExtendedProps
  extends CalendarProps,
    Omit<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >,
      keyof CalendarProps
    > {}

// Keep type alias for backwards compatibility.
export type CalendarType = CalendarProps &
  Omit<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    'onSelect'
  >;

declare const Calendar: React.ComponentClass<CalendarExtendedProps>;

export { Calendar };
