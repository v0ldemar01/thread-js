import { createAsyncThunk } from '@reduxjs/toolkit';
import { ActionType } from './common.js';

const loadPosts = createAsyncThunk(
  ActionType.SET_ALL_POSTS,
  async (filters, { extra: { services } }) => {
    const posts = await services.post.getAllPosts(filters);
    return { posts };
  }
);

const loadMorePosts = createAsyncThunk(
  ActionType.LOAD_MORE_POSTS,
  async (filters, { getState, extra: { services } }) => {
    const {
      posts: { posts }
    } = getState();
    const loadedPosts = await services.post.getAllPosts(filters);
    const filteredPosts = loadedPosts.filter(
      post => !(posts && posts.some(loadedPost => post.id === loadedPost.id))
    );

    return { posts: filteredPosts };
  }
);

const applyPost = createAsyncThunk(
  ActionType.ADD_POST,
  async ({ id: postId, userId }, { getState, extra: { services } }) => {
    const { profile: { user } } = getState();
    if (userId === user.id) {
      return { post: null };
    }

    const post = await services.post.getPost(postId);
    return { post };
  }
);

const createPost = createAsyncThunk(
  ActionType.ADD_POST,
  async (post, { extra: { services } }) => {
    const { id } = await services.post.addPost(post);
    const newPost = await services.post.getPost(id);

    return { post: newPost };
  }
);

const updatePost = createAsyncThunk(
  ActionType.UPDATE_POST,
  async (post, { extra: { services } }) => {
    const newPost = await services.post.updatePost(post, post.id);
    return { newPost };
  }
);

const deletePost = createAsyncThunk(
  ActionType.DELETE_POST,
  async (postId, { extra: { services } }) => {
    await services.post.deletePost(postId);

    return { postId };
  }
);

const toggleExpandedPost = createAsyncThunk(
  ActionType.SET_EXPANDED_POST,
  async (postId, { extra: { services } }) => {
    const post = postId ? await services.post.getPost(postId) : undefined;
    return { post };
  }
);

const reactPost = (isLike = true) => async (postId, { getState, extra: { services } }) => {
  const mode = `${!isLike ? 'dis' : ''}like`;

  const { likes, dislikes } = await services.post[`${mode}Post`](postId);
  const mapLikesOrDislikes = post => ({
    ...post,
    likes,
    dislikes
  });

  const {
    posts: { posts, expandedPost }
  } = getState();
  const updatedPosts = posts.map(post => (
    post.id !== postId ? post : mapLikesOrDislikes(post)
  ));
  const updatedExpandedPost = expandedPost?.id === postId
    ? mapLikesOrDislikes(expandedPost)
    : expandedPost;

  return { posts: updatedPosts, expandedPost: updatedExpandedPost };
};

const likePost = createAsyncThunk(
  ActionType.REACT_POST,
  reactPost()
);

const dislikePost = createAsyncThunk(
  ActionType.REACT_POST,
  reactPost(false)
);

const reactPostFromSocket = async ({
  id: postId,
  likes,
  dislikes
}, { getState }) => {
  const mapLikesOrDislikes = post => ({
    ...post,
    likes,
    dislikes
  });

  const {
    posts: { posts, expandedPost }
  } = getState();
  const updatedPosts = posts.map(post => (
    post.id !== postId ? post : mapLikesOrDislikes(post)
  ));
  const updatedExpandedPost = expandedPost?.id === postId
    ? mapLikesOrDislikes(expandedPost)
    : expandedPost;

  return { posts: updatedPosts, expandedPost: updatedExpandedPost };
};

const likePostFromSocket = createAsyncThunk(
  ActionType.REACT_POST_FROM_SOCKET,
  reactPostFromSocket
);

const dislikePostFromSocket = createAsyncThunk(
  ActionType.REACT_POST_FROM_SOCKET,
  reactPostFromSocket
);

const reactComment = (isLike = true) => async (commentId, { getState, extra: { services } }) => {
  const mode = `${!isLike ? 'dis' : ''}like`;

  const { likes, dislikes } = await services.comment[`${mode}Comment`](commentId);
  const mapLikesOrDislikes = comment => ({
    ...comment,
    likes,
    dislikes
  });

  const {
    posts: { expandedPost }
  } = getState();

  const updatedExpandedPostComments = expandedPost.comments
    .map(comment => (comment.id !== commentId ? comment : mapLikesOrDislikes(comment)));
  return {
    expandedPost: {
      ...expandedPost,
      comments: updatedExpandedPostComments
    }
  };
};

const likeComment = createAsyncThunk(
  ActionType.REACT_COMMENT,
  reactComment()
);

const dislikeComment = createAsyncThunk(
  ActionType.REACT_COMMENT,
  reactComment(false)
);

const reactCommentFromSocket = async ({
  id: commentId,
  likes,
  dislikes
}, { getState }) => {
  const mapLikesOrDislikes = comment => ({
    ...comment,
    likes,
    dislikes
  });

  const {
    posts: { expandedPost }
  } = getState();

  const updatedExpandedPostComments = (expandedPost?.comments ?? [])
    .map(comment => (comment.id !== commentId ? comment : mapLikesOrDislikes(comment)));
  return {
    expandedPost: expandedPost ? {
      ...expandedPost,
      comments: updatedExpandedPostComments
    } : null
  };
};

const likeCommentFromSocket = createAsyncThunk(
  ActionType.REACT_COMMENT_FROM_SOCKET,
  reactCommentFromSocket
);

const dislikeCommentFromSocket = createAsyncThunk(
  ActionType.REACT_COMMENT_FROM_SOCKET,
  reactCommentFromSocket
);

const addComment = createAsyncThunk(
  ActionType.COMMENT,
  async (request, { getState, extra: { services } }) => {
    const { id } = await services.comment.addComment(request);
    const comment = await services.comment.getComment(id);

    const mapComments = post => ({
      ...post,
      commentCount: Number(post.commentCount) + 1,
      comments: [...(post.comments || []), comment] // comment is taken from the current closure
    });

    const {
      posts: { posts, expandedPost }
    } = getState();
    const updated = posts.map(post => (
      post.id !== comment.postId ? post : mapComments(post)
    ));

    const updatedExpandedPost = expandedPost?.id === comment.postId
      ? mapComments(expandedPost)
      : undefined;

    return { posts: updated, expandedPost: updatedExpandedPost };
  }
);

const deleteComment = createAsyncThunk(
  ActionType.DELETE_COMMENT,
  async (commentId, { getState, extra: { services } }) => {
    await services.comment.deleteComment(commentId);

    const {
      posts: { expandedPost }
    } = getState();

    const updatedExpandedPostComments = (expandedPost?.comments ?? [])
      .filter(comment => (comment.id !== commentId));

    return {
      expandedPost: expandedPost ? {
        ...expandedPost,
        comments: updatedExpandedPostComments
      } : null
    };
  }
);

const updateComment = createAsyncThunk(
  ActionType.UPDATE_COMMENT,
  async (comment, { getState, extra: { services } }) => {
    const newComment = await services.comment.updateComment(comment, comment.id);
    const {
      posts: { expandedPost }
    } = getState();

    const updatedExpandedPostComments = (expandedPost?.comments ?? [])
      .map(statePostComment => (statePostComment.id === newComment.id ? {
        ...statePostComment,
        ...newComment
      } : statePostComment));

    return {
      expandedPost: expandedPost ? {
        ...expandedPost,
        comments: updatedExpandedPostComments
      } : null
    };
  }
);

export {
  likePost,
  applyPost,
  loadPosts,
  deletePost,
  createPost,
  updatePost,
  addComment,
  dislikePost,
  likeComment,
  updateComment,
  deleteComment,
  loadMorePosts,
  dislikeComment,
  likePostFromSocket,
  toggleExpandedPost,
  dislikePostFromSocket,
  likeCommentFromSocket,
  dislikeCommentFromSocket
};
