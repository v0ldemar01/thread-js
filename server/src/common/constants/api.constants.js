import { ApiPath, AuthApiPath, PasswordApiPath, ENV } from '../enums/enums.js';

const WHITE_ROUTES = [
  `${ENV.APP.API_PATH}${ApiPath.AUTH}${AuthApiPath.LOGIN}`,
  `${ENV.APP.API_PATH}${ApiPath.AUTH}${AuthApiPath.REGISTER}`,
  `${ENV.APP.API_PATH}${ApiPath.PASSWORD}${PasswordApiPath.RESET}`,
  `${ENV.APP.API_PATH}${ApiPath.PASSWORD}${PasswordApiPath.SET}`
];

export { WHITE_ROUTES };
