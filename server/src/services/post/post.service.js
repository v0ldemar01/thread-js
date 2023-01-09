/* eslint-disable no-return-assign */
class Post {
  constructor({ postRepository, postReactionRepository }) {
    this._postRepository = postRepository;
    this._postReactionRepository = postReactionRepository;
  }

  getPosts(filter) {
    return this._postRepository.getPosts(filter);
  }

  getById(id) {
    return this._postRepository.getById(id);
  }

  create(userId, post) {
    return this._postRepository.create({
      ...post,
      userId
    });
  }

  update(postId, post) {
    return this._postRepository.update(postId, { ...post });
  }

  async delete(id) {
    const deletedCount = await this._postRepository.softDeleteById(id);

    return Boolean(deletedCount);
  }

  async setReaction(userId, { postId, isLike = true }) {
    let action;
    const updateOrDelete = react => (react.isLike === isLike
      ? (action = 'remove', this._postReactionRepository.deleteById(react.id))
      : (action = 'add', this._postReactionRepository.updateById(react.id, { isLike })));

    const reaction = await this._postReactionRepository.getReaction(
      userId,
      postId,
      isLike
    );

    if (reaction) {
      await updateOrDelete(reaction);
    } else {
      await this._postReactionRepository.create({ userId, postId, isLike });
      action = 'add';
    }

    const updatedPost = await this._postRepository.geByIdWithUserAndReactions(postId);

    return { ...updatedPost, action };
  }
}

export { Post };
