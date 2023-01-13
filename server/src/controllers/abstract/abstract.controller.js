import path from 'node:path';

class Controller {
  #app;

  #apiPath;

  constructor({ app, apiPath }) {
    this.#app = app;
    this.#apiPath = apiPath;
  }

  route = ({ url, ...options }) => {
    this.#app.route({
      url: this.#normalizeTrailingSlash(path.join(this.#apiPath, url)),
      ...options
    });
  };

  #normalizeTrailingSlash(url) {
    return url.slice(-1) === '/' ? url.slice(0, -1) : url;
  }

  initRoutes() {}
}

export { Controller };
