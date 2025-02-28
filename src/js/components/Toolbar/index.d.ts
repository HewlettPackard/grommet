import * as React from 'react';
import { BoxProps } from '../Box/index';

export interface ToolbarProps {}

type divProps = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'onClick'
>;

export interface ToolbarExtendedProps
  extends BoxProps,
    ToolbarProps,
    divProps {}

declare const Toolbar: React.FC<ToolbarExtendedProps>;

export { Toolbar };
