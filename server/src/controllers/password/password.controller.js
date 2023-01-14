import {
  ApiPath,
  HttpMethod,
  PasswordApiPath
} from '../../common/enums/enums.js';
import { getErrorStatusCode, getFullUrl } from '../../helpers/helpers.js';
import {
  resetPassword as resetPasswordValidationSchema,
  setWithTokenPassword as setWithTokenPasswordValidationSchema
} from '../../validation-schemas/validation-schemas.js';
import { Controller } from '../abstract/abstract.controller.js';

const initPassword = ({ server }) => class Password extends Controller {
  #passwordService;

  constructor({ apiPath, passwordService }) {
    super({ apiPath });
    this.#passwordService = passwordService;
  }

  @server.route({
    method: HttpMethod.POST,
    url: getFullUrl(ApiPath.PASSWORD, PasswordApiPath.RESET),
    schema: {
      body: resetPasswordValidationSchema
    },
  })
  async reset(req, res) {
    try {
      await this.#passwordService.resetPassword(req.body.email);

      return true;
    } catch (err) {
      return res.status(getErrorStatusCode(err)).send(err);
    }
  };

  @server.route({
    method: HttpMethod.POST,
    url: getFullUrl(ApiPath.PASSWORD, PasswordApiPath.SET),
    schema: {
      body: setWithTokenPasswordValidationSchema
    },
  })
  async set(req) {
    return this.#passwordService.setPassword(req.body);
  }
}

export { initPassword };
