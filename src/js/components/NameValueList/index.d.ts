import * as React from 'react';
import { AlignType, WidthType } from '../../utils';
import { GridProps } from '../Grid';

export interface NameValueListProps {
  align?: AlignType;
  children?: React.ReactNode;
  layout?: 'column' | 'grid';
  nameProps?: {
    align?: AlignType;
    width?: WidthType;
  };
  pairProps?: {
    direction?: 'column' | 'column-reverse' | 'row';
  };
  valueProps?: {
    align?: AlignType;
    width?: WidthType;
  };
}
export interface NameValueListExtendedProps
  extends NameValueListProps,
    GridProps,
    Omit<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDListElement>,
        HTMLDListElement
      >,
      keyof NameValueListProps
    > {}

declare const NameValueList: React.FC<NameValueListExtendedProps>;

export { NameValueList };
