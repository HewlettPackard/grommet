import React, {
  Fragment,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { AnnounceContext } from '../../contexts/AnnounceContext';
import { MessageContext } from '../../contexts/MessageContext';
import { Box } from '../Box';
import { Drop } from '../Drop';
import { Grid } from '../Grid';
import { Keyboard } from '../Keyboard';
import { Text } from '../Text';
import { focusStyle, parseMetricToNum, unfocusStyle } from '../../utils';
import { Swatch } from './Swatch';
import { useThemeValue } from '../../utils/useThemeValue';

const DetailControl = styled(Box)`
  &:focus {
    ${focusStyle()}
  }
  &:focus:not(:focus-visible) {
    ${unfocusStyle()}
  }
`;

const Detail = ({
  activeProperty,
  axis,
  data,
  horizontal: horizontalProp,
  pad: padProp,
  series,
  seriesStyles,
  renderValue,
  thickness,
}) => {
  const announce = useContext(AnnounceContext);
  const { format } = useContext(MessageContext);
  const { theme } = useThemeValue();
  const [detailIndex, setDetailIndex] = useState();
  const activeIndex = useRef();
  const detailRefs = useMemo(() => [], []);

  const pad = useMemo(() => {
    // ensure the hit targets and center lines align with
    // the data/guide lines
    let horizontal =
      padProp?.horizontal || (typeof padProp === 'string' && padProp) || 0;
    horizontal = theme.global.edgeSize[horizontal] || horizontal;
    horizontal = parseMetricToNum(horizontal);
    let vertical =
      padProp?.vertical || (typeof padProp === 'string' && padProp) || 0;
    vertical = theme.global.edgeSize[vertical] || vertical;
    vertical = parseMetricToNum(vertical);
    return {
      horizontal: `${horizontal - parseMetricToNum(thickness) / 2}px`,
      vertical: `${vertical}px`,
    };
  }, [padProp, theme.global.edgeSize, thickness]);

  const onMouseLeave = useCallback((event) => {
    // Only remove detail if the mouse isn't over the active index.
    // This helps distinguish leaving the drop on the edge where it is
    // anchored.
    const rect = activeIndex.current.getBoundingClientRect();
    if (
      event.pageX < rect.left ||
      event.pageX > rect.right ||
      event.pageY < rect.top ||
      event.pageY > rect.bottom
    ) {
      activeIndex.current = undefined;
      setDetailIndex(undefined);
    }
  }, []);

  const dropAlign = useMemo(() => {
    let res;
    if (detailIndex > data.length / 2) {
      if (horizontalProp) res = { bottom: 'top' };
      else res = { right: 'left' };
    } else if (horizontalProp) res = { top: 'bottom' };
    else res = { left: 'right' };

    return res;
  }, [data.length, detailIndex, horizontalProp]);

  const getContent = useCallback(
    (index) => {
      if (index !== undefined) {
        return series
          .filter(
            ({ property }) =>
              ((!activeProperty || activeProperty === property) &&
                data?.[index]?.[property] !== undefined) ||
              (axis && axis.x && axis.x.property === property),
          )
          .map((serie) => {
            const axisValue = horizontalProp
              ? data[index][serie.property]
              : index;
            return `${serie.label || serie.property} ${renderValue(
              serie,
              axisValue,
            )}.`;
          })
          .join(' ');
      }
      return undefined;
    },
    [activeProperty, axis, data, horizontalProp, renderValue, series],
  );

  return (
    <>
      <Keyboard
        onLeft={(event) => {
          event.preventDefault();
          if (detailIndex === undefined) {
            setDetailIndex(data.length - 1);
            announce(getContent(data.length - 1), 'assertive');
          } else if (detailIndex > 0) {
            setDetailIndex(detailIndex - 1);
            announce(getContent(detailIndex - 1), 'assertive');
          }
        }}
        onRight={(event) => {
          event.preventDefault();
          if (detailIndex === undefined) {
            setDetailIndex(0);
            announce(getContent(0), 'assertive');
          } else if (detailIndex < data.length - 1) {
            setDetailIndex(detailIndex + 1);
            announce(getContent(detailIndex + 1), 'assertive');
          }
        }}
      >
        <DetailControl
          key="band"
          fill
          role="list"
          tabIndex={0}
          aria-label={format({ id: 'dataChart.detailTitle' })}
          justify="between"
          responsive={false}
          {...(horizontalProp
            ? {
                direction: 'column',
              }
            : {
                direction: 'row',
                pad,
              })}
          onFocus={() => {
            announce(format({ id: 'dataChart.detailFocus' }));
          }}
          onBlur={() => setDetailIndex(undefined)}
        >
          {data.map((_, i) => {
            const ref = (c) => {
              detailRefs[i] = c;
            };

            return (
              <Box
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                role="listitem"
                responsive={false}
                {...(horizontalProp
                  ? {
                      justify: 'center',
                      height: thickness,
                    }
                  : {
                      align: 'center',
                      width: thickness,
                    })}
                onMouseOver={(event) => {
                  activeIndex.current = event.currentTarget;
                  setDetailIndex(i);
                  announce(getContent(i), 'assertive');
                }}
                onMouseLeave={onMouseLeave}
                onFocus={() => {}}
                onBlur={() => {}}
              >
                <Box
                  role="img"
                  aria-label={getContent(i)}
                  // for horizontal, ref will be placed on child box so
                  // drop is restricted to drop dimensions as opposed
                  // to filling the chart width
                  {...(horizontalProp
                    ? {
                        fill: 'horizontal',
                      }
                    : {
                        ref,
                        fill: 'vertical',
                      })}
                  border={detailIndex === i ? true : undefined}
                >
                  {horizontalProp ? <Box alignSelf="center" ref={ref} /> : null}
                </Box>
              </Box>
            );
          })}
        </DetailControl>
      </Keyboard>
      {detailIndex !== undefined && detailRefs[detailIndex] && (
        <Drop
          key="drop"
          target={detailRefs[detailIndex]}
          align={dropAlign}
          plain
          onMouseLeave={onMouseLeave}
          trapFocus={false}
        >
          <Box pad="small" background={{ color: 'background-back' }}>
            <Grid
              columns={['auto', 'auto', 'auto']}
              gap="xsmall"
              align="center"
            >
              {series
                .filter(
                  ({ property }) =>
                    ((!activeProperty || activeProperty === property) &&
                      data?.[detailIndex]?.[property] !== undefined) ||
                    (axis && axis.x && axis.x.property === property),
                )
                .map((serie) => {
                  const propertyStyle = seriesStyles[serie.property];
                  const axisValue = horizontalProp
                    ? data[detailIndex][serie.property]
                    : detailIndex;
                  return (
                    <Fragment key={serie.property}>
                      {propertyStyle ? <Swatch {...propertyStyle} /> : <span />}
                      <Text size="small">{serie.label || serie.property}</Text>
                      <Text size="small" weight="bold">
                        {renderValue(serie, axisValue)}
                      </Text>
                    </Fragment>
                  );
                })}
            </Grid>
          </Box>
        </Drop>
      )}
    </>
  );
};

export { Detail };
