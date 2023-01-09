import {
  NotificationSocketEvent,
  SocketNamespace,
  CommentsApiPath,
  ControllerHook,
  HttpMethod,
  HttpCode
} from '../../common/enums/enums.js';

const initComment = (fastify, opts, done) => {
  const { comment: commentService } = opts.services;

  fastify.route({
    method: HttpMethod.GET,
    url: CommentsApiPath.$ID,
    [ControllerHook.HANDLER]: async req => commentService.getById(req.params.id)
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
      const reaction = await commentService.setReaction(req.user.id, req.body);

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
  fastify.route({
    method: HttpMethod.DELETE,
    url: CommentsApiPath.$ID,
    [ControllerHook.HANDLER]: async (req, rep) => {
      const { id } = req.params;

      const isDeleted = await commentService.delete(Number(id));

      return rep
        .status(isDeleted ? HttpCode.OK : HttpCode.NOT_FOUND)
        .send(isDeleted);
    }
  });

  done();
};

export { initComment };
