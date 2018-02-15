import React, { Component } from 'react';
import { compose } from 'recompose';

import { withTheme } from '../hocs';

import StyledTable, { StyledTableDataCaption } from './StyledTable';
import doc from './doc';

class Table extends Component {
  static defaultProps = { columns: [], data: [] }

  render() {
    const { caption, children, ...rest } = this.props;
    return (
      <StyledTable {...rest}>
        {caption ? <StyledTableDataCaption>{caption}</StyledTableDataCaption> : null}
        {children}
      </StyledTable>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  doc(Table);
}

export default compose(
  withTheme,
)(Table);
