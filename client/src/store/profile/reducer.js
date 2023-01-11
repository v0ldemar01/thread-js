import { createReducer, isAnyOf } from '@reduxjs/toolkit';
import {
  login,
  logout,
  register,
  updateUser,
  loadCurrentUser,
  updateUserAvatar
} from './actions.js';

const initialState = {
  user: null
};

const reducer = createReducer(initialState, builder => {
  builder.addCase(updateUserAvatar.fulfilled, (state, { payload }) => {
    state.user = {
      ...state.user,
      image: {
        ...state.user.image,
        ...payload
      }
    };
  });
  builder.addCase(updateUser.fulfilled, (state, { payload }) => {
    state.user = {
      ...state.user,
      ...payload
    };
  });
  builder
    .addMatcher(
      isAnyOf(
        login.fulfilled,
        logout.fulfilled,
        register.fulfilled,
        loadCurrentUser.fulfilled
      ),
      (state, action) => {
        state.user = action.payload;
      }
    )
    .addMatcher(
      isAnyOf(
        login.rejected,
        logout.rejected,
        register.rejected,
        loadCurrentUser.rejected
      ),
      state => {
        state.user = null;
      }
    );
});

export { reducer };
