import * as React from 'react';
import {
  AnimateType,
  BackgroundType,
  MarginType,
  KeyboardType,
} from '../../utils';

export type LayerPositionType =
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'
  | 'center'
  | 'hidden'
  | 'left'
  | 'right'
  | 'start'
  | 'end'
  | 'top'
  | 'top-left'
  | 'top-right';
export interface LayerProps {
  animate?: AnimateType;
  animation?: 'none' | 'slide' | 'fadeIn' | boolean;
  background?: BackgroundType;
  full?: boolean | 'vertical' | 'horizontal';
  margin?: MarginType;
  modal?: boolean;
  onClickOutside?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
  onEsc?: KeyboardType;
  plain?: boolean;
  position?: LayerPositionType;
  responsive?: boolean;
  target?: object;
}

type divProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export interface LayerExtendedProps extends LayerProps, divProps {}

declare const Layer: React.FC<LayerExtendedProps>;

export { Layer };
