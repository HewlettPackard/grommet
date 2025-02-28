import React, { forwardRef, useContext, useMemo } from 'react';
import { Grid } from '../Grid';
import { ResponsiveContext } from '../../contexts/ResponsiveContext';
import { NameValueListContext } from './NameValueListContext';
import { isSmall } from '../../utils/responsive';
import { useThemeValue } from '../../utils/useThemeValue';

const NameValueList = forwardRef(
  (
    {
      align,
      layout = 'column',
      nameProps,
      pairProps = { direction: 'row' },
      valueProps,
      ...rest
    },
    ref,
  ) => {
    const size = useContext(ResponsiveContext);
    const { theme } = useThemeValue();

    // If layout is grid, valueWidth sets the max width of the column.
    // Grid will 'fit' as many columns of valueWidth per row as container's
    // width allows.
    let columns;
    let valueWidth = valueProps?.width || theme.nameValueList.value.width;
    let nameWidth = nameProps?.width || theme.nameValueList.name.width;
    const formatWidth = (width) =>
      typeof width === 'object' ? [width.min, width.max] : width;

    nameWidth = formatWidth(nameWidth);
    valueWidth = formatWidth(valueWidth);

    if (isSmall(size) || layout === 'grid')
      columns = {
        count: 'fit',
        size: !Array.isArray(valueWidth) ? ['auto', valueWidth] : valueWidth,
      };
    else if (layout === 'column' && pairProps.direction === 'row')
      columns = [
        nameWidth,
        !Array.isArray(valueWidth) ? ['auto', valueWidth] : valueWidth,
      ];
    else columns = [valueWidth];

    let { gap } = theme.nameValueList;
    if (
      (pairProps.direction === 'column' || isSmall(size)) &&
      theme.nameValueList.pair?.column?.gap
    ) {
      gap = theme.nameValueList.pair.column.gap;
    }

    const listContextValue = useMemo(
      () => ({ nameProps, pairProps, valueProps }),
      [nameProps, pairProps, valueProps],
    );

    return (
      <NameValueListContext.Provider value={listContextValue}>
        <Grid
          as="dl"
          ref={ref}
          align={align}
          columns={columns}
          gap={gap}
          margin="none" // override browser default margin for dl
          {...rest}
        />
      </NameValueListContext.Provider>
    );
  },
);

NameValueList.displayName = 'NameValueList';

export { NameValueList };
