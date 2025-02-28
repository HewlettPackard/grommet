import * as React from 'react';
import {
  A11yTitleType,
  AlignSelfType,
  BackgroundType,
  ColorType,
  GridAreaType,
  MarginType,
  PadType,
} from '../../utils';
import { BoxTypes } from '../Box';
import { PaginationType } from '../Pagination';

type SizeType =
  | 'xxsmall'
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | string;
type SideType =
  | 'top'
  | 'left'
  | 'bottom'
  | 'right'
  | 'horizontal'
  | 'vertical'
  | 'all';
type BorderType =
  | boolean
  | SideType
  | {
      color?: string | { dark?: string; light?: string };
      side?: SideType;
      size?: SizeType;
    };

export interface ListProps<ListItemType> {
  a11yTitle?: A11yTitleType;
  alignSelf?: AlignSelfType;
  as?: string;
  background?:
    | string
    | string[]
    | { light: string | string[]; dark: string | string[] };
  border?: BorderType;
  children?: (
    item: ListItemType,
    index: number,
    state?: { active: boolean },
  ) => any;
  data?: ListItemType[];
  disabled?: string[];
  showIndex?: boolean;
  gridArea?: GridAreaType;
  defaultItemProps?: BoxTypes;
  itemKey?: string | ((item: ListItemType) => string | number);
  itemProps?: {
    [_: string]: { background?: string; border?: BorderType; pad?: PadType };
  };
  margin?: MarginType;
  onActive?: (index: number) => void;
  onClickItem?: (
    event: React.MouseEvent & { item: ListItemType; index: number },
  ) => void;
  onMore?: () => void;
  onOrder?: (orderedData: ListItemType[]) => void;
  pad?: PadType;
  paginate?: boolean | PaginationType;
  pinned?:
    | boolean
    | (string | number)[]
    | {
        items?: (string | number)[];
        background?: BackgroundType;
        color?: ColorType;
        icon?: JSX.Element;
      };
  primaryKey?: string | ((item: ListItemType) => React.ReactElement<any>);
  secondaryKey?: string | ((item: ListItemType) => React.ReactElement<any>);
  show?: number | { page?: number };
  step?: number;
  action?: (item: ListItemType, index: number) => void;
}

type ulProps = Omit<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  >,
  'children'
>;

export interface ListExtendedProps<ListItemType>
  extends ListProps<ListItemType>,
    ulProps {}

declare const List: <ListItemType = string | {}>(
  p: ListExtendedProps<ListItemType>,
) => React.ReactElement<ListExtendedProps<ListItemType>>;

export { List };
