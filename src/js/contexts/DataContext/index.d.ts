import React from 'react';
import { View } from '../../components/Data';

interface DataContextType {
  data: any[];
  addToolbarKey: (key: string) => void;
  id: string;
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
  filtersCleared: boolean;
  onView?: (view: View) => void;
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
  result: { [key: string]: any };
  selected: any[];
  toolbarKeys: string[];
  view?: string | View;
  views: View[];
}

export const DataContext: React.Context<DataContextType>;
