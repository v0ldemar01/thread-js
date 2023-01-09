const getCommentsCountQuery = model => model.relatedQuery('comments').count().as('commentCount');

const getReactionsQuery = model => isLike => {
  const col = isLike ? 'likeCount' : 'dislikeCount';

  return model.relatedQuery('postReactions')
    .count()
    .where({ isLike })
    .as(col);
};

const getWhereUserIdByModeQuery = (userId, userMode) => builder => {
  if (userMode === 'include' && userId) {
    builder.where('posts.userId', userId);
    return;
  }
  if (userMode === 'exclude' && userId) {
    builder.whereNot('posts.userId', userId);
  }
  if (userMode === 'likedByOwn' && userId) {
    builder
      .where('postReactions.isLike', true)
      .where('postReactions.userId', userId);
  }
};

export { getCommentsCountQuery, getReactionsQuery, getWhereUserIdByModeQuery };
