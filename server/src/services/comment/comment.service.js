/* eslint-disable no-return-assign */
class Comment {
  constructor({ commentRepository, commentReactionRepository }) {
    this._commentRepository = commentRepository;
    this._commentReactionRepository = commentReactionRepository;
  }

  create(userId, comment) {
    return this._commentRepository.create({
      ...comment,
      userId
    });
  }

  getById(id) {
    return this._commentRepository.getById(id);
  }

  update(id, comment) {
    return this._commentRepository.update(id, { ...comment });
  }

  async delete(id) {
    const deletedCount = await this._commentRepository.softDeleteById(id);

    return Boolean(deletedCount);
  }

  async setReaction(userId, { commentId, isLike = true }) {
    let action;
    const updateOrDelete = react => (react.isLike === isLike
      ? (action = 'remove', this._commentReactionRepository.deleteById(react.id))
      : (action = 'add', this._commentReactionRepository.updateById(react.id, { isLike })));

    const reaction = await this._commentReactionRepository.getCommentReaction(
      userId,
      commentId,
      isLike
    );

    if (reaction) {
      await updateOrDelete(reaction);
    } else {
      await this._commentReactionRepository.create({ userId, commentId, isLike });
      action = 'add';
    }

    const updatedComment = await this._commentRepository.getByIdWithUserAndReactions(commentId);

    return { ...updatedComment, action };
  }
}

export { Comment };
