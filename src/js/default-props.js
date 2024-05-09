import { deepMerge } from './utils';
import { base } from './themes/base';

export const defaultProps = {
  theme: base,
};

export const extendDefaultTheme = theme => {
  defaultProps.theme = deepMerge(base, theme);
};

/*
  Pass `theme` for component which can be loacted outside of theme context.
  To be used as argument for `attrs` method from `styled-components`.
 */
export const ehnancePropsWithTheme = props => ({
  theme: deepMerge(defaultProps.theme, props.theme),
});
