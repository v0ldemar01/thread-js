import { Abstract } from '../abstract/abstract.repository.js';
import {
  getCommentsCountQuery,
  getWhereUserIdByModeQuery
} from './helpers.js';
import {
  getReactionsQuery as getCommentReactionsQuery
} from '../comment/helpers.js';

class Post extends Abstract {
  constructor({ postModel }) {
    super(postModel);
  }

  getPosts(filter) {
    const { from: offset, count: limit, userId, userMode } = filter;

    return this.model
      .query()
      .select(
        'posts.*',
        getCommentsCountQuery(this.model)
      )
      .whereNull('deletedAt')
      .where(getWhereUserIdByModeQuery(userId, userMode))
      .withGraphJoined(`[
        image,
        user.image,
        postReactions(withLikes) as likes .[user],
        postReactions(withDislikes) as dislikes .[user]
      ]`)
      .orderBy('createdAt', 'desc')
      .offset(offset)
      .limit(limit);
  }

  getById(id) {
    return this.model
      .query()
      .select(
        'posts.*',
        getCommentsCountQuery(this.model)
      )
      .where({ id })
      .withGraphFetched(`[
        image,
        user.image,
        comments(onlyNotDeleted).user.image,
        postReactions(withLikes) as likes .[user],
        postReactions(withDislikes) as dislikes .[user]
      ]`)
      .modifiers({
        onlyNotDeleted(builder) {
          builder.whereNull('deletedAt');
        }
      })
      .modifyGraph('comments', builder => {
        builder.select(
          'comments.*',
          getCommentReactionsQuery(this.model.relatedQuery('comments').modelClass())(true),
          getCommentReactionsQuery(this.model.relatedQuery('comments').modelClass())(false)
        );
      })
      .first();
  }

  getByIdWithUserAndReactions(id) {
    return this.model
      .query()
      .select(
        'posts.id'
      )
      .where('posts.id', id)
      .withGraphJoined(`[
        postReactions(withLikes) as likes .[user],
        postReactions(withDislikes) as dislikes .[user]
      ]`)
      .first();
  }

  update(id, { imageId, body }) {
    return this.model
      .query()
      .patchAndFetchById(id, { imageId, body });
  }
}

export { Post };
