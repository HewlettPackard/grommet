import { describe, PropTypes } from 'react-desc';

import { getAvailableAtBadge } from '../../utils';

export const doc = (Tabs) => {
  const DocumentedTabs = describe(Tabs)
    .availableAt(getAvailableAtBadge('Tabs'))
    .description('A tabular view component.')
    .usage(
      `import { Tabs, Tab } from 'grommet';
<Tabs>
  <Tab title='Tab 1'>...</Tab>
  <Tab title='Tab 2'>...</Tab>
</Tabs>`
    );

  DocumentedTabs.propTypes = {
    activeIndex: PropTypes.number.description(
      `Active tab index. If specified, Tabs will be a controlled component. This means that future
tab changes will not work unless you subscribe to onActive function and update activeIndex
accordingly.`
    ),
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]).description(
      'Array of Tab.'
    ).isRequired,
    justify: PropTypes.oneOf(['start', 'center', 'end']).description(
      'How to align the tabs along the main axis.'
    ).defaultValue('center'),
    messages: PropTypes.shape({
      tabContents: PropTypes.string,
    }).description(
      'Custom messages for Tabs. Used for accessibility by screen readers.'
    ).defaultValue({
      tabContents: 'Tab Contents',
    }),
    onActive: PropTypes.func.description(
      `Function that will be called with the active tab index when the currently active
tab changes.`
    ),
  };
  return DocumentedTabs;
};
