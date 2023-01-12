import Joi from 'joi';
import {
  UserPayloadKey,
  UserValidationMessage
} from '../../common/enums/enums.js';
import {
  password as passwordValidationSchema
} from './common/password.validation-schema.js';

const setWithConfirmPassword = Joi.object({
  [UserPayloadKey.CONFIRM_PASSWORD]: Joi.string()
    .trim()
    .required()
    .valid(Joi.ref(UserPayloadKey.PASSWORD))
    .messages({
      'any.only': UserValidationMessage.PASSWORDS_DO_NOT_MATCH,
      'any.required': UserValidationMessage.PASSWORD_CONFIRM_REQUIRE
    })
}).concat(passwordValidationSchema);

export { setWithConfirmPassword };
