import Joi from 'joi';
import {
  UserPayloadKey,
  UserValidationMessage
} from '../../common/enums/enums.js';

const resetPassword = Joi.object({
  [UserPayloadKey.EMAIL]: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': UserValidationMessage.EMAIL_WRONG,
      'string.empty': UserValidationMessage.EMAIL_REQUIRE
    })
});

export { resetPassword };
