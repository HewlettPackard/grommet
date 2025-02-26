// colors.js
declare const normalizeColor: (
  color: string | { dark?: string; light?: string },
  theme: object,
  dark?: boolean,
) => string;

export { normalizeColor };

// object.js
export type DeepReadonly<T extends object> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
export type NonUndefined<T> = T extends undefined ? never : T;
export type NonUndefinedProps<T extends object> = {
  [K in keyof T]?: NonUndefined<T[K]>;
};

export type DeepFreeze = <T extends object>(obj: T) => DeepReadonly<T>;

// overload because generic variadic solution has messy result and all/most mergings are binary
export interface DeepMerge {
  <T extends object, S extends object>(target: T, source: S): T & S;
  <T extends object, S extends object[]>(target: T, ...sources: S): T &
    S[number];
}

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export type PolymorphicType =
  | keyof JSX.IntrinsicElements
  | React.ComponentType<any>;

declare const isObject: (item: any) => boolean;
declare const deepFreeze: DeepFreeze;
declare const deepMerge: DeepMerge;
declare const removeUndefined: <T extends object>(
  obj: T,
) => NonUndefinedProps<T>;

export { isObject, deepFreeze, deepMerge, removeUndefined };

/*
 * Utility type for inferring the props type of a component.
 *
 * Example:
 *
 * ```typescript
 * import { SomeComponent } from 'grommet';
 *
 * type SomeComponentProps = PropsOf<typeof SomeComponent>;
 * ```
 */
export type PropsOf<TComponent> = TComponent extends React.ComponentType<
  infer P
>
  ? P
  : never;

// the basic T-Shirt sizes xsmall through xlarge. Some places add on.
export type TShirtSizeType =
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | string;

// Extracting types for common properties among components
export type BoxSideType =
  | 'top'
  | 'left'
  | 'bottom'
  | 'right'
  | 'start'
  | 'end'
  | 'horizontal'
  | 'vertical'
  | 'all'
  | 'between';
export type BoxSizeType =
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | string;
export type BoxStyleType =
  | 'solid'
  | 'dashed'
  | 'dotted'
  | 'double'
  | 'groove'
  | 'ridge'
  | 'inset'
  | 'outset'
  | 'hidden';
export type EdgeSizeType =
  | 'xxsmall'
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge';
export type EdgeType =
  | 'none'
  | EdgeSizeType
  | {
      bottom?: EdgeSizeType | string;
      end?: EdgeSizeType | string;
      horizontal?: EdgeSizeType | string;
      left?: EdgeSizeType | string;
      right?: EdgeSizeType | string;
      start?: EdgeSizeType | string;
      top?: EdgeSizeType | string;
      vertical?: EdgeSizeType | string;
    }
  | string;

export type A11yTitleType = string;
export type AlignType =
  | 'baseline'
  | 'center'
  | 'end'
  | 'start'
  | 'stretch'
  | string;
export type AlignContentType =
  | 'around'
  | 'baseline'
  | 'between'
  | 'center'
  | 'evenly'
  | 'end'
  | 'start'
  | 'stretch'
  | string;
export type AlignSelfType =
  | 'start'
  | 'center'
  | 'end'
  | 'stretch'
  | 'baseline'
  | string;
export type AnimateType = boolean;
export interface BackgroundObject {
  color?: ColorType;
  dark?: boolean | string;
  image?: string;
  position?: string;
  opacity?: 'weak' | 'medium' | 'strong' | number | boolean;
  repeat?: 'no-repeat' | 'repeat' | string;
  size?: 'cover' | 'contain' | string;
  light?: string;
  clip?: 'text' | string;
  rotate?: number | string;
}
export type BackgroundType = string | BackgroundObject;
export type HoverIndicatorType =
  | boolean
  | string
  | 'background'
  | BackgroundType
  | {
      background: BackgroundType;
      elevation: ElevationType;
    };
export type BasisType =
  | 'xxsmall'
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | 'xxlarge'
  | 'full'
  | '1/2'
  | '1/3'
  | '2/3'
  | '1/4'
  | '2/4'
  | '3/4'
  | 'auto'
  | string;
export type BorderType =
  | boolean
  | BoxSideType
  | {
      color?: ColorType;
      error?: { color?: ColorType };
      position?: string;
      side?: BoxSideType;
      size?: BoxSizeType;
      style?: BoxStyleType;
    }
  | {
      color?: ColorType;
      error?: { color?: ColorType };
      position?: string;
      side?: BoxSideType;
      size?: BoxSizeType;
      style?: BoxStyleType;
    }[];
export type ColorType = string | { dark?: string; light?: string } | undefined;
export type DirectionType =
  | 'row'
  | 'column'
  | 'row-responsive'
  | 'row-reverse'
  | 'column-reverse';
export type ElevationType =
  | 'none'
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | string;
export type FillType = 'horizontal' | 'vertical' | boolean;
export type GapType = 'none' | EdgeSizeType | string;
export type GraphColorsType = string[] | { dark?: string[]; light?: string[] };
export type GridAreaType = string;
export type JustifyContentType =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | 'stretch';
export type KeyboardType = (event: React.KeyboardEvent<HTMLElement>) => void;
export type MarginType = EdgeType;
export type OpacityType =
  | 'weak'
  | 'medium'
  | 'strong'
  | string
  | true
  | false
  | number;
export type PadType = EdgeType;
export type PlaceHolderType = string | JSX.Element | React.ReactNode;
export type RoundType =
  | boolean
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | 'full'
  | string
  | {
      corner?:
        | 'top'
        | 'left'
        | 'bottom'
        | 'right'
        | 'top-left'
        | 'top-right'
        | 'bottom-left'
        | 'bottom-right';
      size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | string;
    };
export type TextAlignType = 'start' | 'center' | 'end' | 'justify';
export type ThicknessType =
  | 'hair'
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | 'none'
  | string
  | number;

declare const breakpointEdgeSize: {
  none?: string;
  hair?: string;
  xxsmall?: string;
  xsmall?: string;
  small?: string;
  medium?: string;
  large?: string;
  xlarge?: string;
};
export type BreakpointEdgeSize = typeof breakpointEdgeSize;

declare const breakpointBorderSize: {
  xsmall?: string;
  small?: string;
  medium?: string;
  large?: string;
  xlarge?: string;
};
export type BreakpointBorderSize = typeof breakpointBorderSize;

declare const breakpointSize: {
  xxsmall?: string;
  xsmall?: string;
  small?: string;
  medium?: string;
  large?: string;
  xlarge?: string;
  full?: string;
};
export type BreakpointSize = typeof breakpointSize;

export type HeightType =
  | 'xxsmall'
  | 'xxlarge'
  | TShirtSizeType
  | '100%'
  | {
      height?: 'xxsmall' | 'xxlarge' | TShirtSizeType | '100%';
      max?: 'xxsmall' | 'xxlarge' | TShirtSizeType | '100%';
      min?: 'xxsmall' | 'xxlarge' | TShirtSizeType | '100%';
    };

export type WidthType =
  | 'xxsmall'
  | 'xxlarge'
  | TShirtSizeType
  | '100%'
  | {
      width?: 'xxsmall' | 'xxlarge' | TShirtSizeType | '100%';
      max?: 'xxsmall' | 'xxlarge' | TShirtSizeType | '100%';
      min?: 'xxsmall' | 'xxlarge' | TShirtSizeType | '100%';
    };

export type AnimationType =
  | 'fadeIn'
  | 'fadeOut'
  | 'jiggle'
  | 'pulse'
  | 'rotateLeft'
  | 'rotateRight'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'zoomIn'
  | 'zoomOut'
  | {
      type?:
        | 'fadeIn'
        | 'fadeOut'
        | 'jiggle'
        | 'pulse'
        | 'rotateLeft'
        | 'rotateRight'
        | 'slideUp'
        | 'slideDown'
        | 'slideLeft'
        | 'slideRight'
        | 'zoomIn'
        | 'zoomOut';
      delay?: number;
      duration?: number;
      size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
    }
  | (
      | 'fadeIn'
      | 'fadeOut'
      | 'jiggle'
      | 'pulse'
      | 'slideUp'
      | 'slideDown'
      | 'slideLeft'
      | 'slideRight'
      | 'zoomIn'
      | 'zoomOut'
      | {
          type?:
            | 'fadeIn'
            | 'fadeOut'
            | 'jiggle'
            | 'pulse'
            | 'slideUp'
            | 'slideDown'
            | 'slideLeft'
            | 'slideRight'
            | 'zoomIn'
            | 'zoomOut';
          delay?: number;
          duration?: number;
          size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
        }
    )[];

export type SkeletonColorsType = {
  dark?: string[];
  light?: string[];
};

export type SkeletonType =
  | boolean
  | {
      animation?: AnimateType;
      colors?: SkeletonColorsType;
      depth?: number;
      message?: string | { start?: string; end?: string };
    };
