import React, { Component, Fragment } from 'react';
import { compose } from 'recompose';

import { Box } from '../Box';
import { Button } from '../Button';
import { Collapsible } from '../Collapsible';
import { Heading } from '../Heading';
import { withTheme, withForwardRef } from '../hocs';
import { evalStyle, normalizeColor } from '../../utils';

import { accordionPanel } from './doc';
import { AccordionContext } from './AccordionContext';

class AccordionPanel extends Component {
  state = {
    hover: undefined,
  }

  render() {
    const {
      children,
      header,
      label,
      theme,
      onMouseOut,
      onMouseOver,
      ...rest
    } = this.props;
    const { hover } = this.state;

    const dark = theme.dark;
    const iconColor = evalStyle(normalizeColor(theme.accordion.icons.color ||
      theme.global.control.color, theme), theme);

    return (
      <AccordionContext>
        {(panelContext) => {
          const { active, animate, onPanelChange } = panelContext;
          const AccordionIcon = active ? (
            theme.accordion.icons.collapse
          ) : (
            theme.accordion.icons.expand
          );

          return (
            <Fragment>
              <Button
                role='tab'
                aria-selected={active}
                aria-expanded={active}
                onClick={onPanelChange}
                onMouseOver={(...args) => {
                  this.setState({ hover: dark ? 'light-4' : 'dark-6' });
                  if (onMouseOver) {
                    onMouseOver(args);
                  }
                }}
                onMouseOut={(...args) => {
                  this.setState({ hover: undefined });
                  if (onMouseOut) {
                    onMouseOut(args);
                  }
                }}
              >
                {header || (
                <Box
                  flex={false}
                  align='center'
                  direction='row'
                  justify='between'
                  {...rest}
                >
                  {typeof label === 'string' ? (
                    <Box pad={{ horizontal: 'xsmall' }}>
                      <Heading
                        level={4}
                        color={hover}
                      >
                        {label}
                      </Heading>
                    </Box>
                    ) : label}
                  {AccordionIcon && (
                  <Box pad={{ horizontal: 'small' }}>
                    <AccordionIcon color={iconColor} />
                  </Box>
                    )}
                </Box>
                )}
              </Button>
              <Box
                flex={false}
                border={{ side: 'bottom', color: dark ? 'border-dark' : 'border-light' }}
              >
                {animate ? (
                  <Collapsible
                    open={active}
                  >
                    {children}
                  </Collapsible>
                ) : active && children}
              </Box>
            </Fragment>
          );
        }}
      </AccordionContext>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  accordionPanel(AccordionPanel);
}

export default compose(
  withTheme,
  withForwardRef,
)(AccordionPanel);
