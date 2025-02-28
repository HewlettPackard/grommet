import * as React from 'react';

export interface AccordionPanelProps {
  label?: string | React.ReactNode;
  header?: React.ReactNode;
}

type divType = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export interface AccordionPanelExtendedProps
  extends AccordionPanelProps,
    divType {}

declare const AccordionPanel: React.FC<AccordionPanelExtendedProps>;

export { AccordionPanel };
