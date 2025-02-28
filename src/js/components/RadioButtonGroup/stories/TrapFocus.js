import React, { useEffect, useState } from 'react';

import { Box, RadioButtonGroup } from 'grommet';

export const TrapFocus = () => {
  const [value, setValue] = useState({ value: '' });

  const input = React.useRef();

  useEffect(() => {
    setTimeout(() => {
      input.current?.focus();
      console.log('here', input.current);
    }, 500);
  }, []);

  const postMethods = [
    { label: 'FTP', value: 'FTP' },
    {
      label: 'File System',
      value: 'FileSystem',
    },
    {
      label: 'FTP & File System',
      value: 'FTPCopy',
    },
  ];

  // In this example there is no keyboard access to the RBG component
  // The trapFocus should fix the initial focus
  return (
    <Box align="center" pad="large">
      <RadioButtonGroup
        ref={input}
        name="radio"
        options={postMethods}
        value={value}
        onChange={(event) => setValue(event.value)}
        // trapFocus
      />
    </Box>
  );
};
export default {
  title: 'Input/RadioButtonGroup/Trap Focus',
};
