import Joi from 'joi';
import {
  UserPayloadKey,
  UserValidationMessage
} from '../../common/enums/enums.js';
import {
  password as passwordValidationSchema
} from './common/password.validation-schema.js';

const setWithTokenPassword = Joi.object({
  [UserPayloadKey.TOKEN]: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': UserValidationMessage.TOKEN_REQUIRE,
      'any.empty': UserValidationMessage.TOKEN_REQUIRE
    })
}).concat(passwordValidationSchema);

export { setWithTokenPassword };
