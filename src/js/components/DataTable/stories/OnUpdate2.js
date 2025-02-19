/* eslint-disable no-param-reassign */
import React, { useCallback, useMemo, useState } from 'react';

import { Box, DataTable } from 'grommet';

// Source code for the data can be found here
// https://github.com/grommet/grommet/blob/master/src/js/components/DataTable/stories/data.js
import { groupColumns, locations, DATA } from './data';

// The key of the header selection state in groupBy.select
// Other keys in groupBy.select will be group id's.
const HEADER_KEY = '';
const SELECTED = {
  none: 'none',
  some: 'some',
  all: 'all',
};

const expandable = [...locations];

// copy groupColumns but remove the primaryKey from any that have it.
const columns = groupColumns.map((col) => ({ ...col, primary: false }));

const numExtra = 20;

const buildGroups = () => {
  const data = [...DATA];

  // Add some extra people to each location
  locations.forEach((location, index) => {
    for (let i = 0; i < numExtra * (index + 1); i += 1) {
      data.push({
        name: `${location[0]}Name${i}`,
        location,
        date: DATA[index % DATA.length].date,
        percent: DATA[index % DATA.length].percent,
        paid: DATA[index % DATA.length].paid,
      });
    }
  });

  const groupKeys = ['', ...expandable];
  const nextGroupMap = {};
  const nextGroups = groupKeys.map((id) => {
    const members = data
      .filter((item) => item.location === id)
      .map((item) => ({ id: item.name, ...item }));
    const group = { id, members, selected: false };
    nextGroupMap[id] = group;
    return group;
  });
  return [nextGroups, nextGroupMap];
};

const [groups, groupMap] = buildGroups();

const calcHeaderSelected = (nextGroupSelected, selected) => {
  // Figure out if everything is selected or just partial or none.
  const totals = { all: 0, some: 0, none: 0 };
  groups.forEach((group) => {
    if (group.members.length > 0) {
      if (group.id) {
        const selectedValue = nextGroupSelected[group.id] || SELECTED.none;
        totals[selectedValue] += 1;
      } else {
        const keys = group.members.map((datum) => datum.id);
        const selectedMembers = keys.filter((key) =>
          selected.includes(key),
        ).length;
        if (selectedMembers === 0) {
          totals.none += 1;
        } else if (group.members.length === selectedMembers) {
          totals.all += 1;
        } else {
          totals.some += 1;
        }
      }
    }
  });

  let headerSelected = SELECTED.all;

  if (totals.all === 0 && totals.some === 0) {
    headerSelected = SELECTED.none;
  } else if (totals.some > 0 || (totals.all > 0 && totals.none > 0)) {
    headerSelected = SELECTED.some;
  }

  return { ...nextGroupSelected, [HEADER_KEY]: headerSelected };
};

const sortCompare = (a, b, sort) => {
  const v1 = a[sort.property] || '';
  const v2 = b[sort.property] || '';
  const dir = sort.direction || 'asc';
  let result = 0;
  if (typeof v1 === 'string' && typeof v2 === 'string') {
    result = v1.localeCompare(v2, 'en', { sensitivity: 'base' });
  } else if (v1 === v2) {
    result = 0;
  } else if (v1 < v2) {
    result = -1;
  } else {
    result = 1;
  }
  return dir === 'desc' ? -result : result;
};

const getData = ({ expanded, sort, show, count }) => {
  const items = [];

  // Sort the groups by location
  groups.sort((a, b) => {
    const dir = sort?.property === 'location' ? sort.direction || 'asc' : 'asc';
    const result = a.id.localeCompare(b.id, 'en', { sensitivity: 'base' });
    return dir === 'desc' ? -result : result;
  });

  // add any non-empty groups to items. Also add members of
  // expanded groups.
  groups.forEach(({ id, members }) => {
    if (members.length > 0) {
      if (id) {
        const paid = members.reduce((prev, curr) => prev + curr.paid, 0);
        items.push({ id, name: id, paid });
      }

      if (!id || expanded?.includes(id)) {
        if (sort?.property) {
          members.sort((a, b) => sortCompare(a, b, sort));
        }
        items.push(...members);
      }
    }
  });

  const start = show || 0;

  const result = count ? items.slice(0, Math.max(count, start + count)) : items;
  return result;
};

export const OnUpdateDataTable2 = () => {
  const step = 50;
  const [groupSelected, setGroupSelected] = useState({});
  const [select, setSelect] = useState([]);
  const [expand, setExpand] = useState(['Fort Collins']);
  const [data, setData] = useState(() =>
    getData({
      expanded: expand,
      sort: { property: 'name', direction: 'asc' },
      count: step,
    }),
  );

  const onSelect = useCallback((selected, row) => {
    console.log('onSelect', selected, row);
    const groupUpdates = {};
    if (row?.location) {
      // this is a member of a group. Update the group selection state
      const memberKeys = groupMap[row.location].members.map(({ id }) => id);
      const selectedMembers = selected.filter((s) => memberKeys.includes(s));
      if (selectedMembers.length === 0) {
        groupUpdates[row.location] = SELECTED.none;
      } else if (selectedMembers.length === memberKeys.length) {
        groupUpdates[row.location] = SELECTED.all;
      } else {
        groupUpdates[row.location] = SELECTED.some;
      }
    }
    setGroupSelected((prev) =>
      calcHeaderSelected({ ...prev, ...groupUpdates }, selected),
    );
    setSelect(selected);
  }, []);

  const onGroupSelect = useCallback(
    (selected, row, groupBySelected) => {
      console.log('onGroupSelect', selected, row, groupBySelected);
      let nextSelected;
      let nextGroupSelected;

      if (row) {
        const memberKeys = groupMap[row.id].members.map(({ id }) => id);

        nextGroupSelected = { ...groupSelected };
        nextSelected = selected.filter((s) => !memberKeys.includes(s));

        if (
          groupSelected[row.id] === SELECTED.some ||
          groupSelected[row.id] === SELECTED.all
        ) {
          nextGroupSelected[row.id] = SELECTED.none;
        } else {
          nextSelected = [...nextSelected, ...memberKeys];
          nextGroupSelected[row.id] = SELECTED.all;
        }

        nextGroupSelected = calcHeaderSelected(nextGroupSelected, nextSelected);
      } else {
        // The header was selected/deselected
        nextGroupSelected = {};
        nextSelected = [];
        if (groupBySelected[HEADER_KEY] === SELECTED.all) {
          // add all groups and keys
          groups.forEach(({ id, members }) => {
            if (members.length > 0) {
              if (id) {
                nextGroupSelected[id] = SELECTED.all;
              }
              nextSelected.push(...members.map((datum) => datum.id));
            }
          });
          nextGroupSelected[HEADER_KEY] = SELECTED.all;
        } else {
          nextSelected = [];
        }
      }
      setSelect(nextSelected);
      setGroupSelected(nextGroupSelected);
    },
    [groupSelected],
  );

  const groupBy = useMemo(
    () => ({
      expandable,
      expand,
      select: groupSelected,
      property: 'location',
      onSelect: onGroupSelect,
    }),
    [expand, groupSelected, onGroupSelect],
  );

  return (
    // Uncomment <Grommet> lines when using outside of storybook
    // <Grommet theme={grommet}>
    <Box align="start" pad="large" direction="row" gap="medium">
      <DataTable
        primaryKey="id"
        columns={columns}
        data={data}
        sortable
        replace
        groupBy={groupBy}
        onSelect={onSelect}
        onUpdate={(opts) => {
          console.log('onUpdate', opts);
          setExpand(opts.expanded);
          setData(getData(opts));
        }}
        select={select}
        step={step}
      />
      <Box align="start" justify="start">
        <pre>groupBy: {JSON.stringify(groupBy, null, 2)}</pre>
        <pre>select: {JSON.stringify(select, null, 2)}</pre>
        <pre>data: {JSON.stringify(data, null, 2)}</pre>
      </Box>
    </Box>
    // </Grommet>
  );
};

OnUpdateDataTable2.storyName = 'OnUpdate2';

export default {
  title: 'Visualizations/DataTable/OnUpdate2',
};
