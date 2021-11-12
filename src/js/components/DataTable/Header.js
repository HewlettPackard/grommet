/* eslint-disable no-underscore-dangle */
import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import styled, { css, ThemeContext } from 'styled-components';

import { defaultProps } from '../../default-props';

import { Box } from '../Box';
import { Button } from '../Button';
import { CheckBox } from '../CheckBox';
import { TableCell } from '../TableCell';
import { Text } from '../Text';

import { Resizer } from './Resizer';
import { Searcher } from './Searcher';
import { ExpanderCell } from './ExpanderCell';
import {
  StyledDataTableCell,
  StyledDataTableHeader,
  StyledDataTableRow,
} from './StyledDataTable';
import { datumValue } from './buildState';
import { kindPartStyles } from '../../utils/styles';
import { normalizeColor } from '../../utils/colors';

// separate theme values into groupings depending on what
// part of header cell they should style
const separateThemeProps = (theme) => {
  const {
    background, // covered by cellProps
    border, // covered by cellProps
    color,
    font,
    gap, // gap is used for space between header cell elements only
    pad, // covered by cellProps
    units,
    ...rest
  } = theme.dataTable.header;

  const textProps = { color, ...font };
  const iconProps = { color };
  const layoutProps = { ...rest };

  return [layoutProps, textProps, iconProps];
};

// build up CSS from basic to specific based on the supplied sub-object paths.
// adapted from StyledButtonKind to only include parts relevant for DataTable
const buttonStyle = ({ pad, theme }) => {
  const styles = [];
  const [layoutProps, , iconProps] = separateThemeProps(theme);

  // if cell is sortable, we want pad to be applied
  // to the button instead of the cell
  if (pad) {
    styles.push(kindPartStyles({ pad }, theme));
  }

  if (layoutProps) {
    styles.push(kindPartStyles(layoutProps, theme));
  }

  if (layoutProps.hover) {
    // CSS for this sub-object in the theme
    const partStyles = kindPartStyles(layoutProps.hover, theme);
    if (partStyles.length > 0)
      styles.push(
        css`
          &:hover {
            ${partStyles}
          }
        `,
      );
  }

  if (iconProps.color) {
    styles.push(
      css`
        svg {
          stroke: ${normalizeColor(iconProps.color, theme)};
          fill: ${normalizeColor(iconProps.color, theme)};
        }
      `,
    );
  }

  return styles;
};

const StyledHeaderCellButton = styled(Button)`
  ${(props) => buttonStyle(props)}
`;

// allow extend to spread onto Box that surrounds column label
const StyledContentBox = styled(Box)`
  ${(props) => props.extend}
`;

const Header = forwardRef(
  (
    {
      cellProps,
      columns,
      data,
      fill,
      filtering,
      filters,
      groupBy,
      groups,
      groupState,
      onFilter,
      onFiltering,
      onResize,
      onSelect,
      onSort,
      onToggle,
      onWidths,
      pin: pinProp,
      pinnedOffset,
      primaryProperty,
      selected,
      rowDetails,
      sort,
      widths,
      ...rest
    },
    ref,
  ) => {
    const theme = useContext(ThemeContext) || defaultProps.theme;
    const [layoutProps, textProps] = separateThemeProps(theme);

    const [cellWidths, setCellWidths] = useState([]);

    const updateWidths = useCallback(
      (width) => setCellWidths((values) => [...values, width]),
      [],
    );

    useEffect(() => {
      if (onWidths && cellWidths.length !== 0) {
        onWidths(cellWidths);
      }
    }, [cellWidths, onWidths]);

    const pin = pinProp ? ['top'] : [];
    const selectPin = pinnedOffset?._grommetDataTableSelect
      ? [...pin, 'left']
      : pin;

    const totalSelectedGroups = groupBy?.select ?
      Object.keys(groupBy.select).reduce((total, cur) =>
        cur && groupBy.select[cur] === 'all' ? total + 1 : total,
      0) : 0;
    const totalSelected = (selected?.length || 0) + totalSelectedGroups;

    return (
      <StyledDataTableHeader ref={ref} fillProp={fill} {...rest}>
        <StyledDataTableRow>
          {groups && (
            <ExpanderCell
              background={cellProps.background}
              border={cellProps.border}
              context="header"
              expanded={
                Object.keys(groupState).filter((k) => !groupState[k].expanded)
                  .length === 0
              }
              onToggle={onToggle}
              pad={cellProps.pad}
            />
          )}

          {(selected || onSelect) && (
            <StyledDataTableCell
              background={cellProps.background}
              onWidth={updateWidths}
              plain="noPad"
              size="auto"
              context="header"
              scope="col"
              pin={selectPin}
              pinnedOffset={pinnedOffset?._grommetDataTableSelect}
            >
              {onSelect && (
                <CheckBox
                  a11yTitle={
                    totalSelected === data.length
                      ? 'unselect all'
                      : 'select all'
                  }
                  checked={
                    groupBy?.select ?
                      groupBy.select[''] === 'all' :
                      totalSelected > 0 &&
                      data.length > 0 &&
                      totalSelected === data.length
                  }
                  indeterminate={
                    groupBy?.select ?
                      groupBy.select[''] === 'some' :
                      totalSelected > 0 && totalSelected < data.length
                  }
                  onChange={() => {
                    let nextSelected;
                    const nextGroupSelected = {};
                    const allSelected = groupBy?.select ?
                      groupBy.select[''] === 'all' :
                      totalSelected === data.length;
                  
                    // if all are selected, clear selection
                    if (allSelected) {
                      nextSelected = [];
                      nextGroupSelected[''] = 'none';
                    } else {
                      // if some or none are selected, select all data
                      nextSelected = 
                        data.map((datum) => datumValue(datum, primaryProperty));
                      nextGroupSelected[''] = 'all';
                      groupBy?.expandable?.forEach(key => {
                        nextGroupSelected[key] = 'all';
                      });
                    }
                    if (groupBy.onSelect) {
                      groupBy.onSelect(
                        nextSelected,
                        undefined,
                        nextGroupSelected,
                      );
                    }
                    else onSelect(nextSelected);
                  }}
                  pad={cellProps.pad}
                />
              )}
            </StyledDataTableCell>
          )}
          {rowDetails && <TableCell size="xxsmall" plain pad="none" />}
          {columns.map(
            ({
              property,
              header,
              align,
              pin: columnPin,
              search,
              sortable,
              verticalAlign,
              size,
              units,
            }) => {
              let content;
              const unitsContent = units ? (
                <Text {...textProps} {...theme.dataTable.header.units}>
                  {units}
                </Text>
              ) : undefined;
              if (typeof header === 'string') {
                content = <Text {...textProps}>{header}</Text>;
                if (
                  Object.keys(layoutProps).length &&
                  (sortable === false || !onSort)
                ) {
                  // apply rest of layout styling if cell is not sortable,
                  // otherwise this styling will be applied by
                  // StyledHeaderCellButton
                  content = (
                    <StyledContentBox {...layoutProps}>
                      {content}
                    </StyledContentBox>
                  );
                }
              } else content = header;

              if (onSort && sortable !== false) {
                let Icon;
                if (onSort && sortable !== false) {
                  if (sort && sort.property === property) {
                    Icon =
                      theme.dataTable.icons[
                        sort.direction !== 'asc' ? 'ascending' : 'descending'
                      ];
                  } else if (theme.dataTable.icons.sortable) {
                    Icon = theme.dataTable.icons.sortable;
                  }
                }

                content = (
                  <StyledHeaderCellButton
                    plain
                    column={property}
                    fill="vertical"
                    onClick={onSort(property)}
                    sort={sort}
                    pad={cellProps.pad}
                    sortable
                  >
                    <Box
                      direction="row"
                      align="center"
                      gap="xsmall"
                      justify={align}
                    >
                      {content}
                      {Icon && <Icon />}
                    </Box>
                  </StyledHeaderCellButton>
                );
              }

              if (unitsContent) {
                content = (
                  <Box align="baseline" direction="row">
                    {content}
                    {unitsContent}
                  </Box>
                );
              }
              // content should fill any available space in cell
              content = <Box flex="grow">{content}</Box>;

              if (search || onResize) {
                const resizer = onResize ? (
                  <Resizer property={property} onResize={onResize} />
                ) : null;
                const searcher =
                  search && filters ? (
                    <Searcher
                      filtering={filtering}
                      filters={filters}
                      property={property}
                      onFilter={onFilter}
                      onFiltering={onFiltering}
                    />
                  ) : null;
                content = (
                  <Box
                    direction="row"
                    align="center"
                    justify={!align || align === 'start' ? 'between' : align}
                    gap={theme.dataTable.header.gap}
                    fill="vertical"
                    style={onResize ? { position: 'relative' } : undefined}
                  >
                    {content}
                    {searcher && resizer ? (
                      <Box
                        flex="shrink"
                        direction="row"
                        align="center"
                        gap={theme.dataTable.header.gap}
                      >
                        {searcher}
                        {resizer}
                      </Box>
                    ) : (
                      searcher || resizer
                    )}
                  </Box>
                );
              }
              const cellPin = [...pin];
              if (columnPin) cellPin.push('left');

              return (
                <StyledDataTableCell
                  key={property}
                  align={align}
                  context="header"
                  verticalAlign={verticalAlign}
                  background={cellProps.background}
                  border={cellProps.border}
                  onWidth={updateWidths}
                  // if sortable, pad will be included in the button styling
                  pad={sortable === false || !onSort ? cellProps.pad : 'none'}
                  pin={cellPin}
                  plain
                  pinnedOffset={pinnedOffset && pinnedOffset[property]}
                  scope="col"
                  size={widths && widths[property] ? undefined : size}
                  style={
                    widths && widths[property]
                      ? { width: widths[property] }
                      : undefined
                  }
                >
                  {content}
                </StyledDataTableCell>
              );
            },
          )}
        </StyledDataTableRow>
      </StyledDataTableHeader>
    );
  },
);

Header.displayName = 'Header';

Header.defaultProps = {};
Object.setPrototypeOf(Header.defaultProps, defaultProps);

export { Header };
