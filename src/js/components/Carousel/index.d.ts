import * as React from 'react';
import {
  A11yTitleType,
  AlignSelfType,
  GridAreaType,
  HeightType,
  MarginType,
  WidthType,
} from '../../utils';

export interface CarouselProps {
  a11yTitle?: A11yTitleType;
  activeChild?: number;
  alignSelf?: AlignSelfType;
  wrap?: boolean;
  controls?: boolean | 'arrows' | 'selectors';
  gridArea?: GridAreaType;
  margin?: MarginType;
  fill?: boolean;
  play?: number;
  initialChild?: number;
  height?: HeightType;
  width?: WidthType;
  onChild?: (...args: any[]) => void;
}

type divType = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export interface CarouselExtendedProps extends CarouselProps, divType {}

declare const Carousel: React.FC<CarouselExtendedProps>;

export { Carousel };
