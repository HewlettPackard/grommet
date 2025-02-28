import * as React from 'react';
import {
  A11yTitleType,
  AlignSelfType,
  GridAreaType,
  MarginType,
  Omit,
} from '../../utils';

type controlsItems =
  | 'captions'
  | 'descriptions'
  | 'fullScreen'
  | 'play'
  | 'pause'
  | 'volume'
  | {
      icon?: React.ReactNode;
      a11yTitle?: A11yTitleType;
      onClick?: (...args: any[]) => any;
    };

export interface VideoProps {
  a11yTitle?: A11yTitleType;
  alignSelf?: AlignSelfType;
  autoPlay?: boolean;
  controls?:
    | false
    | 'over'
    | 'below'
    | {
        position?: false | 'over' | 'below';
        items?: controlsItems[];
      };
  fit?: 'cover' | 'contain';
  gridArea?: GridAreaType;
  loop?: boolean;
  margin?: MarginType;
  messages?: {
    closeMenu?: string;
    fullScreen?: string;
    progressMeter?: string;
    openMenu?: string;
    scrubber?: string;
    pauseButton?: string;
    playButton?: string;
    volumeUp?: string;
    volumeDown?: string;
  };
  mute?: boolean;
  skipInterval?: number;
}

export interface VideoExtendedProps
  extends VideoProps,
    Omit<
      React.DetailedHTMLProps<
        React.VideoHTMLAttributes<HTMLVideoElement>,
        HTMLVideoElement
      >,
      'controls'
    > {}

declare const Video: React.FC<VideoExtendedProps>;

export { Video };
