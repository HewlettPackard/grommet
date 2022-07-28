import * as React from 'react';
// import { Omit } from "../../utils";
import { DropProps } from '../Drop';

export interface TipProps {
  children?: React.ReactNode;
  content?: React.ReactNode;
  dropProps?: DropProps;
  show?: boolean;
  onShow?: () => void;
  plain?: boolean;
}

declare const Tip: React.FC<TipProps>;

export { Tip };
