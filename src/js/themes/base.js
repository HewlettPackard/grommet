import { Actions } from 'grommet-icons/icons/Actions';
import { AssistListening } from 'grommet-icons/icons/AssistListening';
import { CircleInformation } from 'grommet-icons/icons/CircleInformation';
import { ClosedCaption } from 'grommet-icons/icons/ClosedCaption';
import { Expand } from 'grommet-icons/icons/Expand';
import { FormClose } from 'grommet-icons/icons/FormClose';
import { FormDown } from 'grommet-icons/icons/FormDown';
import { FormNext } from 'grommet-icons/icons/FormNext';
import { FormPrevious } from 'grommet-icons/icons/FormPrevious';
import { FormUp } from 'grommet-icons/icons/FormUp';
import { Next } from 'grommet-icons/icons/Next';
import { Pause } from 'grommet-icons/icons/Pause';
import { Play } from 'grommet-icons/icons/Play';
import { FormPin } from 'grommet-icons/icons/FormPin';
import { Previous } from 'grommet-icons/icons/Previous';
import { StatusCriticalSmall } from 'grommet-icons/icons/StatusCriticalSmall';
import { StatusGoodSmall } from 'grommet-icons/icons/StatusGoodSmall';
import { StatusWarningSmall } from 'grommet-icons/icons/StatusWarningSmall';
import { StatusUnknownSmall } from 'grommet-icons/icons/StatusUnknownSmall';
import { Subtract } from 'grommet-icons/icons/Subtract';
import { Volume } from 'grommet-icons/icons/Volume';
import { VolumeLow } from 'grommet-icons/icons/VolumeLow';
import { base as iconBase } from 'grommet-icons/themes/base';

import { deepFreeze, deepMerge } from '../utils/object';
import { parseMetricToNum } from '../utils/mixins';

const brandColor = '#7D4CDB';
const accentColors = ['#6FFFB0', '#FD6FFF', '#81FCED', '#FFCA58'];
const neutralColors = ['#00873D', '#3D138D', '#00739D', '#A2423D'];
const statusColors = {
  critical: '#EB0000',
  error: '#B30000',
  warning: '#C27B00',
  ok: '#009E67',
  unknown: '#919191',
  disabled: '#CCCCCC',
};
const darkColors = [
  '#333333',
  '#555555',
  '#777777',
  '#999999',
  '#999999',
  '#999999',
];
const lightColors = [
  '#F8F8F8',
  '#F2F2F2',
  '#EDEDED',
  '#DADADA',
  '#DADADA',
  '#DADADA',
];
const focusColor = accentColors[0];

const colors = {
  active: 'rgba(221, 221, 221, 0.5)',
  'background-back': {
    dark: '#33333308',
    light: '#EDEDED',
  },
  'background-front': {
    dark: '#444444',
    light: '#FFFFFF',
  },
  'background-contrast': {
    light: '#33333310',
    dark: '#FFFFFF18',
  },
  'active-background': 'background-contrast',
  'active-text': 'text-strong',
  black: '#000000',
  border: {
    dark: 'rgba(255, 255, 255, 0.33)',
    light: 'rgba(0, 0, 0, 0.33)',
  },
  brand: brandColor,
  control: {
    dark: 'accent-1',
    light: 'brand',
  },
  focus: focusColor,
  'graph-0': 'accent-1',
  'graph-1': 'neutral-1',
  'graph-2': 'neutral-2',
  'graph-3': 'neutral-3',
  'graph-4': 'neutral-4',
  placeholder: '#AAAAAA',
  selected: 'brand',
  text: {
    dark: '#f8f8f8',
    light: '#444444',
  },
  'text-strong': {
    dark: '#FFFFFF',
    light: '#000000',
  },
  'text-weak': {
    dark: '#CCCCCC',
    light: '#555555',
  },
  'text-xweak': {
    dark: '#BBBBBB',
    light: '#666666',
  },
  icon: {
    dark: '#f8f8f8',
    light: '#666666',
  },
  'selected-background': 'brand',
  'selected-text': 'text-strong',
  white: '#FFFFFF',
};

const colorArray = (array, prefix) =>
  array.forEach((color, index) => {
    colors[`${prefix}-${index + 1}`] = color;
  });

colorArray(accentColors, 'accent');
colorArray(darkColors, 'dark');
colorArray(lightColors, 'light');
colorArray(neutralColors, 'neutral');
Object.keys(statusColors).forEach((color) => {
  colors[`status-${color}`] = statusColors[color];
});

export const generate = (baseSpacing = 24, scale = 6) => {
  // 24
  const baseFontSize = baseSpacing * 0.75; // 18
  const fontScale = baseSpacing / scale; // 4

  const fontSizing = (factor) => ({
    size: `${baseFontSize + factor * fontScale}px`,
    height: `${baseSpacing + factor * fontScale}px`,
    // maxWidth chosen to be ~50 characters wide
    // see: https://ux.stackexchange.com/a/34125
    maxWidth: `${baseSpacing * (baseFontSize + factor * fontScale)}px`,
  });

  const borderWidth = 2;
  const controlBorderWidth = 1;

  const result = deepMerge(iconBase, {
    global: {
      active: {
        background: {
          color: 'active',
          opacity: 'medium',
        },
        color: {
          dark: 'white',
          light: 'black',
        },
      },
      animation: {
        duration: '1s',
        jiggle: {
          duration: '0.1s',
        },
      },
      // backgrounds: undefined,
      borderSize: {
        xsmall: '1px',
        small: '2px',
        medium: `${baseSpacing / 6}px`, // 4
        large: `${baseSpacing / 2}px`, // 12
        xlarge: `${baseSpacing}px`, // 24
      },
      breakpoints: {
        small: {
          value: baseSpacing * 32, // 768
          borderSize: {
            xsmall: '1px',
            small: '2px',
            medium: `${baseSpacing / 6}px`, // 4
            large: `${baseSpacing / 4}px`, // 6
            xlarge: `${baseSpacing / 2}px`, // 12
          },
          edgeSize: {
            none: '0px',
            hair: '1px', // for Chart
            xxsmall: '2px',
            xsmall: `${baseSpacing / 8}px`, // 3
            small: `${baseSpacing / 4}px`, // 6
            medium: `${baseSpacing / 2}px`, // 12
            large: `${baseSpacing}px`, // 24
            xlarge: `${baseSpacing * 2}px`, // 48
          },
          size: {
            xxsmall: `${baseSpacing}px`, // 24
            xsmall: `${baseSpacing * 2}px`, // 48
            small: `${baseSpacing * 4}px`, // 96
            medium: `${baseSpacing * 8}px`, // 192
            large: `${baseSpacing * 16}px`, // 384
            xlarge: `${baseSpacing * 32}px`, // 768
            full: '100%',
          },
        },
        medium: {
          value: baseSpacing * 64, // 1536
        },
        large: {}, // anything above 'medium'
      },
      // Breakpoints used at Server Side Rendering for the initial rendering
      // These values correspond to the theme breakpoints
      deviceBreakpoints: {
        phone: 'small',
        tablet: 'medium',
        computer: 'large',
      },
      colors,
      control: {
        border: {
          width: `${controlBorderWidth}px`,
          radius: '4px',
          color: 'border',
        },
        disabled: {
          opacity: 0.3,
        },
      },
      // The time to wait after the user stopped typing, measured in ms.
      // A half second (500ms) debounce can be a helpful starting point.
      // You want to give the user time to fill out a field, but capture
      // their attention before they move on past it. 2 second (2000ms)
      // might be too long depending on how fast people type, and 200ms
      // would be an eye blink
      debounceDelay: 500,
      drop: {
        // intelligentMargin: undefined,
        background: {
          dark: 'black',
          light: 'white',
        },
        border: {
          radius: '0px',
        },
        // margin: undefined
        shadowSize: 'small', // shadowSize is deprecated, use 'elevation'
        zIndex: '20',
      },
      edgeSize: {
        none: '0px',
        hair: '1px', // for Chart
        xxsmall: `${baseSpacing / 8}px`, // 3
        xsmall: `${baseSpacing / 4}px`, // 6
        small: `${baseSpacing / 2}px`, // 12
        medium: `${baseSpacing}px`, // 24
        large: `${baseSpacing * 2}px`, // 48
        xlarge: `${baseSpacing * 4}px`, // 96
        responsiveBreakpoint: 'small',
      },
      elevation: {
        light: {
          none: 'none',
          xsmall: '0px 1px 2px rgba(0, 0, 0, 0.20)',
          small: '0px 2px 4px rgba(0, 0, 0, 0.20)',
          medium: '0px 4px 8px rgba(0, 0, 0, 0.20)',
          large: '0px 8px 16px rgba(0, 0, 0, 0.20)',
          xlarge: '0px 12px 24px rgba(0, 0, 0, 0.20)',
        },
        dark: {
          none: 'none',
          xsmall: '0px 2px 2px rgba(255, 255, 255, 0.40)',
          small: '0px 4px 4px rgba(255, 255, 255, 0.40)',
          medium: '0px 6px 8px rgba(255, 255, 255, 0.40)',
          large: '0px 8px 16px rgba(255, 255, 255, 0.40)',
          xlarge: '0px 12px 24px rgba(255, 255, 255, 0.40)',
        },
      },
      focus: {
        // shadow or outline are required for accessibility
        border: {
          // remove to only have shadow
          color: 'focus',
        },
        // outline: { color: undefined, size: undefined },
        shadow: {
          color: 'focus',
          size: '2px',
        },
      },
      font: {
        ...fontSizing(0),
        // face: undefined,
        // family: undefined,
      },
      hover: {
        background: {
          color: 'active',
          opacity: 'medium',
        },
        color: {
          dark: 'white',
          light: 'black',
        },
      },
      input: {
        padding: {
          horizontal: `${
            parseMetricToNum(`${baseSpacing / 2}px`) -
            parseMetricToNum(`${controlBorderWidth}px`)
          }px`,
          vertical: `${
            parseMetricToNum(`${baseSpacing / 2}px`) -
            parseMetricToNum(`${controlBorderWidth}px`)
          }px`,
        },
        font: {
          // size: undefined,
          // height: undefined,
          weight: 600,
        },
        // deprecate in v3
        // weight: undefined,
        readOnly: {
          // background: undefined,
          // border: {
          //  color: undefined,
          // },
        },
      },
      opacity: {
        strong: 0.8,
        medium: 0.4,
        weak: 0.1,
      },
      selected: {
        background: 'selected',
        color: 'white',
      },
      spacing: `${baseSpacing}px`,
      size: {
        xxsmall: `${baseSpacing * 2}px`, // 48
        xsmall: `${baseSpacing * 4}px`, // 96
        small: `${baseSpacing * 8}px`, // 192
        medium: `${baseSpacing * 16}px`, // 384
        large: `${baseSpacing * 32}px`, // 768
        xlarge: `${baseSpacing * 48}px`, // 1152
        xxlarge: `${baseSpacing * 64}px`, // 1536
        full: '100%',
      },
    },
    // icon: {
    //   extennd: undefined,
    //   matchSize: undefined,
    //   size: undefined,
    // },
    accordion: {
      panel: {
        // border: {
        //   side: 'bottom',
        //   color: 'border',
        // },
      },
      border: {
        side: 'bottom',
        color: 'border',
      },
      heading: {
        level: '4', // level ranges from 1-6
        // margin: undefined
      },
      hover: {
        // background: undefined,
        color: { dark: 'light-4', light: 'dark-3' }, // deprecated
        heading: {
          color: { dark: 'light-4', light: 'dark-3' },
        },
      },
      icons: {
        collapse: FormUp,
        expand: FormDown,
        // color: { dark: undefined, light: undefined },
      },
    },
    anchor: {
      color: {
        dark: 'accent-1',
        light: 'brand',
      },
      gap: 'small',
      hover: {
        textDecoration: 'underline',
        // fontWeight: undefined,
        // extend: undefined,
      },
      // icon: {
      //   color: undefined
      // },
      textDecoration: 'none',
      fontWeight: 600,
      // size: {
      //   medium: {
      //     color: undefined,
      //     fontWeight: undefined,
      //     textDecoration: undefined,
      //   },
      // },
      // extend: undefined,
    },
    avatar: {
      // extend: undefined,
      size: {
        xsmall: `${baseSpacing * 0.75}px`, // 18px
        small: `${baseSpacing}px`, // 24px
        medium: `${baseSpacing * 2}px`, // default 48px
        large: `${baseSpacing * 3}px`, // 72px
        xlarge: `${baseSpacing * 4}px`, // 96px
        '2xl': `${baseSpacing * 5}px`, // 120px
        '3xl': `${baseSpacing * 6}px`, // 144px
        '4xl': `${baseSpacing * 7}px`, // 168px
        '5xl': `${baseSpacing * 8}px`, // 192px
      },
      text: {
        size: {
          xsmall: 'small', // 14px
          small: 'medium', // 18px
          medium: 'large', // 22px
          large: 'xlarge', // 26px
          xlarge: 'xxlarge', // 34px
          '2xl': '3xl', // 42px
          '3xl': '4xl', // 54px
          '4xl': '5xl', // 70px
          '5xl': '6xl', // 90px
        },
        // fontWeight: undefined,
        // extend: undefined
      },
    },
    box: {
      responsiveBreakpoint: 'small', // when we switch rows to columns
      // extend: undefined,
    },
    button: {
      intelligentPad: true,
      // background: undefined,
      badge: {
        // align: undefined,,
        container: {
          background: 'brand',
          // pad: undefined,
          // extend: undefined,
        },
        size: {
          medium: `${baseSpacing}px`, // 24px
        },
        text: {
          size: {
            medium: 'small', // 14px
          },
        },
      },
      gap: 'small',
      size: {
        small: {
          border: {
            radius: `${baseSpacing * 0.75}px`,
          },
          pad: {
            vertical: `${baseSpacing / 4 - borderWidth}px`, // 4px
            horizontal: `${baseSpacing - borderWidth * 2}px`, // 20px,
          },
          // iconOnly: {
          //   pad: undefined,
          // },
        },
        medium: {
          border: {
            radius: `${baseSpacing * 0.75}px`, // 18px
          },
          pad: {
            vertical: `${baseSpacing / 4 - borderWidth}px`, // 4px
            horizontal: `${baseSpacing - borderWidth}px`, // 22px
          },
          // iconOnly: {
          //   pad: undefined,
          // },
        },
        large: {
          border: {
            radius: `${baseSpacing}px`, // 24px
          },
          pad: {
            vertical: `${baseSpacing / 4 + borderWidth}px`, // 8px
            horizontal: `${baseSpacing + borderWidth * 4}px`, // 32px,
          },
          // iconOnly: {
          //   pad: undefined,
          // },
        },
      },
      border: {
        // color: { dark: undefined, light: undefined }
        width: `${borderWidth}px`,
        radius: `${baseSpacing * 0.75}px`,
      },
      // color: { dark: undefined, light: undefined },
      // elevation: undefined,
      // default: {
      //   background: undefined,
      //   border: undefined,
      //   color: undefined,
      //   direction: undefined,
      //   elevation: undefined,
      //   font: {
      //     size: undefined,
      //     weight: undefined,
      //   },
      //   icon: undefined,
      //   padding: {
      //     vertical: undefined,
      //     horizontal: undefined,
      //   },
      //   reverse: undefined,
      //   extend: undefined,
      // },
      // primary: {
      //   font: {
      //     size: undefined,
      //     weight: undefined,
      //   },
      //   background: undefined,
      //   border: undefined,
      //   color: undefined,
      //   direction: undefined,
      //   elevation: undefined,
      //   icon: undefined,
      //   padding: {
      //     vertical: undefined,
      //     horizontal: undefined,
      //   },
      //   reverse: undefined,
      //   extend: undefined,
      // },
      // secondary: {
      //   font: {
      //     size: undefined,
      //     weight: undefined,
      //   },
      //   background: undefined,
      //   border: undefined,
      //   color: undefined,
      //   direction: undefined,
      //   elevation: undefined,
      //   icon: undefined,
      //   padding: {
      //     vertical: undefined,
      //     horizontal: undefined,
      //   },
      //   reverse: undefined,
      //   extend: undefined,
      // },
      // option: {
      //   background: undefined,
      //   border: undefined,
      //   color: undefined,
      //   direction: undefined,
      //   elevation: undefined,
      //   icon: undefined,
      //   padding: {
      //     vertical: undefined,
      //     horizontal: undefined,
      //   },
      //   reverse: undefined,
      //   extend: undefined,
      // },
      active: {
        background: 'active-background',
        //   border: undefined,
        color: 'active-text',
        //   extend: undefined,
        //   default: {},
        //   primary: {},
        //   secondary: {},
      },
      disabled: {
        //   background: undefined,
        //   border: undefined,
        //   color: undefined,
        opacity: 0.3,
        //   extend: undefined,
        //   default: {},
        //   primary: {},
        //   secondary: {},
      },
      // hover: {
      //   background: undefined,
      //   border: undefined,
      //   color: undefined,
      //   extend: undefined,
      //   default: {},
      //   primary: {},
      //   secondary: {},
      // },
      padding: {
        vertical: `${baseSpacing / 4 - borderWidth}px`,
        horizontal: `${baseSpacing - borderWidth}px`,
      },
      transition: {
        timing: 'ease-in-out',
        duration: 0.1,
        properties: ['color', 'background-color', 'border-color', 'box-shadow'],
      },
      skeleton: {
        width: { min: '100px' },
      },
    },
    calendar: {
      day: {
        // adjacent: {
        //   color: undefined,
        // },
        // hover: {
        //   background: undefined,
        //   color: undefined,
        // },
        selected: {
          // background: undefined,
          // color: undefined,
          font: {
            weight: 'bold',
          },
          // hover: {
          //   background: undefined,
          //   color: undefined,
          // },
        },
        inRange: {
          // color: undefined,
          font: {
            weight: 'bold',
          },
          // hover: {
          //   background: undefined,
          //   color: undefined,
          // },
        },
        // extend: undefined,
      },
      // range: {
      //   background: undefined,
      // },
      // daySize must align with global.size
      small: {
        // day: {
        //   round: undefined,
        // },
        // range: {
        //   round: undefined,
        //   start: {
        //     round: undefined,
        //   },
        //   end: {
        //     round: undefined,
        //   },
        // },
        // title: {},
        fontSize: `${baseFontSize - fontScale}px`,
        lineHeight: 1.375,
        daySize: `${(baseSpacing * 8) / 7}px`,
        slideDuration: '0.2s',
      },
      medium: {
        // day: {
        //   round: undefined,
        // },
        // range: {
        //   round: undefined,
        //   start: {
        //     round: undefined,
        //   },
        //   end: {
        //     round: undefined,
        //   },
        // },
        // title: {},
        fontSize: `${baseFontSize}px`,
        lineHeight: 1.45,
        daySize: `${(baseSpacing * 16) / 7}px`,
        slideDuration: '0.5s',
      },
      large: {
        // day: {
        //   round: undefined,
        // },
        // range: {
        //   round: undefined,
        //   start: {
        //     round: undefined,
        //   },
        //   end: {
        //     round: undefined,
        //   },
        // },
        // title: {},
        fontSize: `${baseFontSize + 3 * fontScale}px`,
        lineHeight: 1.11,
        daySize: `${(baseSpacing * 32) / 7}px`,
        slideDuration: '0.8s',
      },
      icons: {
        previous: Previous,
        next: Next,
        small: {
          previous: FormPrevious,
          next: FormNext,
        },
      },
      heading: { level: '4' }, // level ranges from 1-6
    },
    card: {
      container: {
        round: 'small',
        elevation: 'small',
        // extend: undefined,
      },
      // hover: {
      //   container: {
      //     elevation: undefined,
      //   },
      // },
      header: {},
      body: {},
      footer: {},
    },
    cards: {
      container: {
        // any box props
        gap: 'xsmall',
        // extend: undefined,
      },
    },
    carousel: {
      icons: {
        current: Subtract,
        next: Next,
        previous: Previous,
        // color: { dark: undefined, light: undefined },
      },
      animation: {
        duration: 1000,
      },
      disabled: {
        icons: {
          // color: { dark: undefined, light: undefined },
        },
      },
    },
    chart: {
      color: 'graph-0',
      // extend: undefined,
    },
    checkBox: {
      border: {
        color: {
          dark: 'rgba(255, 255, 255, 0.5)',
          light: 'rgba(0, 0, 0, 0.15)',
        },
        width: '2px',
      },
      check: {
        // extend: undefined,
        radius: '4px',
        thickness: '4px',
      },
      label: {
        align: 'center',
      },
      // color: { dark: undefined, light: undefined },
      // extend: undefined,
      // gap: undefined
      hover: {
        border: {
          color: {
            dark: 'white',
            light: 'black',
          },
        },
        // background: undefined,
        // extend: undefined,
      },
      icon: {
        // size: undefined,
        // extend: undefined,
      },
      icons: {
        // checked: undefined,
        // indeterminate: undefined,
      },
      // pad: undefined,
      size: `${baseSpacing}px`,
      toggle: {
        // background: undefined
        color: {
          dark: '#d9d9d9',
          light: '#d9d9d9',
        },
        knob: {
          // extend: undefined,
        },
        radius: `${baseSpacing}px`,
        size: `${baseSpacing * 2}px`,
        // extend: undefined,
      },
    },
    checkBoxGroup: {
      // container: {
      //   // any box props
      //   extend: undefined,
      // },
    },
    clock: {
      analog: {
        // extend: undefined,
        hour: {
          color: {
            dark: 'light-2',
            light: 'dark-3',
          },
          width: `${baseSpacing / 3}px`,
          size: `${baseSpacing}px`,
          shape: 'round',
        },
        minute: {
          color: {
            dark: 'light-4',
            light: 'dark-3',
          },
          width: `${baseSpacing / 6}px`,
          size: `${Math.round(baseSpacing / 2)}px`,
          shape: 'round',
        },
        second: {
          color: {
            dark: 'accent-1',
            light: 'accent-1',
          },
          width: `${baseSpacing / 8}px`,
          size: `${Math.round(baseSpacing / 2.666)}px`,
          shape: 'round',
        },
        size: {
          xsmall: `${baseSpacing * 2}px`,
          small: `${baseSpacing * 3}px`,
          medium: `${baseSpacing * 4}px`,
          large: `${baseSpacing * 6}px`,
          xlarge: `${baseSpacing * 9}px`,
          xxlarge: `${baseSpacing * 12}px`,
          huge: `${baseSpacing * 12}px`, // kept for backwards compatibility
        },
      },
      digital: {
        text: {
          xsmall: { size: `${baseFontSize - 2 * fontScale}px`, height: 1.5 },
          small: { size: `${baseFontSize - fontScale}px`, height: 1.43 },
          medium: { size: `${baseFontSize}px`, height: 1.375 },
          large: { size: `${baseFontSize + fontScale}px`, height: 1.167 },
          xlarge: { size: `${baseFontSize + 2 * fontScale}px`, height: 1.1875 },
          xxlarge: { size: `${baseFontSize + 4 * fontScale}px`, height: 1.125 },
        },
      },
    },
    collapsible: {
      minSpeed: 200,
      baseline: 500,
    },
    data: {
      // button: {
      //   kind: undefined,
      // },
    },
    dateInput: {
      container: {
        round: 'xxsmall',
      },
      // icon: {
      //   size: undefined,
      // },
    },
    dataTable: {
      // body: {
      //   extend: undefined,
      //   selected: undefined,
      // },
      pinned: {
        // body: {
        //    background: undefined,
        //    extend: undefined,
        // },
        header: {
          background: { opacity: 'strong' },
          //  extend: undefined,
        },
        footer: {
          background: { opacity: 'strong' },
          //  extend: undefined,
        },
      },
      container: {
        // any box props
        gap: 'xsmall',
        // extend: undefined,
      },
      groupHeader: {
        // background: undefined,
        // border: undefined,
        // pad: undefined,
      },
      groupEnd: {
        border: { side: 'bottom', size: 'xsmall' },
      },
      header: {
        // background: undefined,
        // border: undefined,
        // color: undefined,
        // extend: undefined,
        // font: {
        //   weight: undefined,
        //   size: undefined,
        // },
        gap: 'small',
        // hover: {
        //   background: undefined,
        // },
        // pad: undefined,
        units: {
          color: 'text-xweak',
          margin: { left: 'xsmall' },
          alignSelf: 'end',
        },
      },
      icons: {
        ascending: FormDown,
        contract: FormUp,
        descending: FormUp,
        expand: FormDown,
        // sortable: undefined,
      },
      primary: {
        weight: 'bold',
      },
      resize: {
        border: {
          color: 'border',
          side: 'end',
        },
        // hover: {
        //   border: {
        //     color: undefined,
        //     side: undefined,
        //     size: undefined,
        //   },
        // },
      },
    },
    diagram: {
      // extend: undefined,
      line: {
        color: 'graph-0',
      },
    },
    // drop: {
    //   extend: undefined,
    //   maxHeight: undefined,
    // },
    fileInput: {
      // background: {},
      border: {
        // color: undefined,
        side: 'all',
        size: 'small',
        style: 'dashed',
      },
      dragOver: {
        border: {
          color: 'control',
        },
        // extend: undefined,
      },
      hover: {
        border: {
          color: 'brand',
        },
        // extend: undefined,
      },
      icons: {
        remove: FormClose,
      },
      // pad: {},
      label: {
        margin: 'small',
        // extend: undefined,
      },
      message: {
        margin: 'small',
        // extend: undefined,
      },
      // extend: undefined,
    },
    formField: {
      border: {
        color: 'border',
        error: {
          color: {
            dark: 'white',
            light: 'status-critical',
          },
        },
        position: 'inner',
        side: 'bottom',
      },
      // checkBox: {
      //   pad: undefined,
      // },
      content: {
        // margin: undefined,
        pad: 'small',
      },
      disabled: {
        background: {
          color: 'status-disabled',
          opacity: 'medium',
        },
        // border: {
        //   color: undefined,
        // },
        // label: {
        //   color: undefined,
        // },
        // help: {
        //   color: undefined,
        // },
        // info: {
        //   color: undefined,
        // },
      },
      // focus: {
      //   background: {
      //     color: undefined,
      //   },
      //   border: {
      //     color: undefined,
      //   },
      // },
      error: {
        color: 'status-critical',
        margin: { vertical: 'xsmall', horizontal: 'small' },
        // background: undefined,
        // container: {}, // any Box props
        // icon: undefined,
      },
      // extend: undefined,
      help: {
        color: 'dark-2',
        margin: {
          start: 'small',
        },
      },
      info: {
        color: 'text-xweak',
        margin: { vertical: 'xsmall', horizontal: 'small' },
        // container: {}, // any Box props
        // icon: undefined,
      },
      label: {
        margin: { vertical: 'xsmall', horizontal: 'small' },
        // requiredIndicator: undefined,
      },
      margin: { bottom: 'small' },
      // round: undefined,
      survey: {
        label: {
          margin: { bottom: 'xsmall' },
          size: 'medium',
          weight: 400,
        },
      },
    },
    grommet: {
      // extend: undefined
    },
    header: {
      sticky: {
        zIndex: '20',
      },
    },
    heading: {
      // color: undefined,
      font: {
        // family: undefined
      },
      level: {
        1: {
          font: {
            // family: undefined,
            // weight: undefined,
          },
          small: { ...fontSizing(4) },
          medium: { ...fontSizing(8) },
          large: { ...fontSizing(16) },
          xlarge: { ...fontSizing(24) },
        },
        2: {
          font: {
            // family: undefined,
            // weight: undefined,
          },
          small: { ...fontSizing(2) },
          medium: { ...fontSizing(4) },
          large: { ...fontSizing(8) },
          xlarge: { ...fontSizing(12) },
        },
        3: {
          font: {
            // family: undefined,
            // weight: undefined,
          },
          small: { ...fontSizing(1) },
          medium: { ...fontSizing(2) },
          large: { ...fontSizing(4) },
          xlarge: { ...fontSizing(6) },
        },
        4: {
          font: {
            // family: undefined,
            // weight: undefined,
          },
          small: { ...fontSizing(0) },
          medium: { ...fontSizing(0) },
          large: { ...fontSizing(0) },
          xlarge: { ...fontSizing(0) },
        },
        5: {
          font: {
            // family: undefined,
            // weight: undefined,
          },
          small: { ...fontSizing(-0.5) },
          medium: { ...fontSizing(-0.5) },
          large: { ...fontSizing(-0.5) },
          xlarge: { ...fontSizing(-0.5) },
        },
        6: {
          font: {
            // family: undefined,
            // weight: undefined,
          },
          small: { ...fontSizing(-1) },
          medium: { ...fontSizing(-1) },
          large: { ...fontSizing(-1) },
          xlarge: { ...fontSizing(-1) },
        },
      },
      responsiveBreakpoint: 'small', // when we scale the font size down
      weight: 600,
      skeleton: {
        width: { min: '150px', max: '200px' },
      },
    },
    layer: {
      background: {
        dark: 'black',
        light: 'white',
      },
      border: {
        radius: '4px',
        // intelligentRounding: undefined,
      },
      container: {
        // elevation: undefined,
        zIndex: '20',
      },
      // extend: undefined,
      overlay: {
        background: 'rgba(0, 0, 0, 0.5)',
        // backdropFilter: undefined,
      },
      responsiveBreakpoint: 'small', // when Layer takes over the full screen
      zIndex: '20',
    },
    list: {
      container: {
        // any box props
        gap: 'xsmall',
        // extend: undefined,
      },
      item: {
        // background: undefined,
        border: 'horizontal',
        disabled: {
          color: 'status-disabled',
          cursor: 'default',
        },
        pinned: {
          background: 'background-contrast',
          icon: {
            size: 'medium',
            pad: 'small',
          },
        },
        pad: { horizontal: 'medium', vertical: 'small' },
        // extend: undefined,
      },
      primaryKey: {
        // any text props
        weight: 'bold',
      },
      icons: {
        down: FormDown,
        up: FormUp,
        pin: FormPin,
      },
      // extend: undefined,
    },
    maskedInput: {
      // container: {
      //   extend: undefined,
      // },
      // extend: undefined,
      // disabled: { opacity: undefined },
    },
    menu: {
      // background: undefined,
      // item: undefined,
      // extend: undefined,
      drop: {
        align: {
          top: 'top',
          left: 'left',
        },
        // any drop props
      },
      group: {
        container: {
          pad: {
            vertical: 'xsmall',
          },
        },
        separator: {
          color: 'border',
          size: 'xsmall',
          pad: {
            horizontal: 'small',
          },
        },
      },
      icons: {
        down: FormDown,
        // up: undefined,
        // color: { dark: undefined, light: undefined },
      },
    },
    meter: {
      color: 'graph-0',
      // colors: [] || colors: ['graph-0', 'graph-1', 'graph-2', 'graph-3'],
      // extend: undefined,
    },
    nameValueList: {
      gap: {
        column: 'large',
        row: 'small',
      },
      pair: {
        column: {
          gap: {
            column: 'large',
            row: 'medium',
          },
        },
      },
      name: {
        width: 'small',
      },
      value: {
        width: 'medium',
      },
    },
    nameValuePair: {
      column: {
        gap: 'xxsmall',
      },
      name: {
        // any text props
        color: 'text',
        weight: 'bold',
      },
      value: {
        // any text props
        color: 'text',
      },
    },
    notification: {
      actions: {
        // any anchor props
      },
      direction: 'column',
      container: {
        // any box props
        round: 'xsmall',
        pad: { horizontal: 'small', vertical: 'xsmall' },
        background: {
          color: 'background-front',
        },
      },
      global: {
        direction: 'row',
        container: {
          // any box props
          round: 'none',
          pad: {
            horizontal: 'large',
            vertical: 'xsmall',
          },
        },
      },
      toast: {
        // direction: undefined,
        container: {
          // any box props
          elevation: 'medium',
          width: 'medium',
        },
        layer: {
          position: 'top',
          margin: 'medium',
        },
        time: 8000,
      },
      iconContainer: {
        // any box props
        pad: { right: 'small' },
        flex: false,
      },
      textContainer: {
        // any box props
        gap: 'medium',
      },
      title: {
        // any text props
        weight: 'bold',
      },
      message: {
        // any text props
        margin: 'none',
      },
      close: {
        icon: FormClose,
      },
      critical: {
        icon: StatusCriticalSmall,
        background: {
          color: 'status-critical',
          opacity: 'weak',
        },
        color: 'status-critical',
        // message: {
        //   color: undefined,
        // },
        // title: {
        //   color: undefined,
        // },
        // global: {},
        toast: {
          background: 'background-front',
          // message: {
          //   color: undefined,
          // },
          // title: {
          //   color: undefined,
          // },
        },
      },
      warning: {
        icon: StatusWarningSmall,
        background: {
          color: 'status-warning',
          opacity: 'weak',
        },
        color: 'status-warning',
        // message: {
        //   color: undefined,
        // },
        // title: {
        //   color: undefined,
        // },
        // global: {},
        toast: {
          background: 'background-front',
          // message: {
          //   color: undefined,
          // },
          // title: {
          //   color: undefined,
          // },
        },
      },
      normal: {
        icon: StatusGoodSmall,
        background: {
          color: 'status-ok',
          opacity: 'weak',
        },
        color: 'status-ok',
        // message: {
        //   color: undefined,
        // },
        // title: {
        //   color: undefined,
        // },
        // global: {},
        toast: {
          background: 'background-front',
          // message: {
          //   color: undefined,
          // },
          // title: {
          //   color: undefined,
          // },
        },
      },
      info: {
        icon: CircleInformation,
        background: 'background-contrast',
        color: 'text-strong',
        // message: {
        //   color: undefined,
        // },
        // title: {
        //   color: undefined,
        // },
        // global: {},
        toast: {
          background: 'background-front',
          // message: {
          //   color: undefined,
          // },
          // title: {
          //   color: undefined,
          // },
        },
      },
      unknown: {
        icon: StatusUnknownSmall,
        background: {
          color: 'status-unknown',
          opacity: 'weak',
        },
        color: 'status-unknown',
        // message: {
        //   color: undefined,
        // },
        // title: {
        //   color: undefined,
        // },
        // global: {},
        toast: {
          background: 'background-front',
          // message: {
          //   color: undefined,
          // },
          // title: {
          //   color: undefined,
          // },
        },
      },
      // deprecate "undefined" in v3
      // and if undefined, no icon
      undefined: {
        icon: StatusUnknownSmall,
        // background: undefined,
        color: 'status-unknown',
        // message: {
        //   color: undefined,
        // },
        // title: {
        //   color: undefined,
        // },
        // global: {},
        // toast: {},
      },
    },
    page: {
      wide: {
        alignSelf: 'center',
        width: {
          min: 'medium',
          max: 'xxlarge',
        },
        small: {
          pad: { horizontal: 'large' },
        },
        medium: {
          pad: { horizontal: 'medium' },
        },
        large: {
          pad: { horizontal: 'large' },
        },
      },
      narrow: {
        alignSelf: 'center',
        width: {
          min: 'medium',
          max: 'large',
        },
        small: {
          pad: { horizontal: 'large' },
        },
        medium: {
          pad: { horizontal: 'medium' },
        },
        large: {
          pad: { horizontal: 'large' },
        },
      },
      full: {
        alignSelf: 'start',
        width: {
          min: 'medium',
          max: '100%',
        },
        small: {
          pad: { horizontal: 'large' },
        },
        medium: {
          pad: { horizontal: 'medium' },
        },
        large: {
          pad: { horizontal: 'large' },
        },
      },
    },
    pageHeader: {
      actions: {
        // any box props
        align: 'end',
      },
      pad: {
        top: 'large',
        bottom: 'medium',
      },
      parent: {
        // any box props
        align: 'start',
      },
      responsive: {
        actions: {
          // any box props
          align: 'start',
          pad: {
            top: 'small',
          },
        },
        areas: [['parent'], ['title'], ['subtitle'], ['actions']],
        breakpoints: ['small'],
        columns: ['auto'],
        rows: ['auto'],
        // gap: undefined,
      },
      subtitle: {
        // any paragraph props
        margin: 'none',
      },
      title: {
        // any heading props
        margin: 'none',
        fill: true,
      },
      size: {
        small: {
          pad: {
            top: 'medium',
            bottom: 'small',
          },
          subtitle: {
            size: 'small',
          },
          title: {
            size: 'small',
          },
        },
        // medium: {
        //   // pad: undefined,
        //   // subtitle: {},
        //   // title: {},
        // },
        large: {
          pad: {
            top: 'xlarge',
            bottom: 'large',
          },
          subtitle: {
            size: 'large',
          },
          title: {
            size: 'large',
          },
        },
      },
      small: {
        areas: [
          ['parent', 'parent'],
          ['title', 'actions'],
          ['subtitle', 'actions'],
        ],
        columns: [['small', 'flex'], 'auto'],
        rows: ['auto', 'auto', 'auto'],
        gap: { row: 'xsmall', column: 'large' },
      },
      medium: {
        areas: [
          ['parent', 'parent'],
          ['title', 'actions'],
          ['subtitle', 'actions'],
        ],
        columns: [['medium', 'flex'], 'auto'],
        rows: ['auto', 'auto', 'auto'],
        gap: { row: 'xsmall', column: 'medium' },
      },
      large: {
        areas: [
          ['parent', 'parent'],
          ['title', 'actions'],
          ['subtitle', 'actions'],
        ],
        columns: [['medium', 'flex'], 'auto'],
        rows: ['auto', 'auto', 'auto'],
        gap: { row: 'xsmall', column: 'large' },
      },
    },
    pagination: {
      button: {
        active: {
          background: {
            color: 'active-background',
          },
        },
        color: 'text-strong',
        hover: {
          background: {
            color: 'background-contrast',
          },
          color: undefined,
        },
        size: {
          small: {
            border: {
              radius: `${baseSpacing / 8}px`, // 3
              width: '2px',
            },
            pad: {
              vertical: `4px`,
              horizontal: `4px`,
            },
            font: { ...fontSizing(-1) },
            height: `${baseSpacing * 1.25}px`,
            width: `${baseSpacing * 1.25}px`,
          },
          medium: {
            border: {
              radius: `${baseSpacing / 6}px`, // 4
              width: '2px',
            },
            pad: {
              vertical: `4px`,
              horizontal: `4px`,
            },
            font: { ...fontSizing(0) },
            height: `${baseSpacing * 1.5}px`,
            width: `${baseSpacing * 1.5}px`,
          },
          large: {
            border: {
              radius: `${baseSpacing / 4}px`, // 6
              width: '2px',
            },
            pad: {
              vertical: `4px`,
              horizontal: `4px`,
            },
            font: { ...fontSizing(1) },
            height: `${baseSpacing * 2}px`,
            width: `${baseSpacing * 2}px`,
          },
        },
      },
      // container: {
      //   // any box props,
      //   extend: undefined,
      // },
      controls: {
        align: 'center',
        direction: 'row',
        gap: 'xxsmall',
        margin: 'none',
        pad: 'none',
      },
      icons: {
        // color: undefined,
        next: Next,
        previous: Previous,
      },
    },
    paragraph: {
      font: {
        // family: undefined
      },
      small: { ...fontSizing(-1) },
      medium: { ...fontSizing(0) },
      large: { ...fontSizing(1) },
      xlarge: { ...fontSizing(2) },
      xxlarge: { ...fontSizing(4) },
    },
    thumbsRating: {
      // dislike: {
      //   color: undefined,
      // },
      // like: {
      //   color: undefined,
      // },
    },
    spinner: {
      container: {
        animation: 'rotateRight',
        color: 'brand',
        pad: 'small',
        round: 'full',
        size: 'small',
      },
      // icon: undefined
      size: {
        xsmall: `${baseSpacing * 0.75}px`,
        small: `${baseSpacing}px`, // default 24
        medium: `${baseSpacing * 2}px`,
        large: `${baseSpacing * 3}px`,
        xlarge: `${baseSpacing * 4}px`,
      },
    },
    radioButton: {
      border: {
        color: {
          dark: 'rgba(255, 255, 255, 0.5)',
          light: 'rgba(0, 0, 0, 0.15)',
        },
        width: '2px',
      },
      // background: {
      //   color: undefined,
      // },
      check: {
        radius: '100%',
        // background: {
        //  color: undefined,
        // },
        // color: { dark: undefined, light: undefined },
        // extend: undefined,
      },
      // color: undefined,
      hover: {
        // background: {
        //   color: undefined,
        // },
        border: {
          color: {
            dark: 'white',
            light: 'black',
          },
        },
      },
      icon: {
        // size: undefined,
        // extend: undefined,
      },
      icons: {
        // circle: undefined,
      },
      gap: 'small',
      size: `${baseSpacing}px`,
      font: {
        // weight: undefined,
      },
      container: {
        // extend: undefined
      },
    },
    radioButtonGroup: {
      // container: {}, // any box props
    },
    rangeInput: {
      disabled: {
        opacity: 0.3,
        //   thumb: {
        //     color: undefined,
        //   },
        //   track: {
        //     color: undefined,
        //   },
      },
      // extend: undefined
      track: {
        height: '4px',
        color: 'border',
        // opacity: undefined,
        // lower: {
        //   color: 'undefined',
        //   opacity: undefined,
        // },
        // upper: {
        //   color: undefined,
        //   opacity: undefined,
        // },
        // extend: undefined
      },
      thumb: {
        // color: { dark: undefined, light: undefined },
        // extend: undefined
      },
      // wheel: undefined
    },
    rangeSelector: {
      background: {
        invert: {
          color: 'light-4',
        },
      },
      // edge: {
      //   type: undefined,
      // },
    },
    select: {
      // background: undefined,
      clear: {
        container: {
          pad: 'small',
          background: 'background-contrast',
          // hover: {
          //   // any box props
          // },
        }, // any box props
        text: {
          color: 'text-weak',
        }, // any text props
      },
      container: {
        // extend: undefined,
      },
      control: {
        // extend: undefined,
        // open: undefined,
      },
      // emptySearchMessage: {
      //   container: {}, // any box props
      //   text: {}, // any text props
      // },
      icons: {
        // color: { dark: undefined, light: undefined },
        margin: { horizontal: 'small' },
        down: FormDown,
        // up: undefined
      },
      options: {
        container: {
          align: 'start',
          pad: 'small',
        },
        text: {
          margin: 'none',
        },
      },
      // searchInput: undefined,
      step: 20,
    },
    selectMultiple: {
      maxInline: 5,
    },
    skeleton: {
      border: false,
      colors: {
        dark: ['background', 'background-front'],
        light: ['background', 'background-back'],
      },
      // extend: undefined,
    },
    skipLinks: {
      position: 'top',
      container: {
        elevation: 'large',
        round: 'small',
        pad: 'medium',
      },
      label: {
        margin: { bottom: 'medium' },
        size: 'medium',
      },
    },
    starRating: {
      // color: undefined,
    },
    tab: {
      active: {
        color: 'text',
        // background: undefined,
      },
      // background: undefined,
      border: {
        side: 'bottom',
        size: 'small',
        color: {
          dark: 'accent-1',
          light: 'brand',
        },
        active: {
          color: {
            dark: 'white',
            light: 'black',
          },
        },
        disabled: {
          // color: undefined,
        },
        hover: {
          color: {
            dark: 'white',
            light: 'black',
          },
          // extend: undefined,
        },
      },
      color: 'control',
      // disabled: {
      //   color: undefined,
      // },
      // extend: undefined,
      hover: {
        // background: undefined,
        // extend: undefined,
        color: {
          dark: 'white',
          light: 'black',
        },
      },
      margin: {
        vertical: 'xxsmall',
        horizontal: 'small',
      },
      pad: {
        bottom: 'xsmall',
      },
    },
    tabs: {
      // background: undefined,
      // extend: undefined,
      // gap: undefined,
      header: {
        // alignSelf: undefined,
        // background: undefined,
        // border: {
        //   side: undefined,
        //   size: undefined,
        //   style: undefined,
        //   color: undefined,
        // },
        // extend: undefined,
      },
      panel: {
        // extend: undefined,
      },
      step: {
        small: 1,
        medium: 3,
        large: 3,
      },
    },
    table: {
      header: {
        align: 'start',
        pad: { horizontal: 'small', vertical: 'xsmall' },
        border: 'bottom',
        // verticalAlign: undefined,
        // background: undefined,
        // extend: undefined,
      },
      body: {
        align: 'start',
        pad: { horizontal: 'small', vertical: 'xsmall' },
        // background: undefined,
        // border: undefined,
        // extend: undefined,
      },
      // row: {
      //   hover: {
      //     background: undefined,
      //     color: undefined,
      //   },
      // },
      footer: {
        align: 'start',
        pad: { horizontal: 'small', vertical: 'xsmall' },
        border: 'top',
        // verticalAlign: undefined,
        // background: undefined,
        // extend: undefined,
      },
    },
    tag: {
      // background: undefined,
      border: true,
      round: 'large',
      // name: undefined,
      pad: {
        horizontal: 'small',
        vertical: 'xsmall',
      },
      remove: {
        margin: { right: 'xsmall' },
        // kind: undefined,
      },
      separator: ' : ',
      size: {
        xsmall: {
          pad: { horizontal: `${baseSpacing / 3}px`, vertical: 'xxsmall' },
          icon: { size: `${baseSpacing * 0.75}px` },
          // remove: {
          //   margin: undefined,
          //   size: undefined,
          // },
        },
        small: {
          pad: { horizontal: `${baseSpacing * 0.4}px`, vertical: 'xxsmall' },
          icon: { size: `${baseSpacing * 0.75}px` },
          // remove: {
          //   margin: undefined,
          //   size: undefined,
          // },
        },
        large: {
          pad: { horizontal: `${(baseSpacing / 3) * 2}px`, vertical: `xsmall` },
          icon: { size: `${baseSpacing * 1.25}px` },
          // remove: {
          //   margin: undefined,
          //   size: undefined,
          // },
        },
        xlarge: {
          pad: { horizontal: `${baseSpacing * 0.75}px`, vertical: 'xsmall' },
          icon: { size: `${baseSpacing * 1.5}px` },
          // remove: {
          //   margin: undefined,
          //   size: undefined,
          // },
        },
      },
      value: {
        weight: 600,
      },
      icons: {
        remove: FormClose,
      },
    },
    text: {
      font: {
        // family: undefined
      },
      xsmall: { ...fontSizing(-1.5) },
      small: { ...fontSizing(-1) },
      medium: { ...fontSizing(0) }, // 18px
      large: { ...fontSizing(1) }, // 22px
      xlarge: { ...fontSizing(2) },
      xxlarge: { ...fontSizing(4) },
      '2xl': { ...fontSizing(4) },
      '3xl': { ...fontSizing(6) },
      '4xl': { ...fontSizing(9) },
      '5xl': { ...fontSizing(13) },
      '6xl': { ...fontSizing(18) },
      skeleton: {
        width: { width: '100px', min: '100px' },
        margin: { vertical: 'xsmall' },
        colors: {
          dark: ['border', 'border'],
          light: ['background-front', 'background-back'],
        },
      },
    },
    textArea: {
      // extend: undefined,
      // disabled: { opacity: undefined },
    },
    textInput: {
      // extend: undefined,
      // disabled: { opacity: undefined },
    },
    tip: {
      content: {
        // any Box props
        background: 'background-contrast',
        elevation: 'small',
        margin: 'xsmall',
        pad: { vertical: 'xsmall', horizontal: 'small' },
        round: 'small',
      },
      drop: {
        // any props for the drop
        align: { top: 'bottom' }, // most common use case is Header with Buttons
        background: 'none',
        elevation: 'none',
        margin: 'none',
      },
    },
    toggleGroup: {
      button: {
        // border: {
        //   radius: undefined,
        // }
        // iconOnly: {
        //   pad: undefined,
        // },
        // kind: undefined,
        pad: {
          horizontal: '11px',
          vertical: '11px',
        },
      },
      container: {
        round: 'xsmall',
        border: true,
      },
      divider: {
        color: 'border',
      },
    },
    video: {
      captions: {
        background: 'rgba(0, 0, 0, 0.7)',
      },
      // controls: { background: undefined },
      icons: {
        closedCaption: ClosedCaption,
        configure: Actions,
        fullScreen: Expand,
        pause: Pause,
        play: Play,
        reduceVolume: VolumeLow,
        volume: Volume,
        description: AssistListening,
        // color: { dark: undefined, light: undefined },
      },
      scrubber: {
        color: 'light-4',
        interval: 10,
        // track: { color: undefined }
      },
    },
    worldMap: {
      color: 'light-3',
      continent: {
        active: '8px',
        base: '6px',
      },
      hover: {
        color: 'light-4',
      },
      place: {
        active: '20px',
        base: '8px',
      },
    },
  });

  return deepFreeze(result);
};

export const base = generate(24);
