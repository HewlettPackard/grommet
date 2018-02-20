import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { compose } from 'recompose';

import { colorForName, parseMetricToNum } from '../../utils';

import { withTheme } from '../hocs';

import StyledChart from './StyledChart';

import doc from './doc';

const renderBars = (values, bounds, scale, height) =>
  (values || []).map((valueArg, index) => {
    const { label, onHover, value, ...rest } = valueArg;

    const key = `p-${index}`;
    const bottom = (value.length === 2 ? bounds[1][0] : value[1]);
    const top = (value.length === 2 ? value[1] : value[2]);
    if (top !== 0) {
      const d = `M ${(value[0] - bounds[0][0]) * scale[0]},` +
      `${height - ((bottom - bounds[1][0]) * scale[1])}` +
      ` L ${(value[0] - bounds[0][0]) * scale[0]},` +
      `${height - ((top - bounds[1][0]) * scale[1])}`;

      let hoverProps;
      if (onHover) {
        hoverProps = {
          onMouseOver: () => onHover(true),
          onMouseLeave: () => onHover(false),
        };
      }

      return (
        <g key={key} fill='none'>
          <title>{label}</title>
          <path d={d} {...hoverProps} {...rest} />
        </g>
      );
    }
    return undefined;
  });

const renderLine = (values, bounds, scale, height, { onClick, onHover }) => {
  let d = '';
  (values || []).forEach(({ value }, index) => {
    d += `${index ? ' L' : 'M'} ${(value[0] - bounds[0][0]) * scale[0]},` +
    `${height - ((value[1] - bounds[1][0]) * scale[1])}`;
  });

  let hoverProps;
  if (onHover) {
    hoverProps = {
      onMouseOver: () => onHover(true),
      onMouseLeave: () => onHover(false),
    };
  }
  let clickProps;
  if (onClick) {
    clickProps = { onClick };
  }

  return (
    <g fill='none'>
      <path d={d} {...hoverProps} {...clickProps} />
    </g>
  );
};

const renderArea = (values, bounds, scale, height, { color, onClick, onHover, theme }) => {
  let d = '';
  (values || []).forEach(({ value }, index) => {
    const top = (value.length === 2 ? value[1] : value[2]);
    d += `${!index ? 'M' : ' L'} ${(value[0] - bounds[0][0]) * scale[0]},` +
    `${height - ((top - bounds[1][0]) * scale[1])}`;
  });
  (values || []).reverse().forEach(({ value }) => {
    const bottom = (value.length === 2 ? bounds[1][0] : value[1]);
    d += ` L ${value[0] * scale[0]},` +
    `${height - ((bottom - bounds[1][0]) * scale[1])}`;
  });
  d += ' Z';

  let hoverProps;
  if (onHover) {
    hoverProps = {
      onMouseOver: () => onHover(true),
      onMouseLeave: () => onHover(false),
    };
  }
  let clickProps;
  if (onClick) {
    clickProps = { onClick };
  }

  return (
    <g fill={colorForName(color, theme)}>
      <path d={d} {...hoverProps} {...clickProps} />
    </g>
  );
};

const normalizeBounds = (props) => {
  let bounds = props.bounds;
  if (!bounds) {
    bounds = [[0, 1], [0, 1]];
    (props.values || []).forEach((value) => {
      bounds[0][0] = Math.min(bounds[0][0], value.value[0]);
      bounds[0][1] = Math.max(bounds[0][1], value.value[0]);
      bounds[1][0] = Math.min(bounds[1][0], value.value[1]);
      bounds[1][1] = Math.max(bounds[1][1], value.value[1]);
    });
  }
  return bounds;
};

class Chart extends Component {
  static defaultProps = {
    color: 'accent-1',
    size: { width: 'medium', height: 'small' },
    thickness: 'medium',
    type: 'bar',
  };

  constructor(props, context) {
    super(props, context);
    this.state = { bounds: normalizeBounds(props), containerWidth: 0, containerHeight: 0 };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ bounds: normalizeBounds(nextProps) });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    const parent = findDOMNode(this.containerRef).parentNode;
    if (parent) {
      const rect = parent.getBoundingClientRect();
      this.setState({ containerWidth: rect.width, containerHeight: rect.height });
    }
  }

  render() {
    const {
      color, onClick, onHover, round, size, theme, thickness, type, values, ...rest
    } = this.props;
    const { bounds, containerWidth, containerHeight } = this.state;

    const sizeWidth = (typeof size === 'string') ? size : size.width || 'medium';
    const sizeHeight = (typeof size === 'string') ? size : size.height || 'medium';
    const width = (sizeWidth === 'full' ? containerWidth :
      parseMetricToNum(theme.global.size[sizeWidth]));
    const height = (sizeHeight === 'full' ? containerHeight :
      parseMetricToNum(theme.global.size[sizeHeight]));
    const strokeWidth = parseMetricToNum(theme.global.edgeSize[thickness]);
    const scale = [
      (width / (bounds[0][1] - bounds[0][0])),
      (height / (bounds[1][1] - bounds[1][0])),
    ];

    let contents;
    if (type === 'bar') {
      contents = renderBars(values, bounds, scale, height);
    } else if (type === 'line') {
      contents = renderLine(values, bounds, scale, height, this.props);
    } else if (type === 'area') {
      contents = renderArea(values, bounds, scale, height, this.props);
    }

    return (
      <StyledChart
        ref={(ref) => { this.containerRef = ref; }}
        viewBox={`-${strokeWidth / 2} -${strokeWidth / 2}
          ${width + strokeWidth} ${height + strokeWidth}`}
        preserveAspectRatio='xMinYMin meet'
        width={size === 'full' ? '100%' : width}
        height={size === 'full' ? '100%' : height}
        {...rest}
      >
        <g
          stroke={colorForName(color, theme)}
          strokeWidth={strokeWidth}
          strokeLinecap={round ? 'round' : 'butt'}
          strokeLinejoin={round ? 'round' : 'miter'}
        >
          {contents}
        </g>
      </StyledChart>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  doc(Chart);
}

export default compose(
  withTheme,
)(Chart);
