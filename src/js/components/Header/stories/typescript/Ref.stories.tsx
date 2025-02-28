import React from 'react';

import { Avatar, Button, Header, Nav } from 'grommet';

const gravatarLink =
  '//s.gravatar.com/avatar/b7fb138d53ba0f573212ccce38a7c43b?s=80';

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];

export const Ref = () => {
  const ref = React.useRef<HTMLDivElement>(undefined);
  const [colorIndex, setColorIndex] = React.useState(0);

  const changeColor = () => {
    setColorIndex((i) => (i + 1) % colors.length);
  };

  React.useEffect(() => {
    if (ref.current) ref.current.style.backgroundColor = colors[colorIndex];
  });

  return (
    // Uncomment <Grommet> lines when using outside of storybook
    // <Grommet theme={...}>
    <Header background="light-4" pad="small" ref={ref}>
      <Avatar src={gravatarLink} />
      <Nav direction="row">
        <Button primary label="Change Color" onClick={changeColor} />
      </Nav>
    </Header>
    // </Grommet>
  );
};
Ref.parameters = {
  chromatic: { disable: true },
};
export default {
  title: 'Layout/Header/Ref',
};
