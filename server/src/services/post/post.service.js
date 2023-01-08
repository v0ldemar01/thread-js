/* eslint-disable no-return-assign */
class Post {
  constructor({ postRepository, postReactionRepository }) {
    this._postRepository = postRepository;
    this._postReactionRepository = postReactionRepository;
  }

  getPosts(filter) {
    return this._postRepository.getPosts(filter);
  }

  getPostById(id) {
    return this._postRepository.getPostById(id);
  }

  create(userId, post) {
    return this._postRepository.create({
      ...post,
      userId
    });
  }

  updatePost(postId, post) {
    return this._postRepository.updateById(postId, { ...post });
  }

  async setReaction(userId, { postId, isLike = true }) {
    let action;
    const updateOrDelete = react => (react.isLike === isLike
      ? (action = 'remove', this._postReactionRepository.deleteById(react.id))
      : (action = 'add', this._postReactionRepository.updateById(react.id, { isLike })));

    const reaction = await this._postReactionRepository.getPostReaction(
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

    const updatedPost = await this._postRepository.getPostByIdWithUserAndReactions(postId);

    return { ...updatedPost, action };
  }
}

export { Post };
