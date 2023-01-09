import PropTypes from 'prop-types';
import { imageType } from 'common/prop-types/image.js';

const commentType = PropTypes.exact({
  id: PropTypes.number.isRequired,
  body: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  deletedAt: PropTypes.string,
  postId: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  likeCount: PropTypes.string.isRequired,
  dislikeCount: PropTypes.string.isRequired,
  user: PropTypes.exact({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    imageId: PropTypes.number,
    image: imageType
  }).isRequired
});

export { commentType };
