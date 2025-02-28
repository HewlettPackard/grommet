import * as React from 'react';

export interface TableRowProps {}

type htmlTableRowProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
>;

export interface TableRowExtendedProps
  extends TableRowProps,
    htmlTableRowProps {}

declare const TableRow: React.FC<TableRowExtendedProps>;

export { TableRow };
