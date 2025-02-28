import * as React from 'react';
import {
  A11yTitleType,
  Omit,
  PlaceHolderType,
  TextAlignType,
  WidthType,
} from '../../utils';
import { DropType } from '../Drop';

export interface TextInputProps
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    'onSelect' | 'size' | 'placeholder' | 'width'
  > {
  a11yTitle?: A11yTitleType;
  dropAlign?: {
    top?: 'top' | 'bottom';
    bottom?: 'top' | 'bottom';
    right?: 'left' | 'right';
    left?: 'left' | 'right';
  };
  dropHeight?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | string;
  dropTarget?: object;
  dropProps?: DropType;
  focusIndicator?: boolean;
  defaultSuggestion?: number;
  icon?: JSX.Element;
  id?: string;
  messages?: {
    enterSelect?: string;
    suggestionsCount?: string;
    suggestionsExist?: string;
    suggestionIsOpen?: string;
  };
  name?: string;
  onSelect?: (x: {
    target: React.RefObject<HTMLElement | null>['current'];
    suggestion: any;
  }) => void;
  onSuggestionSelect?: (x: {
    target: React.RefObject<HTMLElement | null>['current'];
    suggestion: any;
  }) => void;
  onSuggestionsOpen?: () => void;
  onSuggestionsClose?: () => void;
  placeholder?: PlaceHolderType;
  plain?: boolean | 'full';
  readOnlyCopy?: boolean;
  reverse?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | string;
  suggestions?: ({ label?: React.ReactNode; value?: any } | string)[];
  textAlign?: TextAlignType;
  value?: string | number;
  width?: WidthType;
}

declare const TextInput: React.FC<TextInputProps>;

export { TextInput };
