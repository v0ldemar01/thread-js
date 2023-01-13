import {
  HttpCode,
  HttpMethod,
  PostsApiPath,
  ControllerHook,
  SocketNamespace,
  NotificationSocketEvent
} from '../../common/enums/enums.js';
import { Controller } from '../abstract/abstract.controller.js';

class Post extends Controller {
  #postService;

  #socketService;

  constructor({ app, apiPath, postService, socketService }) {
    super({
      app,
      apiPath
    });
    this.#postService = postService;
    this.#socketService = socketService;
  }

  initRoutes = () => {
    [
      {
        method: HttpMethod.GET,
        url: PostsApiPath.ROOT,
        [ControllerHook.HANDLER]: this.getOnes
      },
      {
        method: HttpMethod.GET,
        url: PostsApiPath.$ID,
        [ControllerHook.HANDLER]: this.getById
      },
      {
        method: HttpMethod.POST,
        url: PostsApiPath.ROOT,
        [ControllerHook.HANDLER]: this.create
      },
      {
        method: HttpMethod.PUT,
        url: PostsApiPath.$ID,
        [ControllerHook.HANDLER]: this.update
      },
      {
        method: HttpMethod.PUT,
        url: PostsApiPath.REACT,
        [ControllerHook.HANDLER]: this.react
      },
      {
        method: HttpMethod.DELETE,
        url: PostsApiPath.$ID,
        [ControllerHook.HANDLER]: this.delete
      }
    ].forEach(this.route);
  };

  getOnes = req => this.#postService.getPosts(req.query);

  getById = req => this.#postService.getById(req.params.id);

  create = async req => {
    const post = await this.#postService.create(req.user.id, req.body);

    this.#socketService.io
      .of(SocketNamespace.NOTIFICATION)
      .emit(NotificationSocketEvent.NEW_POST, post); // notify all users that a new post was created
    return post;
  };

  update = async req => this.#postService.update(req.params.id, req.body);

  react = async req => {
    const reaction = await this.#postService.setReaction(req.user.id, req.body);

    if (reaction && reaction.userId !== req.user.id && reaction.action === 'add') {
      // notify a user if someone (not himself) liked his post
      this.#socketService.io
        .of(SocketNamespace.NOTIFICATION)
        .to(`${reaction.userId}`)
        .emit(NotificationSocketEvent[`${!req.body.isLike ? 'DIS' : ''}LIKE_POST`], reaction);
    }
    return reaction;
  };

  delete = async (req, rep) => {
    const { id } = req.params;
    const isDeleted = await this.#postService.delete(Number(id));

    return rep
      .status(isDeleted ? HttpCode.OK : HttpCode.NOT_FOUND)
      .send(isDeleted);
  };
}

export { Post };
