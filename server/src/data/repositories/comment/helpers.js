const getReactionsQuery = model => isLike => {
  const col = isLike ? 'likeCount' : 'dislikeCount';

  return model.relatedQuery('commentReactions')
    .count()
    .where({ isLike })
    .as(col);
};

const getWhereUserIdQuery = userId => builder => {
  if (userId) {
    builder.where({ userId });
  }
};

export { getReactionsQuery, getWhereUserIdQuery };
