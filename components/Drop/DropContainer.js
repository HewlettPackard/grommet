"use strict";

exports.__esModule = true;
exports.DropContainer = void 0;
var _react = _interopRequireWildcard(require("react"));
var _styledComponents = require("styled-components");
var _ContainerTargetContext = require("../../contexts/ContainerTargetContext");
var _FocusedContainer = require("../FocusedContainer");
var _utils = require("../../utils");
var _defaultProps = require("../../default-props");
var _Box = require("../Box");
var _Keyboard = require("../Keyboard");
var _StyledDrop = require("./StyledDrop");
var _OptionsContext = require("../../contexts/OptionsContext");
var _excluded = ["a11yTitle", "aria-label", "align", "background", "onAlign", "children", "dropTarget", "elevation", "onClickOutside", "onEsc", "onKeyDown", "overflow", "plain", "responsive", "restrictFocus", "stretch", "trapFocus"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
// using react synthetic event to be able to stop propagation that
// would otherwise close the layer on ESC.
var preventLayerClose = function preventLayerClose(event) {
  var key = event.keyCode ? event.keyCode : event.which;
  if (key === 27) {
    event.stopPropagation();
  }
};

// Gets the closest ancestor positioned element
var getParentNode = function getParentNode(element) {
  var _element$offsetParent;
  return (_element$offsetParent = element.offsetParent) != null ? _element$offsetParent : element.parentNode;
};

// return the containing block
var getContainingBlock = function getContainingBlock(element) {
  var currentNode = getParentNode(element);
  while (currentNode instanceof window.HTMLElement && !['html', 'body'].includes(currentNode.nodeName.toLowerCase())) {
    var _currentNode;
    var css = window.getComputedStyle(currentNode);
    // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
    if ((css.transform ? css.transform !== 'none' : false) || (css.perspective ? css.perspective !== 'none' : false) || (css.backdropFilter ? css.backdropFilter !== 'none' : false) || css.contain === 'paint' || ['transform', 'perspective'].includes(css.willChange) || css.willChange === 'filter' || (css.filter ? css.filter !== 'none' : false)) {
      return currentNode;
    }
    currentNode = (_currentNode = currentNode) == null ? void 0 : _currentNode.parentNode;
  }
  return null;
};
var defaultAlign = {
  top: 'top',
  left: 'left'
};
var DropContainer = /*#__PURE__*/(0, _react.forwardRef)(function (_ref, ref) {
  var a11yTitle = _ref.a11yTitle,
    ariaLabel = _ref['aria-label'],
    _ref$align = _ref.align,
    align = _ref$align === void 0 ? defaultAlign : _ref$align,
    background = _ref.background,
    onAlign = _ref.onAlign,
    children = _ref.children,
    dropTarget = _ref.dropTarget,
    elevation = _ref.elevation,
    onClickOutside = _ref.onClickOutside,
    onEsc = _ref.onEsc,
    onKeyDown = _ref.onKeyDown,
    _ref$overflow = _ref.overflow,
    overflow = _ref$overflow === void 0 ? 'auto' : _ref$overflow,
    plain = _ref.plain,
    _ref$responsive = _ref.responsive,
    responsive = _ref$responsive === void 0 ? true : _ref$responsive,
    restrictFocus = _ref.restrictFocus,
    _ref$stretch = _ref.stretch,
    stretch = _ref$stretch === void 0 ? 'width' : _ref$stretch,
    trapFocus = _ref.trapFocus,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  var containerTarget = (0, _react.useContext)(_ContainerTargetContext.ContainerTargetContext);
  var theme = (0, _react.useContext)(_styledComponents.ThemeContext) || _defaultProps.defaultProps.theme;
  // dropOptions was created to preserve backwards compatibility
  var _useContext = (0, _react.useContext)(_OptionsContext.OptionsContext),
    dropOptions = _useContext.drop;
  var portalContext = (0, _react.useContext)(_utils.PortalContext);
  var portalId = (0, _react.useMemo)(function () {
    return portalContext.length;
  }, [portalContext]);
  var nextPortalContext = (0, _react.useMemo)(function () {
    return [].concat(portalContext, [portalId]);
  }, [portalContext, portalId]);
  var dropRef = (0, _utils.useForwardedRef)(ref);
  (0, _react.useEffect)(function () {
    var onClickDocument = function onClickDocument(event) {
      // determine which portal id the target is in, if any
      var clickedPortalId = null;
      var node = event.composed && event.composedPath()[0] || event.target;
      while (clickedPortalId === null && node && node !== document && !(node instanceof ShadowRoot)) {
        var attr = node.getAttribute('data-g-portal-id');
        if (attr !== null) clickedPortalId = parseInt(attr, 10);
        node = node.parentNode;
      }
      if (clickedPortalId === null || portalContext.indexOf(clickedPortalId) !== -1) {
        onClickOutside(event);
      }
    };
    if (onClickOutside) {
      document.addEventListener('mousedown', onClickDocument);
    }
    return function () {
      if (onClickOutside) {
        document.removeEventListener('mousedown', onClickDocument);
      }
    };
  }, [onClickOutside, containerTarget, portalContext]);
  (0, _react.useEffect)(function () {
    var target = (dropTarget == null ? void 0 : dropTarget.current) || dropTarget;
    var notifyAlign = function notifyAlign() {
      var _dropRef$current;
      var styleCurrent = dropRef == null || (_dropRef$current = dropRef.current) == null ? void 0 : _dropRef$current.style;
      var alignControl = (styleCurrent == null ? void 0 : styleCurrent.top) !== '' ? 'top' : 'bottom';
      onAlign(alignControl);
    };

    // We try to preserve the maxHeight as changing it causes any scroll
    // position to be lost. We set the maxHeight on mount and if the window
    // is resized.
    var place = function place(preserveHeight) {
      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;
      var container = dropRef.current;
      if (container && target) {
        var _containingBlockRect$, _containingBlockRect, _containingBlockRect$2, _containingBlockRect2, _containingBlockRect$3, _containingBlockRect3, _containingBlock$scro, _containingBlock2, _containingBlock$scro2, _containingBlock3;
        // clear prior styling
        container.style.left = '';
        container.style.top = '';
        container.style.bottom = '';
        container.style.width = '';
        if (!preserveHeight) {
          container.style.maxHeight = '';
        }
        // get bounds
        var targetRect = target.getBoundingClientRect();
        var containerRect = container.getBoundingClientRect();
        // determine width
        var width;
        if (stretch) {
          width = Math.min(stretch === 'align' ? Math.min(targetRect.width, containerRect.width) : Math.max(targetRect.width, containerRect.width), windowWidth);
        } else {
          width = Math.min(containerRect.width, windowWidth);
        }
        // set left position
        var left;
        if (align.left) {
          if (align.left === 'left') {
            left = targetRect.left;
          } else if (align.left === 'right') {
            left = targetRect.left + targetRect.width;
          }
        } else if (align.right) {
          if (align.right === 'left') {
            left = targetRect.left - width;
          } else if (align.right === 'right') {
            left = targetRect.left + targetRect.width - width;
          }
        } else {
          left = targetRect.left + targetRect.width / 2 - width / 2;
        }
        if (left + width > windowWidth) {
          left -= left + width - windowWidth;
        } else if (left < 0) {
          left = 0;
        }
        // set top or bottom position
        var top;
        var bottom;
        var maxHeight = containerRect.height;

        /* If responsive is true and the Drop doesn't have enough room
          to be fully visible and there is more room in the other
          direction, change the Drop to display above/below. If there is
          less room in the other direction leave the Drop in its current
          position. */
        if (responsive && (align.top === 'top' && targetRect.top < 0 || align.bottom === 'top' && targetRect.top - containerRect.height <= 0 && targetRect.bottom + containerRect.height < windowHeight)) {
          top = targetRect.bottom;
          maxHeight = top;
        } else if (responsive && (align.bottom === 'bottom' && targetRect.bottom > windowHeight || align.top === 'bottom' && targetRect.bottom + containerRect.height >= windowHeight && targetRect.top - containerRect.height > 0)) {
          bottom = targetRect.top;
          maxHeight = bottom;
        } else if (align.top === 'top') {
          top = targetRect.top;
          maxHeight = windowHeight - top;
        } else if (align.top === 'bottom') {
          top = targetRect.bottom;
          maxHeight = windowHeight - top;
        } else if (align.bottom === 'top') {
          bottom = targetRect.top;
          maxHeight = bottom;
        } else if (align.bottom === 'bottom') {
          bottom = targetRect.bottom;
          maxHeight = bottom;
        } else {
          top = targetRect.top + targetRect.height / 2 - containerRect.height / 2;
        }
        var containingBlock;
        var containingBlockRect;
        // dropOptions was created to preserve backwards compatibility
        if (dropOptions != null && dropOptions.checkContainingBlock) {
          var _containingBlock;
          // return the containing block for absolute elements or `null`
          // for fixed elements
          containingBlock = getContainingBlock(container);
          containingBlockRect = (_containingBlock = containingBlock) == null ? void 0 : _containingBlock.getBoundingClientRect();
        }

        // compute viewport offsets
        var viewportOffsetLeft = (_containingBlockRect$ = (_containingBlockRect = containingBlockRect) == null ? void 0 : _containingBlockRect.left) != null ? _containingBlockRect$ : 0;
        var viewportOffsetTop = (_containingBlockRect$2 = (_containingBlockRect2 = containingBlockRect) == null ? void 0 : _containingBlockRect2.top) != null ? _containingBlockRect$2 : 0;
        var viewportOffsetBottom = (_containingBlockRect$3 = (_containingBlockRect3 = containingBlockRect) == null ? void 0 : _containingBlockRect3.bottom) != null ? _containingBlockRect$3 : windowHeight;
        var containerOffsetLeft = (_containingBlock$scro = (_containingBlock2 = containingBlock) == null ? void 0 : _containingBlock2.scrollLeft) != null ? _containingBlock$scro : 0;
        var containerOffsetTop = (_containingBlock$scro2 = (_containingBlock3 = containingBlock) == null ? void 0 : _containingBlock3.scrollTop) != null ? _containingBlock$scro2 : 0;
        container.style.left = left - viewportOffsetLeft + containerOffsetLeft + "px";
        if (stretch) {
          // offset width by 0.1 to avoid a bug in ie11 that
          // unnecessarily wraps the text if width is the same
          // NOTE: turned off for now
          container.style.width = width + 0.1 + "px";
        }
        // the (position:absolute + scrollTop)
        // is presenting issues with desktop scroll flickering
        if (top !== '') {
          container.style.top = top - viewportOffsetTop + containerOffsetTop + "px";
        }
        if (bottom !== '') {
          container.style.bottom = viewportOffsetBottom - bottom - containerOffsetTop + "px";
        }
        if (!preserveHeight) {
          if (theme.drop && theme.drop.maxHeight) {
            maxHeight = Math.min(maxHeight, (0, _utils.parseMetricToNum)(theme.drop.maxHeight));
          }
          container.style.maxHeight = maxHeight + "px";
        }
      }
      if (onAlign) notifyAlign();
    };
    var scrollParents;
    var addScrollListeners = function addScrollListeners() {
      scrollParents = (0, _utils.findScrollParents)(target);
      scrollParents.forEach(function (scrollParent) {
        return scrollParent.addEventListener('scroll', place);
      });
    };
    var removeScrollListeners = function removeScrollListeners() {
      scrollParents.forEach(function (scrollParent) {
        return scrollParent.removeEventListener('scroll', place);
      });
      scrollParents = [];
    };
    var onResize = function onResize() {
      removeScrollListeners();
      addScrollListeners();
      place(false);
    };
    addScrollListeners();
    window.addEventListener('resize', onResize);
    place(false);
    return function () {
      removeScrollListeners();
      window.removeEventListener('resize', onResize);
    };
  }, [align, containerTarget, onAlign, dropTarget, portalContext, portalId, responsive, restrictFocus, stretch, theme.drop, dropRef, dropOptions]);
  (0, _react.useEffect)(function () {
    if (restrictFocus) {
      dropRef.current.focus();
    }
  }, [dropRef, restrictFocus]);
  var content = /*#__PURE__*/_react["default"].createElement(_StyledDrop.StyledDrop, _extends({
    "aria-label": a11yTitle || ariaLabel,
    ref: dropRef,
    as: _Box.Box,
    background: background,
    plain: plain,
    elevation: !plain ? elevation || theme.global.drop.elevation || theme.global.drop.shadowSize ||
    // backward compatibility
    'small' : undefined,
    tabIndex: "-1",
    alignProp: align,
    overflow: overflow,
    "data-g-portal-id": portalId
  }, rest), children);
  var themeContextValue = (0, _react.useMemo)(function () {
    var dark;
    if (background || theme.global.drop.background) {
      dark = (0, _utils.backgroundIsDark)(background || theme.global.drop.background, theme);
    }
    return _extends({}, theme, {
      dark: dark
    });
  }, [background, theme]);
  var dark = themeContextValue.dark;
  if (dark !== undefined && dark !== theme.dark) {
    content = /*#__PURE__*/_react["default"].createElement(_styledComponents.ThemeContext.Provider, {
      value: themeContextValue
    }, content);
  }
  return /*#__PURE__*/_react["default"].createElement(_utils.PortalContext.Provider, {
    value: nextPortalContext
  }, /*#__PURE__*/_react["default"].createElement(_FocusedContainer.FocusedContainer, {
    onKeyDown: onEsc && preventLayerClose,
    trapFocus: trapFocus
  }, /*#__PURE__*/_react["default"].createElement(_Keyboard.Keyboard
  // should capture keyboard event before other elements,
  // such as Layer
  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
  , {
    capture: true,
    onEsc: onEsc ? function (event) {
      event.stopPropagation();
      onEsc(event);
    } : undefined,
    onKeyDown: onKeyDown,
    target: "document"
  }, content)));
});
exports.DropContainer = DropContainer;