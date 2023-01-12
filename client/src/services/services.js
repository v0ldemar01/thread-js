import { ENV } from 'common/enums/enums.js';
import { Auth } from './auth/auth.service.js';
import { Comment } from './comment/comment.service.js';
import { Http } from './http/http.service.js';
import { Image } from './image/image.service.js';
import { Post } from './post/post.service.js';
import { User } from './user/user.service.js';
import { Socket } from './socket/socket.service.js';
import { Storage } from './storage/storage.service.js';
import { Notification } from './notification/notification.service.js';
import {
  ImageDataConverter
} from './image-data-converter/image-data-converter.service.js';
import { Password } from './password/password.service.js';

const storage = new Storage({
  storage: localStorage
});

const http = new Http({
  storage
});

const auth = new Auth({
  apiPath: ENV.API_PATH,
  http
});

const user = new User({
  apiPath: ENV.API_PATH,
  http
});

const comment = new Comment({
  apiPath: ENV.API_PATH,
  http
});

const post = new Post({
  apiPath: ENV.API_PATH,
  http
});

const password = new Password({
  apiPath: ENV.API_PATH,
  http
});

const imageDataConverter = new ImageDataConverter();

const image = new Image({
  apiPath: ENV.API_PATH,
  http,
  imageDataConverter
});

const socket = new Socket();

const notification = new Notification();

export { http, storage, user, auth, comment, password, post, image, socket, notification };
