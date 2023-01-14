import {
  ApiPath,
  HttpCode,
  HttpMethod,
  PostsApiPath,
  SocketNamespace,
  NotificationSocketEvent
} from '../../common/enums/enums.js';
import { getFullUrl } from '../../helpers/helpers.js';
import { Controller } from '../abstract/abstract.controller.js';

const initPost = ({ server }) => class Post extends Controller {
  #postService;

  #socketService;

  constructor({ apiPath, postService, socketService }) {
    super({ apiPath });
    this.#postService = postService;
    this.#socketService = socketService;
  }

  @server.route({
    method: HttpMethod.GET,
    url: getFullUrl(ApiPath.POSTS, PostsApiPath.ROOT),
  })
  async getOnes(req) {
    return this.#postService.getPosts(req.query);
  }

  @server.route({
    method: HttpMethod.GET,
    url: getFullUrl(ApiPath.POSTS, PostsApiPath.$ID),
  })
  async getById(req) {
    return this.#postService.getById(req.params.id);;
  }

  @server.route({
    method: HttpMethod.POST,
    url: getFullUrl(ApiPath.POSTS, PostsApiPath.ROOT),
  })
  async create(req) {
    const post = await this.#postService.create(req.user.id, req.body);

    this.#socketService.io
      .of(SocketNamespace.NOTIFICATION)
      .emit(NotificationSocketEvent.NEW_POST, post); // notify all users that a new post was created
    return post;
  };

  @server.route({
    method: HttpMethod.PUT,
    url: getFullUrl(ApiPath.POSTS, PostsApiPath.$ID),
  })
  async update(req) {
    return this.#postService.update(req.params.id, req.body);
  }

  @server.route({
    method: HttpMethod.PUT,
    url: getFullUrl(ApiPath.POSTS, PostsApiPath.REACT),
  })
  async react(req) {
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

  @server.route({
    method: HttpMethod.DELETE,
    url: getFullUrl(ApiPath.POSTS, PostsApiPath.$ID),
  })
  async delete(req, rep) {
    const { id } = req.params;
    const isDeleted = await this.#postService.delete(Number(id));

    return rep
      .status(isDeleted ? HttpCode.OK : HttpCode.NOT_FOUND)
      .send(isDeleted);
  };
}

export { initPost };
