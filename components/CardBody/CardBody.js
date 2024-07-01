"use strict";

exports.__esModule = true;
exports.CardBody = void 0;
var _react = _interopRequireDefault(require("react"));
var _Box = require("../Box");
var _useThemeValue = require("../../utils/useThemeValue");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
var CardBody = exports.CardBody = function CardBody(_ref) {
  var rest = _extends({}, (_objectDestructuringEmpty(_ref), _ref));
  var theme = (0, _useThemeValue.useThemeValue)();
  return /*#__PURE__*/_react["default"].createElement(_Box.Box, _extends({
    flex: true
  }, theme.card.body, rest));
};