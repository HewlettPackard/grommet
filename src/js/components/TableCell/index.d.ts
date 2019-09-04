import * as React from "react";
import { BoxTypes } from '../Box';

export interface TableCellProps {
  plain?: boolean;
  scope?: "col" | "row";
  size?: "xxsmall" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "1/2" | "1/3" | "2/3" | "1/4" | "2/4" | "3/4" | string;
  verticalAlign?: "top" | "middle" | "bottom";
}

export type TableCellTypes = TableCellProps & BoxTypes & JSX.IntrinsicElements['td'];

export { TableCell };
