import {
  ApiPath,
  CommentsApiPath,
  HttpMethod,
  ContentType
} from 'common/enums/enums';

class Comment {
  constructor({ apiPath, http }) {
    this._apiPath = apiPath;
    this._http = http;
  }

  getComment(id) {
    return this._http.load(
      `${this._apiPath}${ApiPath.COMMENTS}${CommentsApiPath.ROOT}${id}`,
      {
        method: HttpMethod.GET
      }
    );
  }

  addComment(payload) {
    return this._http.load(`${this._apiPath}${ApiPath.COMMENTS}`, {
      method: HttpMethod.POST,
      contentType: ContentType.JSON,
      payload: JSON.stringify(payload)
    });
  }

  deleteComment(id) {
    return this._http.load(
      `${this._apiPath}${ApiPath.COMMENTS}${CommentsApiPath.$ID.slice(0, 1)}${id}`,
      {
        method: HttpMethod.DELETE
      }
    );
  }

  reactComment(commentId, isLike = true) {
    return this._http.load(
      `${this._apiPath}${ApiPath.COMMENTS}${CommentsApiPath.REACT}`,
      {
        method: HttpMethod.PUT,
        contentType: ContentType.JSON,
        payload: JSON.stringify({
          commentId,
          isLike
        })
      }
    );
  }

  likeComment(commentId) {
    return this.reactComment(commentId, true);
  }

  dislikeComment(commentId) {
    return this.reactComment(commentId, false);
  }
}

export { Comment };
