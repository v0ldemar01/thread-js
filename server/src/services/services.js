import { ENV } from '../common/enums/enums.js';
import {
  user as userRepository,
  comment as commentRepository,
  image as imageRepository,
  post as postRepository,
  postReaction as postReactionRepository,
  commentReaction as commentReactionRepository
} from '../data/repositories/repositories.js';
import { Auth } from './auth/auth.service.js';
import { Comment } from './comment/comment.service.js';
import { Http } from './http/http.service.js';
import { Image } from './image/image.service.js';
import { Post } from './post/post.service.js';
import { User } from './user/user.service.js';
import { Email } from './email/email.service.js';
import { Socket } from './socket/socket.service.js';
import { EmailTransporter } from './email-transporter/email-transporter.service.js';
import { Password } from './password/password.service.js';

const http = new Http();

const auth = new Auth({
  userRepository
});

const comment = new Comment({
  commentRepository,
  commentReactionRepository
});

const image = new Image({
  http,
  imageRepository
});

const post = new Post({
  postRepository,
  postReactionRepository
});

const user = new User({
  userRepository
});

const socket = new Socket();

const emailTransporter = new EmailTransporter({
  options: {
    host: ENV.EMAIL.HOST,
    port: ENV.EMAIL.PORT,
    secure: ENV.EMAIL.SECURE,
    auth: {
      user: ENV.EMAIL.USERNAME,
      pass: ENV.EMAIL.PASSWORD
    }
  }
});

const email = new Email({
  emailTransporter,
  sourceEmail: ENV.EMAIL.USERNAME
});

const password = new Password({
  emailService: email,
  userService: user,
  authService: auth
});

export { auth, comment, image, post, user, email, socket, password };
