import {
  ControllerHook,
  HttpMethod,
  PasswordApiPath
} from '../../common/enums/enums.js';
import { getErrorStatusCode } from '../../helpers/helpers.js';
import {
  resetPassword as resetPasswordValidationSchema,
  setWithTokenPassword as setWithTokenPasswordValidationSchema
} from '../../validation-schemas/validation-schemas.js';

const initPassword = (fastify, opts, done) => {
  const { password: passwordService } = opts.services;

  fastify.route({
    method: HttpMethod.POST,
    url: PasswordApiPath.RESET,
    schema: {
      body: resetPasswordValidationSchema
    },
    async [ControllerHook.HANDLER](req, res) {
      try {
        await passwordService.resetPassword(req.body.email);

        return true;
      } catch (err) {
        return res.status(getErrorStatusCode(err)).send(err);
      }
    }
  });

  fastify.route({
    method: HttpMethod.POST,
    url: PasswordApiPath.SET,
    schema: {
      body: setWithTokenPasswordValidationSchema
    },
    async [ControllerHook.HANDLER](req) {
      return passwordService.setPassword(req.body);
    }
  });

  done();
};

export { initPassword };
