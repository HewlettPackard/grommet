import React, { Children, Component } from 'react';
import { compose } from 'recompose';

import { withTheme } from 'styled-components';

import { normalizeColor } from '../../utils';
import { defaultProps } from '../../default-props';

import { Box } from '../Box';
import { Button } from '../Button';
import { Keyboard } from '../Keyboard';
import { Stack } from '../Stack';
import { withFocus } from '../hocs';

class Carousel extends Component {
  state = { activeIndex: 0 };

  componentDidMount() {
    const { play } = this.props;
    if (play) {
      this.play();
    }
  }

  componentDidUpdate(prevProps) {
    const { play } = this.props;
    if (play && (!prevProps.play || play !== prevProps.play)) {
      this.play();
    } else if (!play && prevProps.play) {
      clearInterval(this.timer);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  play = () => {
    const { play } = this.props;
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      const { children } = this.props;
      const { activeIndex } = this.state;
      const lastIndex = Children.count(children) - 1;
      if (activeIndex < lastIndex) {
        this.setState({
          activeIndex: activeIndex + 1,
          priorActiveIndex: activeIndex,
        });
      } else {
        this.setState({ activeIndex: 0, priorActiveIndex: activeIndex });
      }
    }, play);
  };

  onRight = () => {
    const { activeIndex } = this.state;
    clearInterval(this.timer);
    this.setState({
      activeIndex: activeIndex + 1,
      priorActiveIndex: activeIndex,
    });
  };

  onLeft = () => {
    const { activeIndex } = this.state;
    clearInterval(this.timer);
    this.setState({
      activeIndex: activeIndex - 1,
      priorActiveIndex: activeIndex,
    });
  };

  onSelect = index => () => {
    const { activeIndex } = this.state;
    clearInterval(this.timer);
    this.setState({ activeIndex: index, priorActiveIndex: activeIndex });
  };

  render() {
    const { children, fill, focus, theme, ...rest } = this.props;
    const { activeIndex, priorActiveIndex } = this.state;

    const lastIndex = Children.count(children) - 1;
    const onLeft = activeIndex > 0 ? this.onLeft : undefined;
    const onRight = activeIndex < lastIndex ? this.onRight : undefined;

    const CurrentIcon = theme.carousel.icons.current;
    const iconColor = normalizeColor(
      theme.carousel.icons.color || 'control',
      theme,
    );

    const selectors = [];
    const wrappedChildren = Children.map(children, (child, index) => {
      selectors.push(
        <Button
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          icon={
            <CurrentIcon
              color={activeIndex === index ? iconColor : undefined}
            />
          }
          onClick={this.onSelect(index)}
        />,
      );

      let animation;
      if (index === activeIndex) {
        if (priorActiveIndex !== undefined) {
          animation = {
            type: priorActiveIndex < activeIndex ? 'slideLeft' : 'slideRight',
            size: 'xlarge',
            duration: theme.carousel.animationDuration || 1000,
          };
        }
      } else if (index === priorActiveIndex) {
        animation = {
          type: 'fadeOut',
          duration: theme.carousel.animationDuration || 1000,
        };
      } else {
        animation = { type: 'fadeOut', duration: 0 };
      }

      return (
        <Box overflow="hidden">
          <Box animation={animation}>{child}</Box>
        </Box>
      );
    });

    const NextIcon = theme.carousel.icons.next;
    const PreviousIcon = theme.carousel.icons.previous;
    const NextIconDisabled = activeIndex >= lastIndex;
    const PreviousIconDisabled = activeIndex <= 0;

    return (
      <Keyboard onLeft={onLeft} onRight={onRight}>
        <Stack guidingChild={activeIndex} fill={fill} {...rest}>
          {wrappedChildren}
          <Box
            tabIndex="0"
            focus={focus}
            fill
            direction="row"
            justify="between"
          >
            <Button
              fill="vertical"
              icon={
                <PreviousIcon color={PreviousIconDisabled
                  ? theme.carousel.icons.disabledColor
                  : theme.carousel.icons.color}
                />}
              plain
              disabled={PreviousIconDisabled}
              onClick={onLeft}
              hoverIndicator
            />
            <Box justify="end">
              <Box direction="row" justify="center">
                {selectors}
              </Box>
            </Box>
            <Button
              fill="vertical"
              icon={
                <NextIcon color={NextIconDisabled
                  ? theme.carousel.icons.disabledColor
                  : theme.carousel.icons.color}
                />}
              plain
              disabled={NextIconDisabled}
              onClick={onRight}
              hoverIndicator
            />
          </Box>
        </Stack>
      </Keyboard>
    );
  }
}

Carousel.defaultProps = {};
Object.setPrototypeOf(Carousel.defaultProps, defaultProps);

let CarouselDoc;
if (process.env.NODE_ENV !== 'production') {
  CarouselDoc = require('./doc').doc(Carousel); // eslint-disable-line global-require
}
const CarouselWrapper = compose(
  withFocus(),
  withTheme,
)(CarouselDoc || Carousel);

export { CarouselWrapper as Carousel };
