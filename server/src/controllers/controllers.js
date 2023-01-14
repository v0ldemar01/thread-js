import { ApiPath } from '../common/enums/enums.js';
import { initAuth } from './auth/auth.controller.js';
import { initPost } from './post/post.controller.js';
import { initUser } from './user/user.controller.js';
import { initImage } from './image/image.controller.js';
import { initComment } from './comment/comment.controller.js';
import { initPassword } from './password/password.controller.js';
import { Server } from '../decorators/decorators.js';

const initControllers = async (app, { services }) => {
  const {
    auth: authService,
    user: userService,
    post: postService,
    image: imageService,
    socket: socketService,
    comment: commentService,
    password: passwordService
  } = services;

  app.setValidatorCompiler(({ schema }) => {
    return data => schema.validate(data);
  });

  const server = new Server({ app });

  const auth = new (initAuth({ server }))({
    apiPath: ApiPath.AUTH,
    authService,
    userService
  });
  const user = new (initUser({ server }))({
    apiPath: ApiPath.USERS,
    userService
  });
  const post = new (initPost({ server }))({
    app,
    apiPath: ApiPath.POSTS,
    postService,
    socketService
  });
  const image = new (initImage({ server }))({
    app,
    apiPath: ApiPath.IMAGES,
    imageService
  });
  const comment = new (initComment({ server }))({
    app,
    apiPath: ApiPath.COMMENTS,
    commentService,
    socketService
  });
  const password = new (initPassword({ server }))({
    app,
    apiPath: ApiPath.PASSWORD,
    passwordService
  });

  return {
    auth,
    user,
    post,
    image,
    comment,
    password
  };
};

export { initControllers };
