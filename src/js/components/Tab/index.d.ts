import * as React from 'react';
import { A11yTitleType, Omit } from '../../utils';

export interface TabProps {
  a11yTitle?: A11yTitleType;
  disabled?: boolean;
  icon?: JSX.Element;
  plain?: boolean;
  reverse?: boolean;
  title?: React.ReactNode;
}

export interface TabExtendedProps
  extends TabProps,
    Omit<
      React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >,
      'title'
    > {}

declare const Tab: React.FC<TabExtendedProps>;

export { Tab };
