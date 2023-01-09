import { Model } from 'objection';

import { DbTableName } from '../../../common/enums/enums.js';
import { Abstract as AbstractModel } from '../abstract/abstract.model.js';
import { Comment as CommentModel } from '../comment/comment.model.js';
import { User as UserModel } from '../user/user.model.js';

class CommentReaction extends AbstractModel {
  static get tableName() {
    return DbTableName.COMMENT_REACTIONS;
  }

  static get jsonSchema() {
    const baseSchema = super.jsonSchema;

    return {
      type: baseSchema.type,
      required: ['isLike', 'userId', 'commentId'],
      properties: {
        ...baseSchema.properties,
        isLike: { type: 'boolean' },
        userId: { type: ['integer', 'null'] },
        commentId: { type: ['integer', 'null'] }
      }
    };
  }

  static get relationMappings() {
    return {
      comment: {
        relation: Model.HasOneRelation,
        modelClass: CommentModel,
        join: {
          from: `${DbTableName.COMMENT_REACTIONS}.commentId`,
          to: `${DbTableName.COMMENTS}.id`
        }
      },
      user: {
        relation: Model.HasOneRelation,
        modelClass: UserModel,
        filter: query => query.select('id', 'email', 'username'),
        join: {
          from: `${DbTableName.COMMENT_REACTIONS}.userId`,
          to: `${DbTableName.USERS}.id`
        }
      }
    };
  }

  static get modifiers() {
    return {
      withLikes(builder) {
        return builder.select().where({ isLike: true });
      },
      withDislikes(builder) {
        return builder.select().where({ isLike: false });
      }
    };
  }
}

export { CommentReaction };
