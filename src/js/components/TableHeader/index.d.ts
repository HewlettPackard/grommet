import * as React from 'react';

export interface TableHeaderProps {}

type htmlTableHeaderProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableSectionElement>,
  HTMLTableSectionElement
>;

export interface TableHeaderExtendedProps
  extends TableHeaderProps,
    htmlTableHeaderProps {}

declare const TableHeader: React.FC<TableHeaderExtendedProps>;

export { TableHeader };
