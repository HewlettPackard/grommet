import { describe, PropTypes } from 'react-desc';

import { getAvailableAtBadge } from '../../utils';

export const doc = SkipLinks => {
  const DocumentedSkipLinks = describe(SkipLinks)
    .availableAt(getAvailableAtBadge('SkipLinks'))
    .description('Describe a list of elements to skip to.')
    .usage(
      `import { SkipLinks } from 'grommet';
<SkipLinks elements={['main', 'footer']} />`
    );

  DocumentedSkipLinks.propTypes = {
    children: PropTypes.node.description('Array of SkipLink').isRequired,
    messages: PropTypes.shape({
      skipTo: PropTypes.string,
    }).description('Custom messages for SkipLinks. Used for accessibility by screen readers.'),
  };

  return DocumentedSkipLinks;
};
