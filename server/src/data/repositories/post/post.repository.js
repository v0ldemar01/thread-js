import { Abstract } from '../abstract/abstract.repository.js';
import {
  Comment as CommentModel
} from '../../models/comment/comment.model.js';
import {
  getWhereUserIdQuery,
  getCommentsCountQuery,
  getReactionsQuery as getPostReactionsQuery
} from './helpers.js';
import {
  getReactionsQuery as getCommentReactionsQuery
} from '../comment/helpers.js';

class Post extends Abstract {
  constructor({ postModel }) {
    super(postModel);
  }

  getOnes(filter) {
    const { from: offset, count: limit, userId } = filter;

    return this.model
      .query()
      .select(
        'posts.*',
        getCommentsCountQuery(this.model),
        getPostReactionsQuery(this.model)(true),
        getPostReactionsQuery(this.model)(false)
      )
      .where(getWhereUserIdQuery(userId))
      .whereNull('deletedAt')
      .withGraphFetched('[image, user.image]')
      .orderBy('createdAt', 'desc')
      .offset(offset)
      .limit(limit);
  }

  getById(id) {
    return this.model
      .query()
      .select(
        'posts.*',
        getCommentsCountQuery(this.model),
        getPostReactionsQuery(this.model)(true),
        getPostReactionsQuery(this.model)(false)
      )
      .where({ id })
      .withGraphFetched('[comments(onlyNotDeleted).user.image, user.image, image]')
      .modifiers({
        onlyNotDeleted(builder) {
          builder.whereNull('deletedAt');
        }
      })
      .modifyGraph('comments', builder => {
        builder.select(
          'comments.*',
          getCommentReactionsQuery(CommentModel)(true),
          getCommentReactionsQuery(CommentModel)(false)
        );
      })
      .first();
  }

  getByIdWithUserAndReactions(id) {
    return this.model
      .query()
      .select(
        'id',
        'userId',
        getPostReactionsQuery(this.model)(true),
        getPostReactionsQuery(this.model)(false)
      )
      .where({ id })
      .first();
  }

  update(id, { imageId, body }) {
    return this.model
      .query()
      .patchAndFetchById(id, { imageId, body });
  }
}

export { Post };
