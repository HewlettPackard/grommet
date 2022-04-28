function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { Box, Button, Collapsible, Text } from 'grommet';
export var Default = function Default(props) {
  var _React$useState = React.useState(false),
      open = _React$useState[0],
      setOpen = _React$useState[1];

  return (
    /*#__PURE__*/
    // Uncomment <Grommet> lines when using outside of storybook
    // <Grommet theme={grommet}>
    React.createElement(Box, {
      align: "start",
      gap: "small"
    }, /*#__PURE__*/React.createElement(Button, {
      primary: true,
      onClick: function onClick() {
        return setOpen(!open);
      },
      label: "Toggle"
    }), /*#__PURE__*/React.createElement(Collapsible, _extends({
      open: open
    }, props), /*#__PURE__*/React.createElement(Box, {
      background: "light-2",
      round: "medium",
      pad: "medium",
      align: "center",
      justify: "center"
    }, /*#__PURE__*/React.createElement(Text, null, "This is a box inside a Collapsible component"))), /*#__PURE__*/React.createElement(Text, null, "This is other content outside the Collapsible box")) // </Grommet>

  );
};
Default.parameters = {
  chromatic: {
    disable: true
  }
};
export default {
  title: 'Utilities/Collapsible/Default'
};