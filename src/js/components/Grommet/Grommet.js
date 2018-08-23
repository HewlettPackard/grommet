import React, { Component } from 'react';

import IconThemeContext from 'grommet-icons/ThemeContext';

import { ResponsiveContext, ThemeContext } from '../../contexts';
import baseTheme from '../../themes/base';
import { colorIsDark, deepMerge } from '../../utils';
import { withIconTheme } from '../hocs';

import StyledGrommet from './StyledGrommet';
import doc from './doc';

class Grommet extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { iconTheme, theme } = nextProps;
    const { theme: stateTheme, themeProp, iconThemeProp } = prevState;

    let nextTheme;
    if (theme && (theme !== themeProp || iconTheme !== iconThemeProp)) {
      nextTheme = deepMerge(baseTheme, theme);
    } else if (!theme && (themeProp || !stateTheme)) {
      nextTheme = baseTheme;
    }

    if (nextTheme) {
      const color = nextTheme.global.colors.background;
      const dark = color ? colorIsDark(color) : false;
      const lightIconTheme = deepMerge(iconTheme, nextTheme.icon);
      const iconThemes = {
        dark: deepMerge(lightIconTheme, {
          color: nextTheme.global.text.color.dark,
        }),
        light: lightIconTheme,
      };
      return {
        theme: {
          ...nextTheme,
          dark,
          icon: dark ? iconThemes.dark : iconThemes.light,
          iconThemes,
        },
        themeProp: theme,
        iconThemeProp: iconTheme,
      };
    }
    return null;
  }

  state = {}

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    const { theme, responsive } = this.state;
    if (window.innerWidth > theme.global.breakpoints.narrow) {
      if (responsive !== 'wide') {
        this.setState({ responsive: 'wide' });
      }
    } else if (responsive !== 'narrow') {
      this.setState({ responsive: 'narrow' });
    }
  }

  render() {
    const { children, ...rest } = this.props;
    delete rest.theme;
    const { responsive, theme } = this.state;

    return (
      <ThemeContext.Provider value={theme}>
        <IconThemeContext.Provider value={theme.icon}>
          <ResponsiveContext.Provider value={responsive}>
            <StyledGrommet {...rest} theme={theme}>
              {children}
            </StyledGrommet>
          </ResponsiveContext.Provider>
        </IconThemeContext.Provider>
      </ThemeContext.Provider>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  doc(Grommet);
}

export default withIconTheme(Grommet);
