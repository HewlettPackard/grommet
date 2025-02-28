import * as React from 'react';

export interface InfiniteScrollProps {
  children?: React.ReactNode | Function;
  items?: (string | number | React.ReactElement<any> | Record<string, any>)[];
  onMore?: () => void;
  renderMarker?: (marker: React.ReactElement<any>) => React.ReactElement<any>;
  replace?: boolean;
  show?: number;
  step?: number;
}

declare const InfiniteScroll: React.FC<InfiniteScrollProps>;

export { InfiniteScroll };
