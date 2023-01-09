import {
  ApiPath,
  PostsApiPath,
  HttpMethod,
  ContentType
} from 'common/enums/enums';

class Post {
  constructor({ apiPath, http }) {
    this._apiPath = apiPath;
    this._http = http;
  }

  getAllPosts(filter) {
    return this._http.load(`${this._apiPath}${ApiPath.POSTS}`, {
      method: HttpMethod.GET,
      query: filter
    });
  }

  getPost(id) {
    return this._http.load(
      `${this._apiPath}${ApiPath.POSTS}${PostsApiPath.ROOT}${id}`,
      {
        method: HttpMethod.GET
      }
    );
  }

  addPost(payload) {
    return this._http.load(`${this._apiPath}${ApiPath.POSTS}`, {
      method: HttpMethod.POST,
      contentType: ContentType.JSON,
      payload: JSON.stringify(payload)
    });
  }

  updatePost(payload, id) {
    return this._http.load(
      `${this._apiPath}${ApiPath.POSTS}${PostsApiPath.$ID.slice(0, 1)}${id}`,
      {
        method: HttpMethod.PUT,
        contentType: ContentType.JSON,
        payload: JSON.stringify(payload)
      }
    );
  }

  deletePost(id) {
    return this._http.load(
      `${this._apiPath}${ApiPath.POSTS}${PostsApiPath.$ID.slice(0, 1)}${id}`,
      {
        method: HttpMethod.DELETE
      }
    );
  }

  reactPost(postId, isLike = true) {
    return this._http.load(
      `${this._apiPath}${ApiPath.POSTS}${PostsApiPath.REACT}`,
      {
        method: HttpMethod.PUT,
        contentType: ContentType.JSON,
        payload: JSON.stringify({
          postId,
          isLike
        })
      }
    );
  }

  likePost(postId) {
    return this.reactPost(postId, true);
  }

  dislikePost(postId) {
    return this.reactPost(postId, false);
  }
}

export { Post };
