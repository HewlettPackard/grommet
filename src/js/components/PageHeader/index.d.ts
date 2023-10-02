import * as React from 'react';
import {
  A11yTitleType,
  AlignSelfType,
  GridAreaType,
  MarginType,
} from '../../utils';
import { BoxProps } from '../Box/index';

import { GridProps } from '../Grid';
export interface PageHeaderProps {
  a11yTitle?: A11yTitleType;
  alignSelf?: AlignSelfType;
  gridArea?: GridAreaType;
  margin?: MarginType;
  actions?: JSX.Element;
  gridProps?: GridProps;
  parent?: JSX.Element;
  responsive?: boolean;
  size?: 'small' | 'medium' | 'large';
  subtitle?: string | JSX.Element;
  title?: string | JSX.Element;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

type divProps = Omit<JSX.IntrinsicElements['div'], 'onClick' | 'title'>;

export interface PageHeaderExtendedProps
  extends BoxProps,
    PageHeaderProps,
    divProps {}

declare const PageHeader: React.FC<PageHeaderExtendedProps>;
export type PageHeaderType = PageHeaderProps;

export { PageHeader };
