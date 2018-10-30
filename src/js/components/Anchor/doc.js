import { describe, PropTypes } from 'react-desc';

import { genericProps, getAvailableAtBadge } from '../../utils';

export const themeDoc = {
  'global.focus.border.color': {
    description: 'The color around the Anchor when in focus.',
    type: 'string | { dark: string, light: string }',
    defaultValue: '#FD6FFF',
  },
  'anchor.color': {
    description: 'Used to apply a default color to the icon and label.',
    type: 'string | { dark: string, light: string }',
    defaultValue: "{ light: '#1D67E3', dark: '#6194EB' }",
  },
  'anchor.fontWeight': {
    description: 'The font weight to be applied to the anchor text.',
    type: 'number',
    defaultValue: 600,
  },
  'anchor.textDecoration': {
    description: 'The text decoration to be applied to the anchor.',
    type: 'string',
    defaultValue: 'none',
  },
  'anchor.hover.fontWeight': {
    description:
      'The font weight to be applied to the anchor text when hovering.',
    type: 'number',
    defaultValue: undefined,
  },
  'anchor.hover.textDecoration': {
    description:
      'The text decoration to be applied to the anchor when hovering.',
    type: 'string',
    defaultValue: 'underline',
  },
  'anchor.hover.extend': {
    description:
      'Any additional style to be applied to the Anchor when hovering.',
    type: 'string | func',
    defaultValue: undefined,
  },
  'anchor.extend': {
    description: 'Any additional style to be applied to the Anchor.',
    type: 'string | func',
    defaultValue: undefined,
  },
};

export const doc = Anchor => {
  const DocumentedAnchor = describe(Anchor)
    .availableAt(getAvailableAtBadge('Anchor'))
    .description(
      `A text link. We have a separate component from the browser
base so we can style it. You can either set the icon and/or label properties
or just use children.`,
    )
    .usage(
      "import { Anchor } from 'grommet';\n<Anchor href={location} label='Label' />",
    );

  DocumentedAnchor.propTypes = {
    ...genericProps,
    a11yTitle: PropTypes.string.description(
      'Custom title to be used by screen readers.',
    ),
    color: PropTypes.string.description(`
      Label color and icon color, if not specified on the icon.
    `),
    href: PropTypes.string.description(
      'Hyperlink reference to place in the anchor.',
    ),
    icon: PropTypes.element.description('Icon element to place in the anchor.'),
    label: PropTypes.node.description('Label text to place in the anchor.'),
    onClick: PropTypes.func
      .description(`Click handler. It can be used, for example, 
    to add analytics and track who clicked in the anchor.`),
    primary: PropTypes.bool
      .description('Whether this is a primary anchor.')
      .defaultValue(false),
    reverse: PropTypes.bool
      .description(
        'Whether an icon and label should be reversed so that the icon is at the end of the anchor.',
      )
      .defaultValue(false),
  };

  return DocumentedAnchor;
};
