import { PostUserMode } from '../../../common/enums/enums.js';

const getCommentsCountQuery = model => model.relatedQuery('comments').count().as('commentCount');

const getReactionsQuery = model => isLike => {
  const col = isLike ? 'likeCount' : 'dislikeCount';

  return model.relatedQuery('postReactions')
    .count()
    .where({ isLike })
    .as(col);
};

const getWhereUserIdByModeQuery = (userId, userMode) => builder => {
  if (userMode === PostUserMode.INCLUDE && userId) {
    builder.where('posts.userId', userId);
    return;
  }
  if (userMode === PostUserMode.EXCLUDE && userId) {
    builder.whereNot('posts.userId', userId);
  }
  if (userMode === PostUserMode.LIKED_BY_OWN && userId) {
    builder
      .where('likes.userId', userId);
  }
};

export {
  getWhereUserIdByModeQuery,
  getCommentsCountQuery,
  getReactionsQuery
};
