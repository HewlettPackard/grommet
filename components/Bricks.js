'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

var CLASS_ROOT = 'bricks';

var Bricks = function Bricks(props) {
  var classes = (0, _classnames2.default)(CLASS_ROOT, props.className);

  return _react2.default.createElement(
    'div',
    { className: classes },
    props.children
  );
};

exports.default = Bricks;
module.exports = exports['default'];