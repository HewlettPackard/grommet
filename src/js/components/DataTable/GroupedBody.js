import React, { forwardRef, useMemo } from 'react';

import { Cell } from './Cell';
import { ExpanderCell } from './ExpanderCell';
import { StyledDataTableBody, StyledDataTableRow } from './StyledDataTable';
import { CheckBox } from '../CheckBox/CheckBox';
import { InfiniteScroll } from '../InfiniteScroll';
import { TableRow } from '../TableRow';
import { TableCell } from '../TableCell';
import { datumValue, normalizeRowCellProps } from './buildState';
import { useThemeValue } from '../../utils/useThemeValue';

export const GroupedBody = forwardRef(
  (
    {
      cellProps: cellPropsProp,
      columns,
      data,
      disabled,
      groupBy,
      groups,
      groupState,
      pinnedOffset,
      primaryProperty,
      onMore,
      onSelect,
      onToggle,
      onUpdate,
      replace,
      rowProps,
      selected,
      size,
      step,
      verticalAlign,
      ...rest
    },
    ref,
  ) => {
    const { passThemeFlag } = useThemeValue();
    const items = useMemo(() => {
      const nextItems = [];
      groups.forEach((group) => {
        const { expanded } = groupState[group.key] || { expanded: true };
        const memberCount = group.data.length;
        let groupSelected = [];
        let isGroupSelected = false;
        let groupDisabled = [];
        let isGroupDisabled = false;

        if (memberCount > 1 || (onUpdate && group.key !== undefined)) {
          // need a header
          const primaryKeys = group.data.map((datum) => datum[primaryProperty]);

          groupSelected =
            primaryKeys && selected
              ? primaryKeys.filter((val) => selected.includes(val))
              : [];

          isGroupSelected = groupBy.select
            ? groupBy.select[group.key] === 'all'
            : groupSelected.length === group.data.length &&
              groupSelected.length > 0;

          const indeterminate = groupBy.select
            ? groupBy.select[group.key] === 'some'
            : groupSelected.length > 0 &&
              groupSelected.length < group.data.length;

          groupDisabled =
            primaryKeys && disabled
              ? primaryKeys.filter((val) => disabled.includes(val))
              : [];

          isGroupDisabled = groupBy.disable
            ? groupBy.disable[group.key] === 'all'
            : groupDisabled.length === group.data.length &&
              groupDisabled.length > 0;

          nextItems.push({
            expanded,
            key: group.key,
            primaryValue: group.key,
            datum: group.datum,
            context: 'groupHeader',
            isDisabled: isGroupDisabled,
            isSelected: isGroupSelected,
            indeterminate,
            onChange: () => {
              const nextSelected =
                isGroupSelected || indeterminate
                  ? selected.filter((s) => !groupSelected.includes(s))
                  : [...selected, ...primaryKeys];
              if (groupBy.onSelect) {
                groupBy.onSelect(nextSelected, group.datum, groupBy.select);
              } else {
                onSelect(nextSelected, group.datum);
              }
            },
          });
        }
        if ((!onUpdate && memberCount === 1) || expanded) {
          // add the group members
          group.data.forEach((datum, index) => {
            const primaryValue = primaryProperty
              ? datumValue(datum, primaryProperty)
              : undefined;
            const isSelected = selected?.includes(primaryValue);
            const isDisabled = disabled?.includes(primaryValue);
            nextItems.push({
              key: datum[primaryProperty],
              primaryValue: primaryProperty
                ? datumValue(datum, primaryProperty)
                : undefined,
              datum,
              context:
                memberCount > 1 && index === memberCount - 1
                  ? 'groupEnd'
                  : 'body',
              isDisabled,
              isSelected,
              onChange: () => {
                const nextSelected = isSelected
                  ? selected.filter((s) => s !== primaryValue)
                  : [...selected, primaryValue];
                onSelect(nextSelected, datum);
              },
            });
          });
        }
      });
      return nextItems;
    }, [
      disabled,
      groups,
      groupBy,
      groupState,
      primaryProperty,
      selected,
      onSelect,
      onUpdate,
    ]);

    return (
      <StyledDataTableBody ref={ref} size={size} {...passThemeFlag} {...rest}>
        <InfiniteScroll
          items={items}
          onMore={onMore}
          replace={replace}
          renderMarker={(marker) => (
            <TableRow>
              <TableCell>{marker}</TableCell>
            </TableRow>
          )}
          step={step}
        >
          {(row, index, rowRef) => {
            const {
              context,
              datum,
              expanded,
              indeterminate,
              isDisabled,
              isSelected,
              key,
              onChange,
              primaryValue,
            } = row;
            const cellProps = normalizeRowCellProps(
              rowProps,
              context === 'groupHeader'
                ? cellPropsProp.groupHeader
                : cellPropsProp.body,
              primaryValue,
              index,
            );

            return (
              <StyledDataTableRow ref={rowRef} key={key} size={size}>
                <ExpanderCell
                  background={
                    (isSelected && cellProps.selected.background) ||
                    cellProps.background
                  }
                  border={cellProps.border}
                  context={context}
                  pad={cellProps.pad}
                  onToggle={
                    context === 'groupHeader' ? onToggle(key) : undefined
                  }
                  expanded={expanded}
                  primaryValue={context === 'groupHeader' ? key : primaryValue}
                  verticalAlign={verticalAlign}
                />
                {(selected || onSelect) && (
                  <TableCell
                    background={
                      (isSelected && cellProps.selected.background) ||
                      cellProps.background
                    }
                    border={cellProps.pinned.border || cellProps.border}
                    plain="noPad"
                    size="auto"
                    verticalAlign={verticalAlign}
                    aria-disabled={isDisabled || !onSelect || undefined}
                  >
                    <CheckBox
                      a11yTitle={`${isSelected ? 'unselect' : 'select'} ${
                        context === 'groupHeader' ? key : primaryValue
                      }`}
                      checked={isSelected}
                      indeterminate={indeterminate}
                      disabled={isDisabled || !onSelect}
                      onChange={onChange}
                      pad={cellProps.pad}
                    />
                  </TableCell>
                )}
                {columns.map((column) => {
                  let scope;
                  if (context === 'groupHeader') {
                    scope =
                      column.property === groupBy.property ? 'row' : undefined;
                  } else {
                    scope = column.primary ? 'row' : undefined;
                  }
                  return (
                    <Cell
                      key={column.property}
                      background={
                        (isSelected && cellProps.selected.background) ||
                        cellProps.background
                      }
                      border={cellProps.border}
                      context={context}
                      column={column}
                      datum={datum}
                      pad={cellProps.pad}
                      scope={scope}
                      pinnedOffset={
                        context === 'groupHeader' &&
                        pinnedOffset &&
                        pinnedOffset[column.property]
                      }
                      verticalAlign={verticalAlign}
                    />
                  );
                })}
              </StyledDataTableRow>
            );
          }}
        </InfiniteScroll>
      </StyledDataTableBody>
    );
  },
);
