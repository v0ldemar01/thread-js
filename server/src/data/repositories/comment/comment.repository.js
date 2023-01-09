import { Abstract } from '../abstract/abstract.repository.js';

class Comment extends Abstract {
  constructor({ commentModel }) {
    super(commentModel);
  }

  getById(id) {
    return this.model
      .query()
      .select(
        'comments.*'
      )
      .findById(id)
      .withGraphFetched(`[
        user.image,
        commentReactions(withLikes) as likes .[user],
        commentReactions(withDislikes) as dislikes .[user]
      ]`);
  }

  getByIdWithUserAndReactions(id) {
    return this.model
      .query()
      .select(
        'comments.*'
      )
      .where({ id })
      .withGraphFetched(`[
        commentReactions(withLikes) as likes .[user],
        commentReactions(withDislikes) as dislikes .[user]
      ]`)
      .first();
  }

  update(id, { body }) {
    return this.model
      .query()
      .patchAndFetchById(id, { body });
  }
}

export { Comment };
