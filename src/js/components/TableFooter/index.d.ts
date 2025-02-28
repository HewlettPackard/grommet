import * as React from 'react';

export interface TableFooterProps {}

type htmlTableFooterProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableSectionElement>,
  HTMLTableSectionElement
>;

export interface TableFooterExtendedProps
  extends TableFooterProps,
    htmlTableFooterProps {}

declare const TableFooter: React.FC<TableFooterExtendedProps>;

export { TableFooter };
