import PropTypes from 'prop-types';
import { colorPropType } from '../../utils/general-prop-types';

let PropType = {};
if (process.env.NODE_ENV !== 'production') {
  PropType = {
    a11yTitle: PropTypes.string,
    color: PropTypes.oneOfType([
      PropTypes.oneOfType([
        colorPropType,
        PropTypes.shape({
          dark: colorPropType.isRequired,
          light: colorPropType.isRequired,
        }),
      ]),
      PropTypes.arrayOf(
        PropTypes.shape({
          color: PropTypes.oneOfType([
            colorPropType.isRequired,
            PropTypes.shape({
              dark: colorPropType.isRequired,
              light: colorPropType.isRequired,
            }),
          ]),
          value: PropTypes.number.isRequired,
          opacity: PropTypes.number,
        }),
      ),
    ]),
    id: PropTypes.string,
    min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
    onChange: PropTypes.func,
    step: PropTypes.number,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };
}
export const RangeInputPropTypes = PropType;
