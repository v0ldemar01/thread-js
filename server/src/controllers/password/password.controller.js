import {
  HttpMethod,
  ControllerHook,
  PasswordApiPath
} from '../../common/enums/enums.js';
import { getErrorStatusCode } from '../../helpers/helpers.js';
import {
  resetPassword as resetPasswordValidationSchema,
  setWithTokenPassword as setWithTokenPasswordValidationSchema
} from '../../validation-schemas/validation-schemas.js';

import { Controller } from '../abstract/abstract.controller.js';

class Password extends Controller {
  #passwordService;

  constructor({ app, apiPath, passwordService }) {
    super({
      app,
      apiPath
    });
    this.#passwordService = passwordService;
  }

  initRoutes = () => {
    [
      {
        method: HttpMethod.POST,
        url: PasswordApiPath.RESET,
        schema: {
          body: resetPasswordValidationSchema
        },
        [ControllerHook.HANDLER]: this.reset
      },
      {
        method: HttpMethod.POST,
        url: PasswordApiPath.SET,
        schema: {
          body: setWithTokenPasswordValidationSchema
        },
        [ControllerHook.HANDLER]: this.set
      }
    ].forEach(this.route);
  };

  reset = async (req, res) => {
    try {
      await this.#passwordService.resetPassword(req.body.email);

      return true;
    } catch (err) {
      return res.status(getErrorStatusCode(err)).send(err);
    }
  };

  set = async req => {
    return this.#passwordService.setPassword(req.body);
  };
}

export { Password };
