const getCommentsCountQuery = model => model.relatedQuery('comments').count().as('commentCount');

const getReactionsQuery = model => isLike => {
  const col = isLike ? 'likeCount' : 'dislikeCount';

  return model.relatedQuery('postReactions')
    .count()
    .where({ isLike })
    .as(col);
};

export { getCommentsCountQuery, getReactionsQuery };
