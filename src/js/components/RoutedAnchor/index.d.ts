import * as React from 'react';
import { AnchorProps } from '../Anchor';
import { Omit } from '../../utils';

export interface RoutedAnchorProps {
  method?: 'push' | 'replace';
  path: string;
}

declare const RoutedAnchor: React.ComponentClass<
  RoutedAnchorProps & Omit<AnchorProps, 'href'>
>;

export { RoutedAnchor };
