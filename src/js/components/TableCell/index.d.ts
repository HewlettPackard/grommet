import * as React from 'react';
import { BoxTypes } from '../Box/index';

export interface TableCellProps {
  plain?: boolean | 'noPad'; // noPad is for internal use only
  scope?: 'col' | 'row';
  size?:
    | 'xxsmall'
    | 'xsmall'
    | 'small'
    | 'medium'
    | 'large'
    | 'xlarge'
    | '1/2'
    | '1/3'
    | '2/3'
    | '1/4'
    | '2/4'
    | '3/4'
    | 'auto'
    | string;
  verticalAlign?: 'top' | 'middle' | 'bottom';
}

// We combine BoxTypes & React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement> inline here since BoxTypes
// is a combination of BoxProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, and there is a
// large overlap between td and div attributes.
export interface TableCellExtendedProps
  extends TableCellProps,
    Omit<
      BoxTypes &
        React.DetailedHTMLProps<
          React.TdHTMLAttributes<HTMLTableCellElement>,
          HTMLTableCellElement
        >,
      'scope'
    > {}

declare const TableCell: React.FC<TableCellExtendedProps>;

export { TableCell };
