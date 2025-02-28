import * as React from 'react';
import {
  A11yTitleType,
  AlignSelfType,
  GridAreaType,
  MarginType,
} from '../../utils';

export interface ClockProps {
  a11yTitle?: A11yTitleType;
  alignSelf?: AlignSelfType;
  gridArea?: GridAreaType;
  margin?: MarginType;
  hourLimit?: 12 | 24 | '12' | '24';
  onChange?: (time: string) => void;
  precision?: 'hours' | 'minutes' | 'seconds';
  run?: boolean | 'backward' | 'forward';
  size?:
    | 'xsmall'
    | 'small'
    | 'medium'
    | 'large'
    | 'xlarge'
    | 'xxlarge'
    | 'huge'
    | string;
  time?: string;
  type?: 'analog' | 'digital';
}

/**
 * Ideally this would be an interface, however since the Clock component can be
 * either analog (svg) or digital (div), we cannot know at compile time whether
 * ClockExtendedProps should contain svg or div props.
 */
export type ClockExtendedProps = ClockProps &
  (
    | Omit<
        React.DetailedHTMLProps<
          React.SVGAttributes<SVGSVGElement>,
          SVGSVGElement
        >,
        'onChange' | 'type'
      >
    | Omit<
        React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLDivElement>,
          HTMLDivElement
        >,
        'onChange'
      >
  );

declare const Clock: React.FC<ClockExtendedProps>;

export { Clock };
