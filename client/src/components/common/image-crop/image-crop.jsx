import { PropTypes } from 'prop-types';
import ReactCrop from 'react-image-crop';
import { useRef, useState, forwardRef, useCallback } from 'hooks/hooks.js';
import { getCroppedImg } from './helpers/helpers.js';
import { DEFAULT_ASPECT } from './common/constants.js';

import 'react-image-crop/dist/ReactCrop.css';

const ImageCrop = forwardRef(({
  image,
  isExternalPreview,
  onCompleteCrop
}, ref) => {
  const [crop, setCrop] = useState(null);

  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const handleImageLoaded = useCallback(img => {
    imgRef.current = img;
  }, []);

  const handleCompleteCrop = async completedCrop => {
    onCompleteCrop(completedCrop);

    if ((ref ?? previewCanvasRef).current
      && imgRef.current
      && completedCrop.width
      && completedCrop.height
    ) {
      await getCroppedImg(
        imgRef.current,
        (ref ?? previewCanvasRef).current,
        completedCrop
      );
    }
  };

  return (
    <>
      {image && (
        <ReactCrop
          crop={crop}
          ruleOfThirds
          aspect={DEFAULT_ASPECT}
          onImageLoaded={handleImageLoaded}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          maxWidth={200}
          maxHeight={200}
          onComplete={handleCompleteCrop}
        >
          <img
            src={image}
            ref={imgRef}
            alt="Crop me"
          />
        </ReactCrop>
      )}
      {!isExternalPreview && (
        <div>
          <canvas
            ref={(ref ?? previewCanvasRef)}
          />
        </div>
      )}
    </>
  );
});

ImageCrop.propTypes = {
  image: PropTypes.string,
  isExternalPreview: PropTypes.bool,
  onCompleteCrop: PropTypes.func
};

ImageCrop.defaultProps = {
  image: null,
  isExternalPreview: false,
  onCompleteCrop: null
};

export { ImageCrop };
