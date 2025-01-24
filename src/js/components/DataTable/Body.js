/* eslint-disable no-underscore-dangle */
import React, { forwardRef, memo, useEffect } from 'react';

import { useKeyboard, useForwardedRef } from '../../utils';
import { CheckBox } from '../CheckBox';
import { InfiniteScroll } from '../InfiniteScroll';
import { TableRow } from '../TableRow';
import { TableCell } from '../TableCell';
import { Keyboard } from '../Keyboard';
import { ExpanderCell } from './ExpanderCell';

import { Cell } from './Cell';
import { StyledDataTableBody, StyledDataTableRow } from './StyledDataTable';
import { datumValue, normalizeRowCellProps } from './buildState';
import { useThemeValue } from '../../utils/useThemeValue';

const Row = memo(
  ({
    cellProps,
    primaryValue,
    index,
    rowRef,
    size,
    active,
    onClickRow,
    datum,
    selected,
    onSelect,
    isDisabled,
    isSelected,
    rowDetails,
    isRowExpanded,
    setActive,
    setRowExpand,
    rowExpand,
    columns,
    pinnedOffset,
    primaryProperty,
    data,
    verticalAlign,
  }) => (
    <>
      <StyledDataTableRow
        ref={rowRef}
        size={size}
        active={active}
        aria-disabled={(onClickRow && isDisabled) || undefined}
        onClick={
          onClickRow
            ? (event) => {
                if (onClickRow && !isDisabled) {
                  if (typeof onClickRow === 'function') {
                    // extract from React's synthetic event pool
                    event.persist();
                    const adjustedEvent = event;
                    adjustedEvent.datum = datum;
                    adjustedEvent.index = index;
                    onClickRow(adjustedEvent);
                  } else if (onClickRow === 'select') {
                    if (isSelected) {
                      onSelect(
                        selected.filter((s) => s !== primaryValue),
                        datum,
                      );
                    } else onSelect([...selected, primaryValue], datum);
                  }
                }
              }
            : undefined
        }
        onMouseEnter={
          onClickRow && !isDisabled ? () => setActive(index) : undefined
        }
        onMouseLeave={onClickRow ? () => setActive(undefined) : undefined}
      >
        {(selected || onSelect) && (
          <Cell
            background={
              (isSelected && cellProps.selected.background) ||
              (pinnedOffset?._grommetDataTableSelect &&
                cellProps.pinned.background) ||
              cellProps.background
            }
            border={cellProps.pinned.border || cellProps.border}
            pinnedOffset={pinnedOffset?._grommetDataTableSelect}
            aria-disabled={isDisabled || !onSelect || undefined}
            column={{
              pin: Boolean(pinnedOffset?._grommetDataTableSelect),
              plain: 'noPad',
              size: 'auto',
              render: () => (
                <CheckBox
                  tabIndex={onClickRow === 'select' ? -1 : undefined}
                  a11yTitle={`${
                    isSelected ? 'unselect' : 'select'
                  } ${primaryValue}`}
                  checked={isSelected}
                  disabled={isDisabled || !onSelect}
                  onChange={() => {
                    if (isSelected) {
                      onSelect(
                        selected.filter((s) => s !== primaryValue),
                        datum,
                      );
                    } else onSelect([...selected, primaryValue], datum);
                  }}
                  pad={cellProps.pad}
                />
              ),
            }}
            verticalAlign={verticalAlign}
          />
        )}

        {rowDetails && (
          <ExpanderCell
            background={isSelected && cellProps.selected.background}
            context={isRowExpanded ? 'groupHeader' : 'body'}
            expanded={isRowExpanded}
            onToggle={() => {
              if (isRowExpanded) {
                setRowExpand(rowExpand.filter((s) => s !== index));
              } else {
                setRowExpand([...rowExpand, index]);
              }
            }}
            pad={cellProps.pad}
            primaryValue={primaryValue}
            verticalAlign={verticalAlign}
          />
        )}
        {columns.map((column) => (
          <Cell
            key={column.property}
            background={
              (isSelected && cellProps.selected.background) ||
              (column.pin && cellProps.pinned.background) ||
              cellProps.background
            }
            border={(column.pin && cellProps.pinned.border) || cellProps.border}
            context="body"
            column={column}
            datum={datum}
            isSelected={isSelected}
            pad={(column.pin && cellProps.pinned.pad) || cellProps.pad}
            pinnedOffset={pinnedOffset && pinnedOffset[column.property]}
            primaryProperty={primaryProperty}
            scope={
              column.primary || column.property === primaryProperty
                ? 'row'
                : undefined
            }
            verticalAlign={verticalAlign}
          />
        ))}
      </StyledDataTableRow>
      {rowDetails && isRowExpanded && (
        <StyledDataTableRow key={`${index.toString()}_expand`}>
          {(selected || onSelect) && <TableCell />}
          <TableCell colSpan={columns.length + 1}>
            {rowDetails(data[index])}
          </TableCell>
        </StyledDataTableRow>
      )}
    </>
  ),
);

const Body = forwardRef(
  (
    {
      cellProps: cellPropsProp,
      columns,
      data,
      disabled,
      onMore,
      replace,
      onClickRow,
      onSelect,
      pinnedOffset,
      primaryProperty,
      rowProps,
      selected,
      rowDetails,
      show,
      size,
      step,
      rowExpand,
      setRowExpand,
      verticalAlign,
      ...rest
    },
    ref,
  ) => {
    const { theme, passThemeFlag } = useThemeValue();
    const [active, setActive] = React.useState();
    const [lastActive, setLastActive] = React.useState();
    const [scroll, setScroll] = React.useState();
    const containerRef = useForwardedRef(ref);

    // Determine if using a keyboard to cover focus behavior
    const usingKeyboard = useKeyboard();

    const onFocusActive =
      active ?? lastActive ?? (usingKeyboard && onClickRow ? 0 : undefined);

    const activePrimaryValue =
      active >= 0 ? datumValue(data[active], primaryProperty) : undefined;

    const selectRow = () => {
      if (activePrimaryValue !== undefined) {
        if (selected && selected.includes(activePrimaryValue)) {
          onSelect(selected.filter((s) => s !== activePrimaryValue));
        } else onSelect([...selected, activePrimaryValue]);
      }
    };

    const clickableRow =
      onClickRow &&
      active >= 0 &&
      (!disabled ||
        (activePrimaryValue !== undefined &&
          !disabled.includes(activePrimaryValue)));

    // Determine if the DataTable body is scrollable
    useEffect(() => {
      if (containerRef.current) {
        const element = containerRef.current;
        if (element.scrollHeight > element.offsetHeight) {
          setScroll(true);
        }
      }
    }, [containerRef]);

    return (
      <Keyboard
        onEnter={
          clickableRow
            ? (event) => {
                if (clickableRow) {
                  if (typeof onClickRow === 'function') {
                    event.persist();
                    const adjustedEvent = event;
                    adjustedEvent.datum = data[active];
                    onClickRow(adjustedEvent);
                  } else if (onClickRow === 'select') {
                    selectRow();
                  }
                }
              }
            : undefined
        }
        // The WCAG recommendation for checkboxes is to select them with "Space"
        onSpace={
          clickableRow
            ? (event) => {
                event.preventDefault();

                if (typeof onClickRow === 'function') {
                  event.persist();
                  const adjustedEvent = event;
                  adjustedEvent.datum = data?.[active];
                  onClickRow(adjustedEvent);
                } else if (onClickRow === 'select') {
                  selectRow();
                }
              }
            : undefined
        }
        onUp={onClickRow && active ? () => setActive(active - 1) : undefined}
        onDown={
          onClickRow && data.length && active < data.length - 1
            ? () => setActive((active ?? -1) + 1)
            : undefined
        }
      >
        <StyledDataTableBody
          ref={containerRef}
          size={size}
          tabIndex={onClickRow || scroll ? 0 : undefined}
          onFocus={() => setActive(onFocusActive)}
          onBlur={() => {
            setLastActive(active);
            setActive(undefined);
          }}
          {...passThemeFlag}
          {...rest}
        >
          <InfiniteScroll
            items={data}
            onMore={onMore}
            replace={replace}
            renderMarker={(marker) => (
              <TableRow>
                <TableCell>{marker}</TableCell>
              </TableRow>
            )}
            show={show}
            step={step}
          >
            {(datum, index, rowRef) => {
              const primaryValue = primaryProperty
                ? datumValue(datum, primaryProperty)
                : undefined;
              const isSelected = selected && selected.includes(primaryValue);
              const isDisabled = disabled && disabled.includes(primaryValue);
              const isRowExpanded = rowExpand && rowExpand.includes(index);
              const cellProps = normalizeRowCellProps(
                rowProps,
                cellPropsProp,
                primaryValue,
                index,
              );
              return (
                <Row
                  key={primaryValue ?? index}
                  setActive={setActive}
                  rowRef={rowRef}
                  cellProps={cellProps}
                  primaryValue={primaryValue}
                  isDisabled={isDisabled}
                  isSelected={isSelected}
                  isRowExpanded={isRowExpanded}
                  index={index}
                  size={size}
                  active={active >= 0 ? active === index : undefined}
                  onClickRow={onClickRow}
                  datum={datum}
                  selected={selected}
                  onSelect={onSelect}
                  rowDetails={rowDetails}
                  setRowExpand={setRowExpand}
                  rowExpand={rowExpand}
                  columns={columns}
                  primaryProperty={primaryProperty}
                  rowProps={rowProps}
                  data={data}
                  theme={theme}
                  pinnedOffset={pinnedOffset}
                  verticalAlign={verticalAlign}
                />
              );
            }}
          </InfiniteScroll>
        </StyledDataTableBody>
      </Keyboard>
    );
  },
);

export { Body };
