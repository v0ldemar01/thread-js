import { configureStore } from '@reduxjs/toolkit';

import { http, storage, auth, comment, post, image, notification } from 'services/services.js';
import { profileReducer, threadReducer } from './root-reducer.js';
import { notificationSocket } from './middlewares/middlewares.js';

const store = configureStore({
  reducer: {
    profile: profileReducer,
    posts: threadReducer
  },
  middleware: getDefaultMiddleware => (getDefaultMiddleware({
    thunk: {
      extraArgument: {
        services: {
          http,
          storage,
          auth,
          comment,
          post,
          image,
          notification
        }
      }
    }
  })).concat([notificationSocket])
});

export { store };
