import PropTypes from 'prop-types';

import { getFromNowTime } from 'helpers/helpers';
import { IconName } from 'common/enums/enums';
import { postType } from 'common/prop-types/prop-types';
import { IconButton, Image, Tooltip, UserReaction } from 'components/common/common';

import styles from './styles.module.scss';

const Post = ({
  post,
  isOwnPost,
  onPostLike,
  onExpandedPostToggle,
  onEditingPost,
  onPostDislike,
  onDeletePost,
  onSharePost
}) => {
  const {
    id,
    image,
    body,
    user,
    likes,
    dislikes,
    commentCount,
    createdAt
  } = post;
  const date = getFromNowTime(createdAt);

  const handlePostLike = () => onPostLike(id);
  const handlePostDislike = () => onPostDislike(id);
  const handleExpandedPostToggle = () => onExpandedPostToggle(id);
  const handleEditingPost = () => onEditingPost(id);
  const handleDeletePost = () => onDeletePost(id);
  const handleSharePost = () => onSharePost(id);

  return (
    <div className={styles.card}>
      {image && <Image src={image.link} alt="post image" />}
      <div className={styles.content}>
        <div className={styles.meta}>
          <span>{`posted by ${user.username} - ${date}`}</span>
        </div>
        {isOwnPost && (
          <div className={styles.actions}>
            <IconButton
              iconName={IconName.EDIT}
              onClick={handleEditingPost}
            />
            <IconButton
              iconName={IconName.DELETE}
              onClick={handleDeletePost}
            />
          </div>
        )}
        <p className={styles.description}>{body}</p>
      </div>
      <div className={styles.extra}>
        <Tooltip
          content={likes.length ? likes.map(({ user: userReaction }) => (
            <UserReaction user={userReaction} />
          )) : 'No likes yet'}
          direction="top"
        >
          <IconButton
            iconName={IconName.THUMBS_UP}
            label={likes?.length}
            onClick={handlePostLike}
          />
        </Tooltip>
        <Tooltip
          content={dislikes.length ? dislikes.map(({ user: userReaction }) => (
            <UserReaction user={userReaction} />
          )) : 'No dislikes'}
          direction="top"
        >
          <IconButton
            iconName={IconName.THUMBS_DOWN}
            label={dislikes?.length}
            onClick={handlePostDislike}
          />
        </Tooltip>
        <IconButton
          iconName={IconName.COMMENT}
          label={commentCount}
          onClick={handleExpandedPostToggle}
        />
        <IconButton
          iconName={IconName.SHARE_ALTERNATE}
          onClick={handleSharePost}
        />
      </div>
    </div>
  );
};

Post.propTypes = {
  post: postType.isRequired,
  isOwnPost: PropTypes.bool.isRequired,
  onPostLike: PropTypes.func.isRequired,
  onPostDislike: PropTypes.func.isRequired,
  onExpandedPostToggle: PropTypes.func.isRequired,
  onEditingPost: PropTypes.func.isRequired,
  onDeletePost: PropTypes.func.isRequired,
  onSharePost: PropTypes.func.isRequired
};

export { Post };
