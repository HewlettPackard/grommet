import React, { useContext, useEffect } from 'react';

import {
  Box,
  Button,
  Heading,
  ResponsiveContext,
  Text,
  ThemeContext,
} from 'grommet';
import { FormNext, FormPrevious } from 'grommet-icons';
import { ResponsiveContainer } from '../ResponsiveContainer';

const App = ({ title }) => {
  const theme = React.useContext(ThemeContext);

  const widthRef = React.useRef();
  const containerRef = React.useRef();
  useEffect(() => {
    let resizeObserver;
    const element = containerRef.current;
    if (typeof window !== 'undefined' && window.ResizeObserver) {
      resizeObserver = new window.ResizeObserver((entries) => {
        const entry = entries[0].borderBoxSize[0];
        const width = entry?.inlineSize;
        if (widthRef.current) {
          widthRef.current.innerText = `Container width: ${width.toFixed()}px`;
        }
      });
      if (element) {
        resizeObserver.observe(containerRef.current);
      }
    } else {
      // fallback for server side rendering
      const width = containerRef.current.getBoundingClientRect();
      if (widthRef.current) {
        widthRef.current.innerText = `Container width: ${width.toFixed()}px`;
      }
    }
    return () => {
      if (resizeObserver && element) {
        resizeObserver.unobserve(element);
      }
    };
  });

  const smallBreakpoint = theme.global.breakpoints.small.value;
  const size = useContext(ResponsiveContext);
  return (
    <Box
      ref={containerRef}
      direction="row"
      gap="medium"
      justify="between"
      align="start"
      flex="grow"
    >
      <Box pad="medium">
        <Heading>{title}</Heading>
        <Box
          direction="row-responsive"
          gap={{ column: 'medium', row: 'xsmall' }}
        >
          <Text>I am row-responsive</Text>
          <Text>Small breakpoint: {smallBreakpoint}</Text>
          <Text ref={widthRef} />
          <Text>
            Current size:&nbsp;<Text weight="bold">{size}</Text>{' '}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

const SidePanel = () => {
  const [open, setOpen] = React.useState(true);
  const onToggle = () => setOpen((prev) => !prev);
  return (
    <Box direction="row" align="start">
      <Button
        icon={open ? <FormNext /> : <FormPrevious />}
        onClick={onToggle}
      />
      {open && (
        <Box
          width="large"
          border={{ side: 'left' }}
          align="center"
          justify="center"
          fill="vertical"
        >
          <Text>Right hand side</Text>
        </Box>
      )}
    </Box>
  );
};

export const Simple = () => (
  <Box direction="row" height="100vh" width="100vw" overflow="hidden">
    <Box overflow="auto" fill="horizontal">
      <ResponsiveContainer flex="grow">
        <App title="Responsive to container" />
      </ResponsiveContainer>
      <App title="Responsive to window" />
    </Box>
    <SidePanel />
  </Box>
);

export default {
  title: `Layout/ResponsiveContainer/Simple`,
};
