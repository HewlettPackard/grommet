import React, { useState } from 'react';

import { Box, List, Text } from 'grommet';
import { User } from 'grommet-icons';

const locations = [
  'Los Angelos',
  'Boise',
  'Fort Collins',
  'Los Gatos',
  'Palo Alto',
  'Pheonix',
  'San Francisco',
  'Trenton',
];

const pinnedLocations = [
  'Los Angelos',
  'Fort Collins',
  'Palo Alto',
  'Pheonix',
  'Trenton',
];

const pinnedObject = {
  icon: User,
  background: { color: 'purple', opacity: 'weak' },
  color: 'blue',
  items: ['Los Angelos', 'Fort Collins', 'Palo Alto', 'Pheonix', 'Trenton'],
};
const pinnedObjectCustomColor = {
  icon: <User color="green" />,
  background: { color: 'purple', opacity: 'weak' },
  color: 'blue',
  items: ['Los Angelos', 'Fort Collins', 'Palo Alto', 'Pheonix', 'Trenton'],
};

const objectData = [
  { location: 'Los Angelos', state: 'California' },
  { location: 'Boise', state: 'Idaho' },
  { location: 'Fort Collins', state: 'Colorado' },
  { location: 'Los Gatos', state: 'California' },
  { location: 'Palo Alto', state: 'California' },
  { location: 'Pheonix', state: 'Arizona' },
  { location: 'San Francisco', state: 'California' },
  { location: 'Trenton', state: 'New Jersey' },
];

export const Temp = () => {
  const [ordered, setOrder] = useState(locations);
  return (
    <>
      <Box pad="large" direction="row" gap="medium">
        <Box gap="small">
          data as array of strings, pinned as array of strings matching data
          <List
            aria-label="pinned list"
            data={ordered}
            onOrder={setOrder}
            pinned={pinnedLocations}
          />
        </Box>
        <Box gap="small">
          data as array of strings, pinned as object with pinned.items array
          matching data
          <List
            aria-label="pinned list"
            data={ordered}
            onOrder={setOrder}
            pinned={pinnedObject}
          />
        </Box>
        <Box gap="small">
          data as array of objects, primaryKey locations, secondaryKey state,
          pinned as array
          <List
            aria-label="pinned list"
            data={objectData}
            onOrder={setOrder}
            pinned={pinnedLocations}
            primaryKey="location"
            secondaryKey="state"
          />
        </Box>
      </Box>
      <Box direction="row" gap="medium">
        <Box gap="small">
          data as array of objects, primaryKey locations, secondaryKey state,
          pinned as object
          <List
            aria-label="pinned list"
            data={objectData}
            onOrder={setOrder}
            pinned={pinnedObject}
            primaryKey="location"
            secondaryKey="state"
          />
        </Box>
        <Box gap="small">
          data as array of objects, primaryKey locations, secondaryKey state,
          pinned as object with color defined on icon
          <List
            aria-label="pinned list"
            data={objectData}
            onOrder={setOrder}
            pinned={pinnedObjectCustomColor}
            primaryKey="location"
            secondaryKey="state"
          />
        </Box>
        <Box gap="small">
          data as array of objects, primaryKey function, secondaryKey state,
          pinned as object with color defined on icon
          <List
            aria-label="pinned list"
            data={objectData}
            onOrder={setOrder}
            pinned={pinnedObjectCustomColor}
            primaryKey={(item) => (
              <Text key={item.location} color="red">
                {item.location}
              </Text>
            )}
            secondaryKey={(item) => (
              <Text key={item.state} color="purple">
                {item.state}
              </Text>
            )}
            itemKey="location"
          />
        </Box>
      </Box>
    </>
  );
};

export default {
  title: 'Visualizations/List/Temp',
};
