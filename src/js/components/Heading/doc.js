import { describe, PropTypes } from 'react-desc';

export default (Heading) => {
  const DocumentedHeading = describe(Heading)
    .description('Heading text structed in levels.')
    .usage(
      `import { Heading } from 'grommet';
      <Heading/>`
    );

  DocumentedHeading.propTypes = {
    level: PropTypes.oneOf([1, 2, 3, 4]).description(
      `The heading level. It corresponds to the number after the 'H' for
      the DOM tag. Set the level for semantic accuracy and accessibility.
      The sizing can be further adjusted using the size property.`
    ),
    margin: PropTypes.oneOfType([
      PropTypes.oneOf(['none', 'small', 'medium', 'large']),
      PropTypes.shape({
        bottom: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
        top: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
      }),
    ]).description(
      `The amount of margin above and/or below the heading. An object can be
      specified to distinguish top margin and bottom margin.`
    ),
    size: PropTypes.oneOf(['small', 'medium', 'large']).description(
      `The font size is primarily driven by the chosen tag. But, it can
      be adjusted via this size property. The tag should be set for semantic
      correctness and accessibility. This size property allows for stylistic
      adjustments.`
    ),
    textAlign: PropTypes.oneOf(['start', 'center', 'end']).description(
      'How to align the text inside the heading.'
    ),
    truncate: PropTypes.bool.description(
      `Restrict the text to a single line and truncate with ellipsis if it
      is too long to all fit.`
    ),
  };

  return DocumentedHeading;
};
