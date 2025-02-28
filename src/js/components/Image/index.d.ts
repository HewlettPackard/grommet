import * as React from 'react';
import {
  A11yTitleType,
  AlignSelfType,
  FillType,
  GridAreaType,
  MarginType,
} from '../../utils';

export interface ImageProps {
  a11yTitle?: A11yTitleType;
  alignSelf?: AlignSelfType;
  fallback?: string;
  fill?: FillType;
  fit?: 'cover' | 'contain';
  gridArea?: GridAreaType;
  margin?: MarginType;
  opacity?: 'weak' | 'medium' | 'strong' | string | boolean;
}

type imgProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

export interface ImageExtendedProps extends ImageProps, imgProps {}

declare const Image: React.FC<ImageExtendedProps>;

export { Image };
