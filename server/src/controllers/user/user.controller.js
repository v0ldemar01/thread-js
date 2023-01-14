import {
  ApiPath,
  HttpMethod,
  UsersApiPath
} from '../../common/enums/enums.js';
import { getFullUrl } from '../../helpers/helpers.js';
import { Controller } from '../abstract/abstract.controller.js';

const initUser = ({ server }) => class User extends Controller {
  #userService;

  constructor({ apiPath, userService }) {
    super({ apiPath });
    this.#userService = userService;
  }

  @server.route({
    method: HttpMethod.PUT,
    url: getFullUrl(ApiPath.USERS, UsersApiPath.$ID),
  })
  async update(req) {
    const user = await this.#userService.update(req.params.id, req.body);

    return user;
  };
}

export { initUser };
