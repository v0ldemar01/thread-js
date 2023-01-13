import {
  HttpMethod,
  UsersApiPath,
  ControllerHook
} from '../../common/enums/enums.js';
import { Controller } from '../abstract/abstract.controller.js';

class User extends Controller {
  #userService;

  constructor({ app, apiPath, userService }) {
    super({
      app,
      apiPath
    });
    this.#userService = userService;
  }

  initRoutes = () => {
    [{
      method: HttpMethod.PUT,
      url: UsersApiPath.$ID,
      [ControllerHook.HANDLER]: this.getById
    }].forEach(this.route);
  };

  getById = async req => {
    const user = await this.#userService.update(req.params.id, req.body);

    return user;
  };
}

export { User };
