"use strict";

exports.__esModule = true;
exports.formViewNameKey = exports.formStepKey = exports.formSortKey = exports.formSearchKey = exports.formRangeKey = exports.formPageKey = exports.formGroupByKey = exports.formColumnsKey = exports.DataForm = void 0;
var _react = _interopRequireWildcard(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _Box = require("../Box");
var _Button = require("../Button");
var _Footer = require("../Footer");
var _Form = require("../Form");
var _DataContext = require("../../contexts/DataContext");
var _DataFormContext = require("../../contexts/DataFormContext");
var _MessageContext = require("../../contexts/MessageContext");
var _useDebounce = require("../../utils/use-debounce");
var _excluded = ["children", "footer", "onDone", "pad", "updateOn"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
var MaxForm = (0, _styledComponents["default"])(_Form.Form).withConfig({
  displayName: "DataForm__MaxForm",
  componentId: "sc-v64e1r-0"
})(["max-width:100%;", ""], function (props) {
  return props.fill && 'max-height: 100%;';
});

// We convert the view structure to something more flat to work better
// with the Form inputs. These keys are how we flatten the Form value object
// from the view object.
var formSearchKey = exports.formSearchKey = '_search';
var formSortKey = exports.formSortKey = '_sort';
var formRangeKey = exports.formRangeKey = '_range';
var formStepKey = exports.formStepKey = '_step';
var formPageKey = exports.formPageKey = '_page';
var formColumnsKey = exports.formColumnsKey = '_columns';
var formGroupByKey = exports.formGroupByKey = '_groupBy';
var formViewNameKey = exports.formViewNameKey = '_view';
var viewFormKeyMap = {
  search: formSearchKey,
  sort: formSortKey,
  step: formStepKey,
  page: formPageKey,
  columns: formColumnsKey,
  groupBy: formGroupByKey,
  view: formViewNameKey
};

// flatten nested objects.
// For example: { a: { b: v, c: z } } -> { 'a.b': v, 'a.c': z }
var _flatten = function flatten(formValue, options) {
  var result = JSON.parse(JSON.stringify(formValue));
  Object.keys(result).forEach(function (i) {
    // We check the type of the i using
    // typeof() function and recursively
    // call the function again
    // ignore _range situations
    if (typeof result[i] === 'object' && !Array.isArray(result[i]) && (options != null && options.full || !result[i][formRangeKey])) {
      var temp = _flatten(result[i], options);
      Object.keys(temp).forEach(function (j) {
        // Store temp in result
        // ignore empty arrays
        if (!Array.isArray(temp[j]) || Array.isArray(temp[j]) && temp[j].length) result[i + "." + j] = temp[j];
      });
      delete result[i];
    }
  });
  return result;
};

// unflatten nested objects. For example: { 'a.b': v } -> { a: { b: v } }
var unflatten = function unflatten(formValue) {
  var result = JSON.parse(JSON.stringify(formValue));
  var specialKeys = Object.values(viewFormKeyMap);
  Object.keys(result).filter(function (k) {
    return !specialKeys.includes(k);
  }).forEach(function (k) {
    var parts = k.split('.');
    var val = result[k];
    delete result[k];
    var parent = result;
    while (parts.length > 1) {
      var sub = parts.shift();
      if (!parent[sub]) parent[sub] = {};
      parent = parent[sub];
    }
    parent[parts.shift()] = val;
  });
  return result;
};

// converts from the external view format to the internal Form value format
var viewToFormValue = function viewToFormValue(view) {
  var result = _extends({}, (view == null ? void 0 : view.properties) || {});
  // convert { min: , max: } range to [min, max] for RangeSelector
  Object.keys(result).forEach(function (key) {
    var _result$key, _result$key2;
    if (typeof ((_result$key = result[key]) == null ? void 0 : _result$key.min) === 'number' || typeof ((_result$key2 = result[key]) == null ? void 0 : _result$key2.max) === 'number') {
      var _result$key3;
      result[key] = (_result$key3 = {}, _result$key3[formRangeKey] = [result[key].min, result[key].max], _result$key3);
    }
  });

  // convert formal view keys to their form '_' prefixed counterparts
  Object.keys(viewFormKeyMap).forEach(function (key) {
    if (view != null && view[key]) result[viewFormKeyMap[key]] = view[key];
  });
  // always have some blank search text
  if (!result[formSearchKey]) result[formSearchKey] = '';
  if (view != null && view.sort) result[formSortKey] = view.sort;
  if (view != null && view.name) result[formViewNameKey] = view.name;
  if (view != null && view.columns) result[formColumnsKey] = view.columns;
  if (view != null && view.groupBy) result[formGroupByKey] = view.groupBy;
  return unflatten(result);
};

// converts from the internal Form value format to the external view format
var formValueToView = function formValueToView(value, views) {
  var result = {};

  // if the user chose a view, use that
  if (value[formViewNameKey]) result = JSON.parse(JSON.stringify(views.find(function (v) {
    return v.name === value[formViewNameKey];
  })));
  var valueCopy = _extends({}, value);
  Object.keys(viewFormKeyMap).forEach(function (key) {
    if (valueCopy[viewFormKeyMap[key]]) {
      result[key] = valueCopy[viewFormKeyMap[key]];
    }
    delete valueCopy[viewFormKeyMap[key]];
  });

  // flatten any nested objects
  var flatValue = _flatten(valueCopy);
  result.properties = _extends({}, result.properties || {}, flatValue);

  // convert any ranges
  Object.keys(result.properties).forEach(function (key) {
    if (result.properties[key][formRangeKey]) {
      result.properties[key] = {
        min: result.properties[key][formRangeKey][0],
        max: result.properties[key][formRangeKey][1]
      };
    }
  });
  return result;
};

// remove any empty arrays of property values by deleting the key for
// that property in the view properties
var clearEmpty = function clearEmpty(formValue, pendingReset) {
  var value = formValue;
  Object.keys(value).forEach(function (k) {
    if (Array.isArray(value[k]) && value[k].length === 0) delete value[k];
    // special case for when range selector returns to its min/max
    // flat format with full: true needed to match filter name structure
    // { a: b: { _range: [0, 100] } } ==> a.b._range: [0, 100]
    if (typeof value[k] === 'object' && !Array.isArray(value[k])) {
      var _pendingReset$current;
      var filterName = k + "." + Object.keys(_flatten(value[k], {
        full: true
      }))[0];
      if (pendingReset != null && (_pendingReset$current = pendingReset.current) != null && _pendingReset$current.has(filterName)) {
        delete value[k];
        pendingReset.current["delete"](filterName);
      }
    }
  });
  return value;
};

// if paging, when anything other than the page changes, reset the page to 1
var resetPage = function resetPage(nextFormValue, prevFormValue) {
  if (prevFormValue[formPageKey] && prevFormValue[formPageKey] > 1)
    // eslint-disable-next-line no-param-reassign
    nextFormValue[formPageKey] = 1;
};

// function shared by onSubmit and onChange to coordinate view
// name changes
var normalizeValue = function normalizeValue(nextValue, prevValue, views, pendingReset) {
  if (nextValue[formViewNameKey] && nextValue[formViewNameKey] !== prevValue[formViewNameKey]) {
    // view name changed, reset view contents from named view
    return viewToFormValue(views.find(function (v) {
      return v.name === nextValue[formViewNameKey];
    }));
  }
  // something else changed

  // clear empty properties
  var result = clearEmpty(nextValue, pendingReset);

  // if we have a view and something changed, clear the view
  if (result[formViewNameKey]) {
    var view = views.find(function (v) {
      return v.name === result[formViewNameKey];
    });
    var viewValue = viewToFormValue(view);
    clearEmpty(viewValue, pendingReset);
    if (Object.keys(viewValue).length !== Object.keys(result).length) {
      delete result[formViewNameKey];
    } else if (Object.keys(viewValue).some(function (k) {
      return (
        // allow mismatch between empty and set strings
        viewValue[k] && result[k] && JSON.stringify(result[k]) !== JSON.stringify(viewValue[k])
      );
    })) {
      delete result[formViewNameKey];
    }
  }
  return result;
};

// 300ms was chosen empirically as a reasonable default
var DEBOUNCE_TIMEOUT = 300;
var DataForm = exports.DataForm = function DataForm(_ref) {
  var children = _ref.children,
    footer = _ref.footer,
    onDone = _ref.onDone,
    pad = _ref.pad,
    _ref$updateOn = _ref.updateOn,
    updateOn = _ref$updateOn === void 0 ? 'submit' : _ref$updateOn,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  var _useContext = (0, _react.useContext)(_DataContext.DataContext),
    messages = _useContext.messages,
    onView = _useContext.onView,
    view = _useContext.view,
    views = _useContext.views;
  var _useContext2 = (0, _react.useContext)(_MessageContext.MessageContext),
    format = _useContext2.format;
  var _useState = (0, _react.useState)(viewToFormValue(view)),
    formValue = _useState[0],
    setFormValue = _useState[1];
  // special case for range selectors which always have a value.
  // when value returns to its min/max, remove it from view
  // like other properties
  var pendingReset = (0, _react.useRef)(new Set());
  var contextValue = (0, _react.useMemo)(function () {
    return {
      inDataForm: true,
      pendingReset: pendingReset
    };
  }, []);
  var debounce = (0, _useDebounce.useDebounce)(DEBOUNCE_TIMEOUT);
  var onSubmit = (0, _react.useCallback)(function (_ref2) {
    var value = _ref2.value;
    var nextValue = normalizeValue(value, formValue, views, pendingReset);
    resetPage(nextValue, formValue);
    setFormValue(nextValue);
    onView(formValueToView(nextValue, views));
    if (onDone) onDone();
  }, [formValue, onDone, onView, views]);
  var onChange = (0, _react.useCallback)(function (value, _ref3) {
    var touched = _ref3.touched;
    var nextValue = normalizeValue(value, formValue, views, pendingReset);
    resetPage(nextValue, formValue);
    setFormValue(nextValue);
    if (updateOn === 'change') {
      // debounce search
      if (touched[formSearchKey]) {
        debounce(function () {
          return function () {
            return onView(formValueToView(nextValue, views));
          };
        });
      } else {
        onView(formValueToView(nextValue, views));
      }
    }
  }, [debounce, formValue, onView, updateOn, views]);
  (0, _react.useEffect)(function () {
    return setFormValue(viewToFormValue(view));
  }, [view]);
  var content = children;
  if (footer !== false && updateOn === 'submit' || pad) {
    content = /*#__PURE__*/_react["default"].createElement(_Box.Box, {
      fill: "vertical"
    }, /*#__PURE__*/_react["default"].createElement(_Box.Box, {
      flex: true,
      overflow: "auto",
      pad: {
        horizontal: pad,
        top: pad
      }
    }, /*#__PURE__*/_react["default"].createElement(_Box.Box, {
      flex: false
    }, content)), footer !== false && updateOn === 'submit' && /*#__PURE__*/_react["default"].createElement(_Footer.Footer, {
      flex: false,
      margin: {
        top: 'medium'
      },
      pad: {
        horizontal: pad,
        bottom: pad
      },
      gap: "small"
    }, /*#__PURE__*/_react["default"].createElement(_Button.Button, {
      label: format({
        id: 'dataForm.submit',
        messages: messages == null ? void 0 : messages.dataForm
      }),
      type: "submit",
      primary: true
    })));
  }
  return /*#__PURE__*/_react["default"].createElement(MaxForm, _extends({}, rest, {
    value: formValue,
    onSubmit: updateOn === 'submit' ? onSubmit : undefined,
    onChange: onChange
  }), /*#__PURE__*/_react["default"].createElement(_DataFormContext.DataFormContext.Provider, {
    value: contextValue
  }, content));
};