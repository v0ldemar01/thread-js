import {
  NotificationSocketEvent,
  SocketNamespace,
  CommentsApiPath,
  ControllerHook,
  HttpMethod
} from '../../common/enums/enums.js';

const initComment = (fastify, opts, done) => {
  const { comment: commentService } = opts.services;

  fastify.route({
    method: HttpMethod.GET,
    url: CommentsApiPath.$ID,
    [ControllerHook.HANDLER]: async req => commentService.getCommentById(req.params.id)
  });
  fastify.route({
    method: HttpMethod.POST,
    url: CommentsApiPath.ROOT,
    [ControllerHook.HANDLER]: async req => commentService.create(req.user.id, req.body)
  });
  fastify.route({
    method: HttpMethod.PUT,
    url: CommentsApiPath.REACT,
    [ControllerHook.HANDLER]: async req => {
      const reaction = await commentService.setCommentReaction(req.user.id, req.body);

      if (reaction && reaction.userId !== req.user.id && reaction.action === 'add') {
        // notify a user if someone (not himself) liked his comment
        req.io
          .of(SocketNamespace.NOTIFICATION)
          .to(`${reaction.userId}`)
          .emit(NotificationSocketEvent[`${!req.body.isLike ? 'DIS' : ''}LIKE_COMMENT`], reaction);
      }
      return reaction;
    }
  });

  done();
};

export { initComment };
