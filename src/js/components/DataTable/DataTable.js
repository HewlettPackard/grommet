import React, { Component } from 'react';
import { compose } from 'recompose';

import { withTheme } from '../hocs';

import { Header } from './Header';
import { Footer } from './Footer';
import { Body } from './Body';
import { GroupedBody } from './GroupedBody';
import { buildState } from './buildState';
import { StyledDataTable } from './StyledDataTable';

class DataTable extends Component {
  static defaultProps = {
    columns: [],
    data: [],
  }

  state = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    return buildState(nextProps, prevState);
  }

  onFiltering = (property) => {
    this.setState({ filtering: property });
  }

  onFilter = (property, value) => {
    /* eslint-disable-next-line react/prop-types */
    const { onSearch } = this.props;
    const { ...filters } = this.state;
    filters[property] = value;
    this.setState({ filters });

    // Let caller know about search, if interested
    if (onSearch) {
      onSearch(filters);
    }
  }

  onSort = property => () => {
    const { sort } = this.state;
    const ascending = (sort && property === sort.property) ? !sort.ascending : true;
    this.setState({ sort: { property, ascending } });
  }

  onToggleGroup = groupValue => () => {
    const { ...groupState } = this.state;
    groupState[groupValue] = {
      ...groupState[groupValue],
      expanded: !(groupState[groupValue].expanded),
    };
    this.setState({ groupState });
  }

  onToggleGroups = () => {
    const { groupState } = this.state;
    const expanded = Object.keys(groupState)
      .filter(k => !groupState[k].expanded).length === 0;
    const nextGroupState = {};
    Object.keys(groupState).forEach((k) => {
      nextGroupState[k] = { ...groupState[k], expanded: !expanded };
    });
    this.setState({ groupState: nextGroupState });
  }

  onResize = property => (width) => {
    const { widths } = this.state;
    const nextWidths = { ...(widths || {}) };
    nextWidths[property] = width;
    this.setState({ widths: nextWidths });
  }

  render() {
    const {
      /* eslint-disable-next-line react/prop-types */
      columns, groupBy, onMore, resizeable, size, sortable, theme,
     } = this.props;
    const {
      data, filtering, filters, footerValues, groups, groupState, primaryProperty,
      showFooter, sort, widths,
    } = this.state;

    if (size && resizeable) {
      console.warn('DataTable cannot combine "size" and "resizeble".');
    }

    return (
      <StyledDataTable>
        <Header
          columns={columns}
          filtering={filtering}
          filters={filters}
          groups={groups}
          groupState={groupState}
          size={size}
          sort={sort}
          theme={theme}
          widths={widths}
          onFiltering={this.onFiltering}
          onFilter={this.onFilter}
          onResize={resizeable ? this.onResize : undefined}
          onSort={sortable ? this.onSort : undefined}
          onToggle={this.onToggleGroups}
        />
        {groups
          ? (
            <GroupedBody
              columns={columns}
              groupBy={groupBy}
              groups={groups}
              groupState={groupState}
              primaryProperty={primaryProperty}
              theme={theme}
              onToggle={this.onToggleGroup}
            />
          )
          : (
            <Body
              columns={columns}
              data={data}
              onMore={onMore}
              primaryProperty={primaryProperty}
              size={size}
              theme={theme}
            />
          )
        }
        {showFooter && (
          <Footer
            columns={columns}
            footerValues={footerValues}
            groups={groups}
            size={size}
            theme={theme}
          />
        )}
      </StyledDataTable>
    );
  }
}

let DataTableDoc;
if (process.env.NODE_ENV !== 'production') {
  DataTableDoc = require('./doc').doc(DataTable); // eslint-disable-line global-require
}
const DataTableWrapper = compose(
  withTheme,
)(DataTableDoc || DataTable);

export { DataTableWrapper as DataTable };
