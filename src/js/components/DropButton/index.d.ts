import * as React from 'react';
import { ButtonProps } from '../Button';
import { DropType } from '../Drop';
import { Omit } from '../../utils';

export interface DropButtonProps {
  dropAlign?: {
    top?: 'top' | 'bottom';
    bottom?: 'top' | 'bottom';
    right?: 'left' | 'right';
    left?: 'left' | 'right';
  };
  dropContent: JSX.Element;
  dropTarget?: object;
  dropProps?: DropType;
  onClose?: React.MouseEventHandler<HTMLDocument | HTMLButtonElement>;
  onOpen?: React.MouseEventHandler<HTMLButtonElement>;
  open?: boolean;
}

type buttonProps = ButtonProps &
  Omit<
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    'color'
  >;

export interface DropButtonExtendedProps extends DropButtonProps, buttonProps {}

declare const DropButton: React.FC<DropButtonExtendedProps>;

export { DropButton };
