var _excluded = ["align", "layout", "nameProps", "pairProps", "valueProps"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import React, { forwardRef, useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { Grid } from '../Grid';
import { ResponsiveContext } from '../../contexts/ResponsiveContext';
import { NameValueListContext } from './NameValueListContext';
var NameValueList = /*#__PURE__*/forwardRef(function (_ref, ref) {
  var align = _ref.align,
      _ref$layout = _ref.layout,
      layout = _ref$layout === void 0 ? 'column' : _ref$layout,
      nameProps = _ref.nameProps,
      _ref$pairProps = _ref.pairProps,
      pairProps = _ref$pairProps === void 0 ? {
    direction: 'row'
  } : _ref$pairProps,
      valueProps = _ref.valueProps,
      rest = _objectWithoutPropertiesLoose(_ref, _excluded);

  var size = useContext(ResponsiveContext);
  var theme = useContext(ThemeContext); // If layout is grid, valueWidth sets the max width of the column.
  // Grid will 'fit' as many columns of valueWidth per row as container's
  // width allows.

  var columns;
  var valueWidth = (valueProps == null ? void 0 : valueProps.width) || theme.nameValueList.value.width;
  var nameWidth = (nameProps == null ? void 0 : nameProps.width) || theme.nameValueList.name.width;
  if (size === 'small' || layout === 'grid') columns = {
    count: 'fit',
    size: ['auto', valueWidth]
  };else if (layout === 'column' && pairProps.direction === 'row') columns = [nameWidth, valueWidth];else columns = [valueWidth];
  return /*#__PURE__*/React.createElement(NameValueListContext.Provider, {
    value: {
      nameProps: nameProps,
      pairProps: pairProps,
      valueProps: valueProps
    }
  }, /*#__PURE__*/React.createElement(Grid, _extends({
    as: "dl",
    ref: ref,
    columns: columns,
    gap: theme.nameValueList.gap,
    fill: layout === 'grid'
  }, rest)));
});
NameValueList.displayName = 'NameValueList';
export { NameValueList };