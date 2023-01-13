import { ApiPath } from '../common/enums/enums.js';
import { Auth } from './auth/auth.controller.js';
import { Post } from './post/post.controller.js';
import { User } from './user/user.controller.js';
import { Image } from './image/image.controller.js';
import { Comment } from './comment/comment.controller.js';
import { Password } from './password/password.controller.js';

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

  [
    new Auth({
      app,
      apiPath: ApiPath.AUTH,
      authService,
      userService
    }),
    new User({
      app,
      apiPath: ApiPath.USERS,
      userService
    }),
    new Post({
      app,
      apiPath: ApiPath.POSTS,
      postService,
      socketService
    }),
    new Image({
      app,
      apiPath: ApiPath.IMAGES,
      imageService
    }),
    new Comment({
      app,
      apiPath: ApiPath.COMMENTS,
      commentService,
      socketService
    }),
    new Password({
      app,
      apiPath: ApiPath.PASSWORD,
      passwordService
    })
  ].forEach(({ initRoutes }) => initRoutes());
};

export { initControllers };
