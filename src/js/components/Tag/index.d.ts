import * as React from 'react';
import {
  A11yTitleType,
  AlignSelfType,
  BackgroundType,
  GridAreaType,
  MarginType,
  // Omit,
  PolymorphicType,
} from '../../utils';

export interface TagProps {
  a11yTitle?: A11yTitleType;
  alignSelf?: AlignSelfType;
  gridArea?: GridAreaType;
  margin?: MarginType;
  background?: BackgroundType;
  // focusIndicator?: boolean;
  // hoverIndicator?: BackgroundType | boolean;
  name?: string;
  value: string | number;
  onClick?: (...args: any[]) => any;
  onRemove?: (...args: any[]) => any;
  size?: 'small' | 'medium' | 'large';
  as?: PolymorphicType;
}

// type tagType = Omit<JSX.IntrinsicElements['button'], 'color'>;
// type extendType = tagType;

export interface TagExtendedProps extends TagProps/*, extendType */{}

// Keep type alias for backwards compatibility.
export type TagType = TagProps; // & extendType;

declare const Tag: React.FC<
  TagExtendedProps
>;

export { Tag };