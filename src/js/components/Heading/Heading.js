import React, { forwardRef, useContext, useState } from 'react';
import { useLayoutEffect } from '../../utils/use-isomorphic-layout-effect';

import { StyledHeading } from './StyledHeading';
import { HeadingPropTypes } from './propTypes';
import { useForwardedRef } from '../../utils';
import { useSkeleton } from '../Skeleton';
import { HeadingSkeleton } from './HeadingSkeleton';
import { useThemeValue } from '../../utils/useThemeValue';
import { ResponsiveContainerContext } from '../../contexts';

const Heading = forwardRef(
  (
    {
      children,
      color,
      fill,
      level = 1,
      overflowWrap: overflowWrapProp,
      responsive: responsiveProp = true,
      weight,
      ...rest
    },

    ref, // munged to avoid styled-components putting it in the DOM
  ) => {
    const { passThemeFlag } = useThemeValue();
    const headingRef = useForwardedRef(ref);
    const [overflowWrap, setOverflowWrap] = useState(
      overflowWrapProp || 'break-word',
    );

    const responsiveContainer = useContext(ResponsiveContainerContext);
    const responsive =
      responsiveContainer && responsiveProp ? 'container' : responsiveProp;
    const skeleton = useSkeleton();

    // handle overflowWrap of heading
    useLayoutEffect(() => {
      const updateOverflowWrap = () => {
        let wrap;
        if (!overflowWrapProp && headingRef.current) {
          wrap =
            headingRef.current.scrollWidth > headingRef.current.offsetWidth
              ? 'anywhere'
              : 'break-word';
          setOverflowWrap(wrap);
        }
      };

      window.addEventListener('resize', updateOverflowWrap);
      updateOverflowWrap();
      return () => window.removeEventListener('resize', updateOverflowWrap);
    }, [headingRef, overflowWrapProp]);

    let content = children;
    if (skeleton) {
      content = (
        <HeadingSkeleton
          level={level}
          fill={fill}
          responsive={responsive}
          {...rest}
        />
      );
    }

    return (
      // enforce level to be a number
      <StyledHeading
        as={`h${level}`}
        colorProp={color}
        fillProp={fill}
        level={+level}
        overflowWrap={overflowWrap}
        responsive={responsive}
        weight={weight}
        {...passThemeFlag}
        {...rest}
        ref={headingRef}
      >
        {content}
      </StyledHeading>
    );
  },
);

Heading.displayName = 'Heading';
Heading.propTypes = HeadingPropTypes;

export { Heading };
