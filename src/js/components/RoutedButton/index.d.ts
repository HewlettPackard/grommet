import * as React from 'react';
import { ButtonProps } from '../Button';

export interface RoutedButtonProps {
  path: string;
  method?: 'push' | 'replace';
}

declare const RoutedButton: React.ComponentClass<
  RoutedButtonProps & ButtonProps
>;

export { RoutedButton };
