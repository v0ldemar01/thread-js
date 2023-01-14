import {
  ApiPath,
  HttpMethod,
  AuthApiPath
} from '../../common/enums/enums.js';
import { getErrorStatusCode, getFullUrl } from '../../helpers/helpers.js';
import {
  login as loginValidationSchema,
  registration as registrationValidationSchema
} from '../../validation-schemas/validation-schemas.js';
import { Controller } from '../abstract/abstract.controller.js';

const initAuth = ({ server }) => class Auth extends Controller {
  #authService;

  #userService;

  constructor({ apiPath, authService, userService }) {
    super({ apiPath });
    this.#authService = authService;
    this.#userService = userService;
  }

  @server.route({
    method: HttpMethod.POST,
    url: getFullUrl(ApiPath.AUTH, AuthApiPath.LOGIN),
    schema: {
      body: loginValidationSchema
    }
  })
  async login(req, res) {
    try {
      const user = await this.#authService.verifyLoginCredentials(req.body);
      return await this.#authService.login(user);
    } catch (err) {
      return res.status(getErrorStatusCode(err)).send(err);
    }
  };

  @server.route({
    method: HttpMethod.POST,
    url: getFullUrl(ApiPath.AUTH, AuthApiPath.REGISTER),
    schema: {
      body: registrationValidationSchema
    }
  })
  async register(req, res) {
    try {
      return await this.#authService.register(req.body);
    } catch (err) {
      return res.status(getErrorStatusCode(err)).send(err);
    }
  };

  @server.route({
    method: HttpMethod.GET,
    url: getFullUrl(ApiPath.AUTH, AuthApiPath.USER),
  })
  async getUser(req) {
    return this.#userService.getUserById(req.user.id)
  };
}

export { initAuth };
