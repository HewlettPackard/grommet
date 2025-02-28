import * as React from 'react';
import {
  A11yTitleType,
  AlignSelfType,
  GridAreaType,
  MarginType,
  PadType,
} from '../../utils';
import { GridSizeType } from '../Grid';
import { PaginationType } from '../Pagination';

export interface CardsProps<CardType = any> {
  a11yTitle?: A11yTitleType;
  alignSelf?: AlignSelfType;
  as?: string;
  children?: (item: CardType, index: number) => JSX.Element;
  data?: CardType[];
  gridArea?: GridAreaType;
  margin?: MarginType;
  onMore?: () => void;
  pad?: PadType;
  paginate?: boolean | PaginationType;
  show?: number | { page?: number };
  size?: GridSizeType;
  step?: number;
}

type ulProps = Omit<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  >,
  'children'
>;

export interface CardsExtendedProps<CardType>
  extends CardsProps<CardType>,
    ulProps {}

declare class Cards<CardType = any> extends React.Component<
  CardsExtendedProps<CardType>
> {}

export { Cards };
