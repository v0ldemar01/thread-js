import {
  ApiPath,
  HttpMethod,
  ContentType,
  UsersApiPath
} from 'common/enums/enums';

class User {
  constructor({ apiPath, http }) {
    this._apiPath = apiPath;
    this._http = http;
  }

  update(payload, id) {
    return this._http.load(
      `${this._apiPath}${ApiPath.USERS}${UsersApiPath.$ID.slice(0, 1)}${id}`,
      {
        method: HttpMethod.PUT,
        contentType: ContentType.JSON,
        payload: JSON.stringify(payload)
      }
    );
  }
}

export { User };
