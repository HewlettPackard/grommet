import * as React from 'react';

export interface TableBodyProps {}

type htmlTableBodyProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableSectionElement>,
  HTMLTableSectionElement
>;

export interface TableBodyExtendedProps
  extends TableBodyProps,
    htmlTableBodyProps {}

declare const TableBody: React.FC<TableBodyExtendedProps>;

export { TableBody };
