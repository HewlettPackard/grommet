import PropTypes from 'prop-types';
import { alignPropType, widthPropType } from '../../utils/general-prop-types';

let PropType = {};
if (process.env.NODE_ENV !== 'production') {
  PropType = {
    align: alignPropType,
    layout: PropTypes.oneOfType(['column', 'grid']),
    nameProps: PropTypes.shape({
      align: alignPropType,
      width: PropType.oneOfType(
        widthPropType,
        PropTypes.arrayOf(PropTypes.string),
      ),
    }),
    pairProps: PropTypes.shape({
      direction: PropTypes.oneOf(['row', 'column', 'column-reverse']),
    }),
    valueProps: PropTypes.shape({
      align: alignPropType,
      width: PropType.oneOfType(
        widthPropType,
        PropTypes.arrayOf(PropTypes.string),
      ),
    }),
  };
}
export const NameValueListType = PropType;
