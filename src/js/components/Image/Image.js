import { StyledImage } from './StyledImage';

let ImageDoc;
if (process.env.NODE_ENV !== 'production') {
  ImageDoc = require('./doc').doc(StyledImage); // eslint-disable-line global-require
}
const ImageWrapper = ImageDoc || StyledImage;
ImageWrapper.displayName = 'Image';

export { ImageWrapper as Image };
