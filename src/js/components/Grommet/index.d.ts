import * as React from 'react';
import { ThemeType } from '../../themes';
import { BackgroundType } from '../../utils';

export interface GrommetProps {
  background?: BackgroundType;
  containerTarget?: HTMLElement;
  cssVars?: boolean;
  dir?: 'rtl';
  full?: boolean | 'min';
  options?: {
    box?: {
      cssGap?: boolean;
    };
    layer?: {
      singleId?: boolean;
    };
    drop?: {
      checkContainingBlock?: boolean;
    };
  };
  messages?: {
    messages?: {
      button?: {
        busy?: string;
        success?: string;
      };
      calendar?: {
        previousMove?: string;
        previous?: string;
        nextMove?: string;
        next?: string;
      };
      carousel?: {
        previous?: string;
        next?: string;
        jump?: string;
      };
      dateInput?: {
        openCalendar?: string;
        enterCalendar?: string;
        exitCalendar?: string;
      };
      dataChart?: {
        detailTitle?: string;
        detailFocus?: string;
      };
      dataFilters?: {
        clear?: string;
        heading?: string;
        open?: string;
        openSet?: {
          singular?: string;
          plural?: string;
        };
      };
      dataForm?: {
        submit?: string;
      };
      dataSearch?: {
        label?: string;
        open?: string;
      };
      dataSort?: {
        ascending?: string;
        by?: string;
        descending?: string;
        direction?: string;
        open?: string;
      };
      dataSummary?: {
        filtered?: string;
        filteredSingle?: string;
        items?: string;
        itemsSingle?: string;
        selected?: string;
        total?: string;
        totalSingle?: string;
      };
      dataTableColumns?: {
        open?: string;
        order?: string;
        select?: string;
        tip?: string;
      };
      dataTableGroupBy?: {
        clear?: string;
        label?: string;
      };
      dataView?: {
        label?: string;
      };
      fileInput?: {
        browse?: string;
        dropPrompt?: string;
        dropPromptMultiple?: string;
        files?: string;
        maxFile?: string;
        maxSizeSingle?: string;
        maxSizeMultiple?: {
          singular?: string;
          plural?: string;
        };
        remove?: string;
        removeAll?: string;
      };
      form?: {
        invalid?: string;
        required?: string;
      };
      formField?: {
        maxCharacters?: {
          remaining?: {
            singular?: string;
            plural?: string;
          };
          overLimit?: {
            singular?: string;
            plural: string;
          };
        };
      };
      menu?: {
        openMenu?: string;
        closeMenu?: string;
      };
      meter?: {
        bar?: {
          singular?: string;
          plural?: string;
        };
        circle?: {
          singular?: string;
          plural?: string;
        };
        pie?: {
          singular?: string;
          plural?: string;
        };
        semicircle?: {
          singular?: string;
          plural?: string;
        };
      };
      rangeSelector?: {
        lower?: string;
        upper?: string;
      };
      select?: {
        multiple?: string;
        selected?: string;
      };
      selectMultiple?: {
        clearAll?: string;
        clearAllA11y?: string;
        open?: string;
        optionNotSelected?: string;
        optionSelected?: string;
        search?: string;
        selectAll?: string;
        selectAllA11y?: string;
        selectDrop?: string;
        selected?: string;
        selectedOfTotal?: string;
        selectedOptions?: string;
        showMore?: string;
        summarizedValue?: string;
      };
      skipLinks?: {
        skipTo?: string;
      };
      tabs?: {
        tabContents?: string;
      };
      textInput?: {
        enterSelect?: string;
        suggestionsCount?: string;
        suggestionsExist?: string;
        suggestionIsOpen?: string;
      };
      video?: {
        audioDescriptions?: string;
        captions?: string;
        closeMenu?: string;
        description?: string;
        fullScreen?: string;
        progressMeter?: string;
        scrubber?: string;
        openMenu?: string;
        pauseButton?: string;
        playButton?: string;
        volumeDown?: string;
        volumeUp?: string;
      };
    };
    format?: (...args: any[]) => void;
  };
  onAnalytics?: (data: any) => void;
  plain?: boolean;
  theme?: ThemeType;
  themeMode?: 'dark' | 'light' | 'auto';
  userAgent?: string;
}

export interface GrommetExtendedProps
  extends GrommetProps,
    Omit<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >,
      'dir'
    > {}

declare const Grommet: React.FC<GrommetExtendedProps>;

export { Grommet };
