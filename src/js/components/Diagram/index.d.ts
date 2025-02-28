import * as React from 'react';

import { ColorType } from '../../utils';

export type DiagramConnectionAnchor = 'center' | 'vertical' | 'horizontal';
export type DiagramConnectionType = 'direct' | 'curved' | 'rectilinear';
export type DiagramAnimationType =
  | boolean
  | 'pulse'
  | 'draw'
  | {
      type?: 'pulse' | 'draw';
      delay?: number | string;
      duration?: number | string;
      size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
    };

export interface DiagramProps {
  animation?: DiagramAnimationType;
  connections: {
    anchor?: DiagramConnectionAnchor;
    animation?: DiagramAnimationType;
    color?: ColorType;
    fromTarget: string | object;
    label?: string;
    offset?: 'xsmall' | 'small' | 'medium' | 'large' | string;
    thickness?:
      | 'hair'
      | 'xxsmall'
      | 'xsmall'
      | 'small'
      | 'medium'
      | 'large'
      | string;
    toTarget: string | object;
    type?: DiagramConnectionType;
  }[];
}

type divProps = React.DetailedHTMLProps<
  React.SVGAttributes<SVGSVGElement>,
  SVGSVGElement
>;

export interface DiagramExtendedProps extends DiagramProps, divProps {}

declare const Diagram: React.FC<DiagramExtendedProps>;

export { Diagram };
