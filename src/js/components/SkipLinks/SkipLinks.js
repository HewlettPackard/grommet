import React, {
  Children,
  cloneElement,
  useContext,
  useRef,
  useState,
} from 'react';
import { ThemeContext } from 'styled-components';

import { Box } from '../Box';
import { Text } from '../Text';
import { Layer } from '../Layer';
import { defaultProps } from '../../default-props';
import { MessageContext } from '../../contexts/MessageContext';

const SkipLinks = ({ children, id, messages }) => {
  const theme = useContext(ThemeContext) || defaultProps.theme;
  const [showLayer, setShowLayer] = useState(false);
  const { format } = useContext(MessageContext);
  const layerRef = useRef(null);

  const onFocus = () => {
    setShowLayer(true);
  };

  const removeLayer = () => {
    setShowLayer(false);
  };

  const onBlur = () => {
    // timeout needed so it gives enough time for activeElement to be updated
    setTimeout(() => {
      const layerNode = layerRef.current;
      if (layerNode && !layerNode.contains(document.activeElement)) {
        // close the layer when the activeElement isn't contained in the layer
        removeLayer();
      }
    }, 0);
  };

  return (
    <Layer
      id={id}
      position={showLayer ? theme.skipLinks.position : 'hidden'}
      ref={layerRef}
      onFocus={onFocus}
      onBlur={onBlur}
      modal={false}
      // Prepend the Layer so any SkipLink will be the first element that
      // pressing the Tab key reaches, targetChildPosition triggers prepend.
      targetChildPosition="first"
      // Non-modal Layer's will take the full screen at small breakpoints
      // by default, which isn't what we want, hence setting responsive false
      responsive={false}
    >
      <Box {...theme.skipLinks.container}>
        <Text {...theme.skipLinks.label}>{
          format({ id: 'grommet.skipLinks.skipTo', messages })}
        </Text>
        <Box align="center" gap="medium">
          {Children.map(children, (child, index) =>
            cloneElement(child, {
              key: `skip-link-${index}`,
              onClick: removeLayer,
            }),
          )}
        </Box>
      </Box>
    </Layer>
  );
};

SkipLinks.defaultProps = {
};

let SkipLinksDoc;
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  SkipLinksDoc = require('./doc').doc(SkipLinks);
}
const SkipLinksWrapper = SkipLinksDoc || SkipLinks;

export { SkipLinksWrapper as SkipLinks };
