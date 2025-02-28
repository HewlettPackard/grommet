import * as React from 'react';
import { BoxProps } from '../Box/index';

export interface AvatarProps {
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | string;
  src?: string;
}

export interface AvatarExtendedProps
  extends BoxProps,
    AvatarProps,
    Omit<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >,
      'onClick'
    > {}

declare const Avatar: React.FC<AvatarExtendedProps>;

export { Avatar };
