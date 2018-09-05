import * as React from "react";

export interface RangeSelectorProps {
  color?: string;
  direction?: "horizontal" | "vertical";
  invert?: boolean;
  max?: number;
  messages?: {lower: string,upper: string};
  min?: number;
  onChange?: (...args: any[]) => any;
  opacity?: "weak" | "medium" | "strong";
  round?: "xsmall" | "small" | "medium" | "large" | "full";
  size?: "xxsmall" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "full";
  step?: number;
  values: number[];
}

declare const RangeSelector: React.StatelessComponent<RangeSelectorProps>;

export { RangeSelector };
