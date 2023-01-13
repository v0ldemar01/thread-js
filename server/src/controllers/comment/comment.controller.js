import {
  HttpCode,
  HttpMethod,
  ControllerHook,
  CommentsApiPath,
  SocketNamespace,
  NotificationSocketEvent
} from '../../common/enums/enums.js';
import { Controller } from '../abstract/abstract.controller.js';

class Comment extends Controller {
  #commentService;

  #socketService;

  constructor({ app, apiPath, commentService, socketService }) {
    super({
      app,
      apiPath
    });
    this.#commentService = commentService;
    this.#socketService = socketService;
  }

  initRoutes = () => {
    [
      {
        method: HttpMethod.GET,
        url: CommentsApiPath.$ID,
        [ControllerHook.HANDLER]: this.getById
      },
      {
        method: HttpMethod.POST,
        url: CommentsApiPath.ROOT,
        [ControllerHook.HANDLER]: this.create
      },
      {
        method: HttpMethod.PUT,
        url: CommentsApiPath.$ID,
        [ControllerHook.HANDLER]: this.update
      },
      {
        method: HttpMethod.PUT,
        url: CommentsApiPath.REACT,
        [ControllerHook.HANDLER]: this.react
      },
      {
        method: HttpMethod.DELETE,
        url: CommentsApiPath.$ID,
        [ControllerHook.HANDLER]: this.delete
      }
    ].forEach(this.route);
  };

  getById = async req => this.#commentService.getById(req.params.id);

  create = async req => this.#commentService.create(req.user.id, req.body);

  update = async req => this.#commentService.update(req.params.id, req.body);

  react = async req => {
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

  delete = async (req, rep) => {
    const { id } = req.params;

    const isDeleted = await this.#commentService.delete(Number(id));

    return rep
      .status(isDeleted ? HttpCode.OK : HttpCode.NOT_FOUND)
      .send(isDeleted);
  };
}

export { Comment };
