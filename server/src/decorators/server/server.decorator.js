class Server {
  #app;

  constructor({ app }) {
    this.#app = app;
  }

  route = ({ url, ...options }) => handler => {
    this.#app.route({
      ...options,
      url: this.#normalizeTrailingSlash(url),
      handler
    });
    return handler;
  };

  #normalizeTrailingSlash(url) {
    return url.slice(-1) === '/' ? url.slice(0, -1) : url;
  }
}

export { Server };
