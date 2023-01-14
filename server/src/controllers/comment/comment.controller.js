import {
  ApiPath,
  HttpCode,
  HttpMethod,
  CommentsApiPath,
  SocketNamespace,
  NotificationSocketEvent
} from '../../common/enums/enums.js';
import  { getFullUrl } from '../../helpers/helpers.js';
import { Controller } from '../abstract/abstract.controller.js';

const initComment = ({ server }) => class Comment extends Controller {
  #commentService;

  #socketService;

  constructor({ apiPath, commentService, socketService }) {
    super({ apiPath });
    this.#commentService = commentService;
    this.#socketService = socketService;
  }

  @server.route({
    method: HttpMethod.GET,
    url: getFullUrl(ApiPath.COMMENTS, CommentsApiPath.$ID),
  })
  async getById(req) {
    return this.#commentService.getById(req.params.id);
  };

  @server.route({
    method: HttpMethod.POST,
    url: getFullUrl(ApiPath.COMMENTS, CommentsApiPath.ROOT),
  })
  async create(req) {
    return this.#commentService.create(req.user.id, req.body);
  }

  @server.route({
    method: HttpMethod.PUT,
    url: getFullUrl(ApiPath.COMMENTS, CommentsApiPath.$ID),
  })
  async update(req) {
    return this.#commentService.update(req.params.id, req.body);
  }

  @server.route({
    method: HttpMethod.PUT,
    url: getFullUrl(ApiPath.COMMENTS, CommentsApiPath.REACT),
  })
  async react(req) {
    const reaction = await this.#commentService.setReaction(req.user.id, req.body);

    if (reaction && reaction.userId !== req.user.id && reaction.action === 'add') {
      // notify a user if someone (not himself) liked his comment
      this.#socketService.io
        .of(SocketNamespace.NOTIFICATION)
        .to(`${reaction.userId}`)
        .emit(NotificationSocketEvent[`${!req.body.isLike ? 'DIS' : ''}LIKE_COMMENT`], reaction);
    }
    return reaction;
  };

  @server.route({
    method: HttpMethod.DELETE,
    url: getFullUrl(ApiPath.COMMENTS, CommentsApiPath.$ID),
  })
  async delete(req, rep) {
    const { id } = req.params;

    const isDeleted = await this.#commentService.delete(Number(id));

    return rep
      .status(isDeleted ? HttpCode.OK : HttpCode.NOT_FOUND)
      .send(isDeleted);
  };
}

export { initComment };
