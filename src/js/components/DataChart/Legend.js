import React, { useMemo } from 'react';
import { Box } from '../Box';
import { Button } from '../Button';
import { Text } from '../Text';
import { Swatch } from './Swatch';

const Legend = ({
  activeProperty,
  series: seriesProp,
  seriesStyles,
  setActiveProperty,
}) => {
  const series = useMemo(
    () => seriesProp.filter((s) => seriesStyles[s.property]),
    [seriesProp, seriesStyles],
  );
  const interactive = useMemo(
    // filter out properties that are used in point chart aspects
    () =>
      series.filter(({ property }) => !seriesStyles[property].aspect).length >
      1,
    [series, seriesStyles],
  );
  return (
    <Box margin={{ top: 'small' }} direction="row" wrap gap="small">
      {series.map(({ property, label }) => {
        const isActive = property === activeProperty;
        const swatchProps = {};
        const textProps = {};
        if (activeProperty !== undefined) {
          if (!isActive) {
            // swatchProps.color = 'status-disabled';
            textProps.color = 'text-xweak';
          } else {
            textProps.color = 'text-strong';
          }
        }
        let content = (
          <Box
            key={property}
            direction="row"
            align="center"
            pad={{ horizontal: 'small', vertical: 'xsmall' }}
            gap="xsmall"
          >
            <Swatch {...seriesStyles[property]} {...swatchProps} />
            <Text {...textProps}>{label || property}</Text>
          </Box>
        );
        if (interactive) {
          content = (
            <Button
              key={property}
              active={isActive}
              aria-pressed={isActive ? 'true' : 'false'}
              onClick={() => setActiveProperty(isActive ? undefined : property)}
              hoverIndicator
            >
              {content}
            </Button>
          );
        }
        return content;
      })}
    </Box>
  );
};

export { Legend };
