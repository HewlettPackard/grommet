// (C) Copyright 2014-2015 Hewlett-Packard Development Company, L.P.

var React = require('react');

var BASE_CLASS = 'status-icon';
var CLASS_ROOT = 'status-icon-unknown';

var Unknown = React.createClass({

  propTypes: {
    small: React.PropTypes.bool,
    large: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      small: false,
      large: false
    };
  },

  render: function() {
    var classes = [BASE_CLASS, CLASS_ROOT]
    if (this.props.className) {
      classes.push(this.props.className);
    }
    if (this.props.large) {
      classes.push(BASE_CLASS + "--large");
    }
    if (this.props.small) {
      classes.push(BASE_CLASS + "--small");
    }
    return (
      <svg className={classes.join(' ')} viewBox="0 0 24 24" version="1.1">
      	<g className={"status-icon__base"} fill="#848484">
          <path d="M12,0 L0,12 L12,24 L24,12 L12,0 L12,0 Z"></path>
        </g>
        <g className={"status-icon__detail"} fill="#FFFFFF" transform="translate(7.524324, 4.994595)">
          <path d="M8.89945946,3.97621622 C8.89945946,4.48216216 8.64648649,4.98810811 8.39351351,5.49405405 C8.0172973,5.87027027 7.51135135,6.62918919 6.49945946,7.38810811 C5.99351351,7.76432432 5.74054054,8.14702703 5.6172973,8.4 L5.6172973,8.77621622 C5.49405405,9.02918919 5.49405405,9.53513514 5.49405405,10.1643243 L3.47027027,10.1643243 L3.47027027,9.53513514 C3.47027027,8.90594595 3.59351351,8.0172973 3.84648649,7.51135135 C3.96972973,7.13513514 4.47567568,6.62918919 5.23459459,5.99351351 C5.99351351,5.36432432 6.36972973,4.98162162 6.49945946,4.85837838 C6.75243243,4.60540541 6.87567568,4.35243243 6.87567568,3.97621622 C6.87567568,3.6 6.6227027,3.2172973 6.24648649,2.84108108 C5.87027027,2.46486486 5.23459459,2.33513514 4.60540541,2.33513514 C3.97621622,2.33513514 3.47027027,2.45837838 2.96432432,2.71135135 C2.58810811,2.96432432 2.20540541,3.34054054 2.08216216,3.84648649 L0.0583783784,3.84648649 C0.0583783784,2.83459459 0.564324324,1.95243243 1.32324324,1.19351351 C2.20540541,0.434594595 3.2172973,0.0583783784 4.48216216,0.0583783784 C5.87027027,0.0583783784 7.00540541,0.434594595 7.76432432,1.19351351 C8.51675676,1.95891892 8.89945946,2.96432432 8.89945946,3.97621622 L8.89945946,3.97621622 Z M4.47567568,10.9232432 C3.71675676,10.9232432 2.95783784,11.6821622 2.95783784,12.4410811 C2.95783784,13.2 3.71675676,13.9589189 4.47567568,13.9589189 C5.23459459,13.9589189 5.99351351,13.2 5.99351351,12.4410811 C5.99351351,11.6821622 5.23459459,10.9232432 4.47567568,10.9232432 L4.47567568,10.9232432 Z"></path>
      	</g>
      </svg>
    );
  }

});

module.exports = Unknown;
