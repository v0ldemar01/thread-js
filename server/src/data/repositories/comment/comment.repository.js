import { Abstract } from '../abstract/abstract.repository.js';
import {
  getReactionsQuery
} from './helpers.js';

class Comment extends Abstract {
  constructor({ commentModel }) {
    super(commentModel);
  }

  getById(id) {
    return this.model
      .query()
      .select(
        'comments.*',
        getReactionsQuery(this.model)(true),
        getReactionsQuery(this.model)(false)
      )
      .findById(id)
      .withGraphFetched('[user.image]');
  }

  getByIdWithUserAndReactions(id) {
    return this.model
      .query()
      .select(
        'id',
        'userId',
        getReactionsQuery(this.model)(true),
        getReactionsQuery(this.model)(false)
      )
      .where({ id })
      .first();
  }
}

export { Comment };
