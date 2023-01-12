import {
  ApiPath,
  HttpMethod,
  ContentType,
  PasswordApiPath
} from 'common/enums/enums';

class Password {
  constructor({ apiPath, http }) {
    this._apiPath = apiPath;
    this._http = http;
  }

  setPassword(payload) {
    return this._http.load(
      `${this._apiPath}${ApiPath.PASSWORD}${PasswordApiPath.SET}`,
      {
        method: HttpMethod.POST,
        contentType: ContentType.JSON,
        hasAuth: false,
        payload: JSON.stringify(payload)
      }
    );
  }

  resetPassword(payload) {
    return this._http.load(
      `${this._apiPath}${ApiPath.PASSWORD}${PasswordApiPath.RESET}`,
      {
        method: HttpMethod.POST,
        contentType: ContentType.JSON,
        hasAuth: false,
        payload: JSON.stringify(payload)
      }
    );
  }
}

export { Password };
