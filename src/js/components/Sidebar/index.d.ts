import * as React from 'react';
import { BoxProps } from '../Box/index';

export interface SidebarProps {
  footer?: React.ReactNode;
  header?: React.ReactNode;
}

type divProps = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'onClick'
>;

export interface SidebarExtendedProps
  extends BoxProps,
    SidebarProps,
    divProps {}

declare const Sidebar: React.FC<SidebarExtendedProps>;

export { Sidebar };
