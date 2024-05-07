import { deepMerge } from './utils';
import { base } from './themes/base';

export const defaultProps = {
  theme: base,
};

export const extendDefaultTheme = theme => {
  defaultProps.theme = deepMerge(base, theme);
};

export const ehnancePropsWithDefault = props => ({
  ...defaultProps,
  ...props,
  theme: deepMerge(defaultProps.theme, props.theme),
});
