import PropTypes from 'prop-types';

import { IconName } from 'common/enums/enums.js';
import { IconButton } from 'components/common/common.js';
import { commentType } from 'common/prop-types/prop-types.js';
import { DEFAULT_USER_AVATAR } from 'common/constants/constants.js';
import { getFromNowTime } from 'helpers/helpers';

import styles from './styles.module.scss';

const Comment = ({
  comment: {
    id,
    body,
    createdAt,
    user,
    likeCount,
    dislikeCount
  },
  onCommentLike,
  onCommentDislike
}) => {
  const handleCommentLike = () => onCommentLike(id);
  const handleCommentDislike = () => onCommentDislike(id);

  return (
    <div>
      <div className={styles.comment}>
        <div>
          <img className={styles.avatar} src={user.image?.link ?? DEFAULT_USER_AVATAR} alt="avatar" />
        </div>
        <div>
          <div>
            <span className={styles.author}>{user.username}</span>
            <span className={styles.date}>{getFromNowTime(createdAt)}</span>
          </div>
          <p>{body}</p>
        </div>
      </div>
      <div className={styles.extra}>
        <IconButton
          iconName={IconName.THUMBS_UP}
          label={likeCount}
          onClick={handleCommentLike}
        />
        <IconButton
          iconName={IconName.THUMBS_DOWN}
          label={dislikeCount}
          onClick={handleCommentDislike}
        />
      </div>
    </div>

  );
};

Comment.propTypes = {
  comment: commentType.isRequired,
  onCommentLike: PropTypes.func.isRequired,
  onCommentDislike: PropTypes.func.isRequired
};

export { Comment };
