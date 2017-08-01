import React, { Component } from 'react';
import { compose } from 'recompose';

import StyledHeading from './StyledHeading';

import { withTheme } from '../hocs';

import doc from './doc';

const styledComponents = {
  div: StyledHeading,
}; // tag -> styled component

class Heading extends Component {
  static defaultProps = {
    level: 1,
  };

  render() {
    const {
      level,
      ...rest
    } = this.props;

    const tag = `h${level}`;
    let StyledComponent = styledComponents[tag];
    if (!StyledComponent) {
      StyledComponent = StyledHeading.withComponent(tag);
      styledComponents[tag] = StyledComponent;
    }

    return (
      <StyledComponent level={level} {...rest} />
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  doc(Heading);
}

export default compose(
  withTheme,
)(Heading);
