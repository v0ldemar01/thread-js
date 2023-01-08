import { createReducer, isAnyOf } from '@reduxjs/toolkit';
import {
  loadPosts,
  loadMorePosts,
  toggleExpandedPost,
  likePost,
  addComment,
  applyPost,
  updatePost,
  createPost,
  dislikePost,
  likePostFromSocket,
  dislikePostFromSocket
} from './actions.js';

const initialState = {
  posts: [],
  expandedPost: null,
  hasMorePosts: true
};

const reducer = createReducer(initialState, builder => {
  builder.addCase(loadPosts.fulfilled, (state, action) => {
    const { posts } = action.payload;

    state.posts = posts;
    state.hasMorePosts = Boolean(posts.length);
  });
  builder.addCase(loadMorePosts.pending, state => {
    state.hasMorePosts = null;
  });
  builder.addCase(loadMorePosts.fulfilled, (state, action) => {
    const { posts } = action.payload;

    state.posts = state.posts.concat(posts);
    state.hasMorePosts = Boolean(posts.length);
  });
  builder.addCase(toggleExpandedPost.fulfilled, (state, action) => {
    const { post } = action.payload;

    state.expandedPost = post;
  });
  builder.addCase(updatePost.fulfilled, (state, action) => {
    const { newPost } = action.payload;
    state.posts = state.posts.map(statePost => (statePost.id === newPost.id ? {
      ...statePost, ...newPost
    } : statePost));
    if (state.expandedPost?.id === newPost.id) {
      state.expandedPost = { ...state.expandedPost, ...newPost };
    }
  });
  builder.addMatcher(
    isAnyOf(
      likePost.fulfilled,
      dislikePost.fulfilled,
      likePostFromSocket.fulfilled,
      dislikePostFromSocket.fulfilled,
      addComment.fulfilled
    ),
    (state, action) => {
      const { posts, expandedPost } = action.payload;
      state.posts = posts;
      state.expandedPost = expandedPost;
    }
  );
  builder.addMatcher(
    isAnyOf(applyPost.fulfilled, createPost.fulfilled),
    (state, action) => {
      const { post } = action.payload;

      if (post) {
        state.posts = [post, ...state.posts];
      }
    }
  );
});

export { reducer };
