import * as React from 'react';
import { BoxProps } from '../Box/index';

export interface View {
  name?: string;
  page?: number; // when paging
  properties?:
    | string[]
    | {
        [property: string]:
          | undefined
          | boolean
          | (string | number | boolean)[]
          | { max: number; min: number };
      };
  search?: string;
  sort?: {
    property: string;
    direction: 'asc' | 'desc';
  };
  step?: number; // page size
  columns?: string[];
}

export interface DataProps {
  id?: string;

  data: object[];
  total?: number;
  // when paging
  filteredTotal?: number;

  defaultView?: View;
  view?: string | View;
  onView?: (view: View) => void;

  // whether to render a Toolbar
  toolbar?: boolean | 'search' | 'filters' | 'view';

  properties?:
    | string[]
    | {
        [key: string]: {
          badge?: boolean;
          filter?: boolean;
          // for DataTable column header, DataFilter label, DataTableColumns label
          label?: string | React.ReactNode;
          // DataFilter options
          options?: (
            | string
            | number
            | {
                label: string;
                value: string | number | boolean;
              }
          )[];
          // DataFilter range
          range?: {
            max?: number;
            min?: number;
            step?: number;
          };
          // for internal filtering only, should searching evaluate this property
          search?: boolean;
          sort?: boolean;
        };
      };

  messages?: {
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
  };

  views?: View[];

  // Future selection
  // select: string[];
  // onSelect: (select: string[]) => void;

  // Future manage named views
  // onCreateView?: (view: View) =>  void;
  // onDeleteView?: (string) => void;
}

type divProps = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'onClick'
>;

export interface DataExtendedProps extends BoxProps, DataProps, divProps {}

declare const Data: React.FC<DataExtendedProps>;

export { Data };
