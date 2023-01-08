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

const toggleExpandedPost = createAsyncThunk(
  ActionType.SET_EXPANDED_POST,
  async (postId, { extra: { services } }) => {
    const post = postId ? await services.post.getPost(postId) : undefined;
    return { post };
  }
);

const reactPost = (isLike = true) => async (postId, { getState, extra: { services } }) => {
  const mode = `${!isLike ? 'dis' : ''}like`;

  const { likeCount, dislikeCount } = await services.post[`${mode}Post`](postId);
  const mapLikesOrDislikes = post => ({
    ...post,
    likeCount,
    dislikeCount
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
  ActionType.REACT,
  reactPost()
);

const dislikePost = createAsyncThunk(
  ActionType.REACT,
  reactPost(false)
);

const reactPostFromSocket = async ({
  id: postId,
  likeCount,
  dislikeCount
}, { getState }) => {
  const mapLikesOrDislikes = post => ({
    ...post,
    likeCount,
    dislikeCount
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
  ActionType.REACT_FROM_SOCKET,
  reactPostFromSocket
);

const dislikePostFromSocket = createAsyncThunk(
  ActionType.REACT_FROM_SOCKET,
  reactPostFromSocket
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

export {
  loadPosts,
  loadMorePosts,
  applyPost,
  createPost,
  toggleExpandedPost,
  likePost,
  dislikePost,
  addComment,
  likePostFromSocket,
  updatePost,
  dislikePostFromSocket
};
