import React, {
  Fragment,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ThemeContext } from 'styled-components';

import { defaultProps } from '../../default-props';
import { normalizeColor, parseMetricToNum, useForwardedRef } from '../../utils';

import { StyledDiagram } from './StyledDiagram';
import { DiagramPropTypes } from './propTypes';

const computeMidPoint = (fromPoint, toPoint) => [
  fromPoint[0] > toPoint[0]
    ? toPoint[0] + (fromPoint[0] - toPoint[0]) / 2
    : fromPoint[0] + (toPoint[0] - fromPoint[0]) / 2,
  fromPoint[1] > toPoint[1]
    ? toPoint[1] + (fromPoint[1] - toPoint[1]) / 2
    : fromPoint[1] + (toPoint[1] - fromPoint[1]) / 2,
];

const COMMANDS = {
  curved: (fromPoint, toPoint, offset, anchor) => {
    const midPoint = computeMidPoint(fromPoint, toPoint);
    let cmds = `M ${fromPoint[0] + offset},${fromPoint[1] + offset} `;
    if (anchor === 'horizontal') {
      cmds +=
        `Q ${midPoint[0] + offset},${fromPoint[1] + offset} ` +
        `${midPoint[0] + offset},${midPoint[1] + offset} `;
    } else {
      cmds +=
        `Q ${fromPoint[0] + offset},${midPoint[1] + offset} ` +
        `${midPoint[0] + offset},${midPoint[1] + offset} `;
    }
    cmds += `T ${toPoint[0] + offset},${toPoint[1] + offset}`;
    return cmds;
  },
  direct: (fromPoint, toPoint, offset) =>
    `M ${fromPoint[0] + offset},${fromPoint[1] + offset} ` +
    `L ${toPoint[0] + offset},${toPoint[1] + offset}`,
  rectilinear: (fromPoint, toPoint, offset, anchor) => {
    const midPoint = computeMidPoint(fromPoint, toPoint);
    let cmds = `M ${fromPoint[0] + offset},${fromPoint[1] + offset} `;
    if (anchor === 'horizontal') {
      cmds +=
        `L ${midPoint[0] + offset},${fromPoint[1] + offset} ` +
        `L ${midPoint[0] + offset},${toPoint[1] + offset} `;
    } else {
      cmds +=
        `L ${fromPoint[0] + offset},${midPoint[1] + offset} ` +
        `L ${toPoint[0] + offset},${midPoint[1] + offset} `;
    }
    cmds += `L ${toPoint[0] + offset},${toPoint[1] + offset}`;
    return cmds;
  },
};

const findTarget = (target) => {
  if (typeof target === 'string') {
    return document.getElementById(target);
  }
  return target;
};

const openArrow = (color, id, orient = 'auto') => (
  <marker
    id={id}
    markerWidth="7"
    markerHeight="9"
    refX="2"
    refY="6"
    orient={orient}
  >
    <path d="M1,4 L3,6 L1,8" stroke={color} fill="none" />
  </marker>
);

const Diagram = forwardRef(({ connections, ...rest }, ref) => {
  const theme = useContext(ThemeContext) || defaultProps.theme;
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [connectionPoints, setConnectionPoints] = useState();
  const svgRef = useForwardedRef(ref);

  useEffect(() => {
    setConnectionPoints(undefined);
  }, [connections]);

  const onResize = useCallback(() => {
    const svg = svgRef.current;

    if (svg) {
      const rect = svg.getBoundingClientRect();
      if (
        rect.width !== dimensions.width ||
        rect.height !== dimensions.height
      ) {
        setDimensions({
          width: rect.width,
          height: rect.height,
        });
        setConnectionPoints(undefined);
      }
    }
  }, [dimensions.width, dimensions.height, svgRef]);

  // Ref that stores resize handler
  const savedOnResize = useRef();

  // Update resize ref value if onResize changes.
  // This allows our effect below to always get latest handler
  useEffect(() => {
    savedOnResize.current = onResize;
  }, [onResize]);

  useEffect(() => {
    const onResizeHandler = (event) => savedOnResize.current(event);
    onResizeHandler();

    window.addEventListener('resize', onResizeHandler);

    return () => {
      window.removeEventListener('resize', onResizeHandler);
    };
  }, []);

  const placeConnections = useCallback(() => {
    const containerRect = svgRef.current.getBoundingClientRect();
    const updatedConnectionPoints = connections.map(
      ({ anchor, fromTarget, toTarget, endpoint }) => {
        let points;
        const fromElement = findTarget(fromTarget);
        const toElement = findTarget(toTarget);
        if (!fromElement) {
          console.warn(`Diagram cannot find ${fromTarget}`);
        }
        if (!toElement) {
          console.warn(`Diagram cannot find ${toTarget}`);
        }

        if (fromElement && toElement) {
          const fromRect = fromElement.getBoundingClientRect();
          const toRect = toElement.getBoundingClientRect();
          // There is no x and y when unit testing.
          const fromPoint = [
            fromRect.left - containerRect.left || 0,
            fromRect.top - containerRect.top || 0,
          ];
          const toPoint = [
            toRect.left - containerRect.left || 0,
            toRect.top - containerRect.top || 0,
          ];
          if (anchor === 'vertical') {
            fromPoint[0] += fromRect.width / 2;
            toPoint[0] += toRect.width / 2;
            if (fromRect.top < toRect.top) {
              fromPoint[1] += fromRect.height;

              // Here, we are +10 or -10 the length of the line based
              // on the anchor - vertical or horizontal, so that it
              // doesn't touch the start or end of the main digram closely.
              if (typeof endpoint === 'object' && endpoint?.from) {
                fromPoint[1] += 10;
              } else if (typeof endpoint === 'object' && endpoint?.to) {
                toPoint[1] -= 10;
              } else if (typeof endpoint === 'string') {
                fromPoint[1] += 10;
                toPoint[1] -= 10;
              }
            } else {
              toPoint[1] += toRect.height;

              if (typeof endpoint === 'object' && endpoint?.from) {
                fromPoint[1] -= 10;
              } else if (typeof endpoint === 'object' && endpoint?.to) {
                toPoint[1] += 10;
              } else if (typeof endpoint === 'string') {
                fromPoint[1] -= 10;
                toPoint[1] += 10;
              }
            }
          } else if (anchor === 'horizontal') {
            fromPoint[1] += fromRect.height / 2;
            toPoint[1] += toRect.height / 2;
            if (fromRect.left < toRect.left) {
              fromPoint[0] += fromRect.width;

              if (typeof endpoint === 'object' && endpoint?.from) {
                fromPoint[0] += 10;
              } else if (typeof endpoint === 'object' && endpoint?.to) {
                toPoint[0] -= 10;
              } else if (typeof endpoint === 'string') {
                fromPoint[0] += 10;
                toPoint[0] -= 10;
              }
            } else {
              toPoint[0] += toRect.width;

              if (typeof endpoint === 'object' && endpoint?.from) {
                fromPoint[0] -= 10;
              } else if (typeof endpoint === 'object' && endpoint?.to) {
                toPoint[0] += 10;
              } else if (typeof endpoint === 'string') {
                fromPoint[0] -= 10;
                toPoint[0] += 10;
              }
            }
          } else {
            // center
            fromPoint[0] += fromRect.width / 2;
            fromPoint[1] += fromRect.height / 2;
            toPoint[0] += toRect.width / 2;
            toPoint[1] += toRect.height / 2;
          }
          points = [fromPoint, toPoint];
        }

        return points;
      },
    );
    setConnectionPoints(updatedConnectionPoints);
  }, [connections, svgRef]);

  useEffect(() => {
    if (!connectionPoints) {
      placeConnections();
    }
  }, [connectionPoints, placeConnections]);

  let paths;
  const markerElements = [];
  if (connectionPoints) {
    // addedMarkerElmentIds - To track the marker elements are added
    // with their id's based on open and closed arrows and their
    // color. For eg:
    // There can be a open arrow with blue color -
    // __grommet__openArrowStart__blue__${fromTarget}
    // And there can be a closed arrow with pink color -
    // __grommet__openArrowEnd__pink__${toTarget}
    // So, instead of creating multiple arrows of the same color, we
    // will be leveraging one arrow based on open, close and it's color.
    const addedMarkerElmentIds = {};
    paths = connections.map(
      (
        {
          anchor,
          animation,
          color,
          offset,
          round,
          thickness,
          type,
          endpoint,
          ...connectionRest
        },
        index,
      ) => {
        let path;
        const cleanedRest = { ...connectionRest };
        delete cleanedRest.fromTarget;
        delete cleanedRest.toTarget;
        const points = connectionPoints[index];

        if (points) {
          const offsetWidth = offset
            ? parseMetricToNum(theme.global.edgeSize[offset])
            : 0;
          const d = COMMANDS[type || 'curved'](
            points[0],
            points[1],
            offsetWidth,
            anchor,
          );
          const strokeWidth = thickness
            ? parseMetricToNum(theme.global.edgeSize[thickness] || thickness)
            : 1;
          let colorName =
            color || (theme.diagram.line && theme.diagram.line.color);
          if (!colorName) {
            const colors = Object.keys(theme.global.colors).filter((n) =>
              n.match(/^graph-[0-9]$/),
            );
            colorName = colors[index % colors.length];
          }

          if (typeof endpoint === 'object' && endpoint?.from === 'arrow') {
            // eslint-disable-next-line max-len
            cleanedRest.markerStart = `url("#__grommet__openArrowStart__${normalizeColor(
              colorName,
              theme,
            )}__${connectionRest.fromTarget}")`;

            if (
              !addedMarkerElmentIds[
                /* eslint-disable max-len */
                `__grommet__openArrowStart__${normalizeColor(
                  colorName,
                  theme,
                )}__${connectionRest.fromTarget}`
              ]
            ) {
              addedMarkerElmentIds[
                /* eslint-disable max-len */
                `__grommet__openArrowStart__${normalizeColor(
                  colorName,
                  theme,
                )}__${connectionRest.fromTarget}`
              ] = true;
              markerElements.push(
                openArrow(
                  normalizeColor(colorName, theme),
                  `__grommet__openArrowStart__${normalizeColor(
                    colorName,
                    theme,
                  )}__${connectionRest.fromTarget}`,
                  'auto-start-reverse',
                ),
              );
            }
          } else if (typeof endpoint === 'object' && endpoint?.to === 'arrow') {
            // eslint-disable-next-line max-len
            cleanedRest.markerEnd = `url("#__grommet__openArrowEnd__${normalizeColor(
              colorName,
              theme,
            )}__${connectionRest.toTarget}")`;

            if (
              !addedMarkerElmentIds[
                /* eslint-disable max-len */
                `__grommet__openArrowEnd__${normalizeColor(
                  colorName,
                  theme,
                )}__${connectionRest.toTarget}`
              ]
            ) {
              addedMarkerElmentIds[
                /* eslint-disable max-len */
                `__grommet__openArrowEnd__${normalizeColor(
                  colorName,
                  theme,
                )}__${connectionRest.toTarget}`
              ] = true;
              markerElements.push(
                openArrow(
                  normalizeColor(colorName, theme),
                  `__grommet__openArrowEnd__${normalizeColor(
                    colorName,
                    theme,
                  )}__${connectionRest.toTarget}`,
                ),
              );
            }
          } else if (typeof endpoint === 'string' && endpoint === 'arrow') {
            // eslint-disable-next-line max-len
            cleanedRest.markerStart = `url("#__grommet__openArrowStart__${normalizeColor(
              colorName,
              theme,
            )}__${connectionRest.fromTarget}")`;
            // eslint-disable-next-line max-len
            cleanedRest.markerEnd = `url("#__grommet__openArrowEnd__${normalizeColor(
              colorName,
              theme,
            )}__${connectionRest.toTarget}")`;

            if (
              !addedMarkerElmentIds[
                /* eslint-disable max-len */
                `__grommet__openArrowStart__${normalizeColor(
                  colorName,
                  theme,
                )}__${connectionRest.fromTarget}`
              ] &&
              !addedMarkerElmentIds[
                /* eslint-disable max-len */
                `__grommet__openArrowEnd__${normalizeColor(
                  colorName,
                  theme,
                )}__${connectionRest.toTarget}`
              ]
            ) {
              addedMarkerElmentIds[
                /* eslint-disable max-len */
                `__grommet__openArrowStart__${normalizeColor(
                  colorName,
                  theme,
                )}__${connectionRest.fromTarget}`
              ] = true;
              addedMarkerElmentIds[
                /* eslint-disable max-len */
                `__grommet__openArrowEnd__${normalizeColor(
                  colorName,
                  theme,
                )}__${connectionRest.toTarget}`
              ] = true;
              markerElements.push(
                <>
                  {openArrow(
                    normalizeColor(colorName, theme),
                    `__grommet__openArrowStart__${normalizeColor(
                      colorName,
                      theme,
                    )}__${connectionRest.fromTarget}`,
                    'auto-start-reverse',
                  )}
                  {openArrow(
                    normalizeColor(colorName, theme),
                    `__grommet__openArrowEnd__${normalizeColor(
                      colorName,
                      theme,
                    )}__${connectionRest.toTarget}`,
                  )}
                </>,
              );
            }
          }

          path = (
            <path
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              // eslint-disable-next-line react/no-unknown-property
              animation={animation}
              {...cleanedRest}
              stroke={normalizeColor(colorName, theme)}
              strokeWidth={strokeWidth}
              strokeLinecap={round ? 'round' : 'butt'}
              strokeLinejoin={round ? 'round' : 'miter'}
              fill="none"
              d={d}
            />
          );
        }
        return path;
      },
    );
  }

  return (
    <StyledDiagram
      ref={svgRef}
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      preserveAspectRatio="xMinYMin meet"
      connections={paths}
      {...rest}
    >
      {markerElements.length > 0 &&
        markerElements.map((marker, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={index}>{marker}</Fragment>
        ))}
      <g>{paths}</g>
    </StyledDiagram>
  );
});

Diagram.displayName = 'Diagram';
Diagram.defaultProps = { connections: [] };
Diagram.propTypes = DiagramPropTypes;

export { Diagram };
