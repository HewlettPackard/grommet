import React, { Component } from 'react';
import { compose } from 'recompose';

import { Button } from '../Button';
import { Drop } from '../Drop';
import { withTheme } from '../hocs';

import doc from './doc';

class DropButton extends Component {
  state = {
    showDrop: false,
  }

  componentWillReceiveProps({ open }) {
    const { showDrop } = this.state;
    if (open !== showDrop) {
      this.setState({ showDrop: open });
    }
  }

  componentDidMount() {
    const { open } = this.props;
    // if the drop is open during first mount we need to call render again to retreive
    // the right ref
    if (open) {
      /* eslint-disable react/no-did-mount-set-state */
      this.setState({ showDrop: true });
      /* eslint-enable react/no-did-mount-set-state */
    }
  }

  onDropClose = () => {
    const { onClose } = this.props;
    this.setState({
      showDrop: false,
    }, () => {
      if (onClose) {
        onClose();
      }
    });
  }

  render() {
    const {
      a11yTitle,
      children,
      control,
      id,
      theme,
      ...rest
    } = this.props;
    const { showDrop } = this.state;

    let drop;
    if (showDrop) {
      drop = (
        <Drop
          key='drop-button__drop'
          restrictFocus={true}
          id={id ? `drop-button__${id}` : undefined}
          align={{ top: 'bottom', left: 'left' }}
          ref={(ref) => {
            this.dropRef = ref;
          }}
          control={this.componentRef}
          onClose={this.onDropClose}
        >
          {children}
        </Drop>
      );
    }

    return [
      <Button
        fill={true}
        key='drop-button__button'
        id={id}
        ref={(ref) => {
          this.componentRef = ref;
        }}
        a11yTitle={a11yTitle || 'Open Drop'}
        onClick={() => this.setState({ showDrop: !this.state.showDrop })}
        {...rest}
      >
        {control}
      </Button>,
      drop,
    ];
  }
}

if (process.env.NODE_ENV !== 'production') {
  doc(DropButton);
}

export default compose(
  withTheme,
)(DropButton);
