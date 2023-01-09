import {
  useState,
  useCallback,
  useEffect,
  useAppForm,
  useDispatch,
  useSelector
} from 'hooks/hooks.js';
import InfiniteScroll from 'react-infinite-scroll-component';
import { threadActionCreator } from 'store/actions.js';
import { image as imageService } from 'services/services.js';
import { ThreadToolbarKey, UseFormMode } from 'common/enums/enums.js';
import { Post, Spinner, Checkbox } from 'components/common/common.js';
import { ExpandedPost, SharedPostLink, AddPost } from './components/components.js';
import { DEFAULT_THREAD_TOOLBAR } from './common/constants.js';

import styles from './styles.module.scss';
import { UpdatePost } from './components/update-post/update-post.jsx';

const postsFilter = {
  userId: undefined,
  from: 0,
  count: 10
};

const Thread = () => {
  const dispatch = useDispatch();
  const { posts, hasMorePosts, expandedPost, userId } = useSelector(state => ({
    posts: state.posts.posts,
    hasMorePosts: state.posts.hasMorePosts,
    expandedPost: state.posts.expandedPost,
    userId: state.profile.user.id
  }));
  const [sharedPostId, setSharedPostId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);

  const { control, watch } = useAppForm({
    defaultValues: DEFAULT_THREAD_TOOLBAR,
    mode: UseFormMode.ON_CHANGE
  });

  const showOwnPosts = watch(ThreadToolbarKey.SHOW_OWN_POSTS);

  const handlePostsLoad = useCallback(filtersPayload => {
    dispatch(threadActionCreator.loadPosts(filtersPayload));
  }, [dispatch]);

  const handleToggleShowOwnPosts = useCallback(
    () => {
      postsFilter.userId = showOwnPosts ? userId : undefined;
      postsFilter.from = 0;
      handlePostsLoad(postsFilter);
      postsFilter.from = postsFilter.count; // for the next scroll
    },
    [userId, showOwnPosts, handlePostsLoad]
  );

  useEffect(() => {
    handleToggleShowOwnPosts();
  }, [showOwnPosts, handleToggleShowOwnPosts]);

  const handlePostLike = useCallback(
    id => dispatch(threadActionCreator.likePost(id)),
    [dispatch]
  );

  const handlePostDislike = useCallback(
    id => dispatch(threadActionCreator.dislikePost(id)),
    [dispatch]
  );

  const handleExpandedPostToggle = useCallback(
    id => dispatch(threadActionCreator.toggleExpandedPost(id)),
    [dispatch]
  );

  const handlePostAdd = useCallback(
    postPayload => dispatch(threadActionCreator.createPost(postPayload)),
    [dispatch]
  );

  const handlePostUpdate = useCallback(
    postPayload => dispatch(threadActionCreator.updatePost(postPayload)),
    [dispatch]
  );

  const handleMorePostsLoad = useCallback(
    filtersPayload => {
      dispatch(threadActionCreator.loadMorePosts(filtersPayload));
    },
    [dispatch]
  );

  const handleGetMorePosts = useCallback(() => {
    handleMorePostsLoad(postsFilter);
    const { from, count } = postsFilter;
    postsFilter.from = from + count;
  }, [handleMorePostsLoad]);

  const handleSharePost = id => setSharedPostId(id);

  const handleEditingPost = id => setEditingPostId(id);

  const handleCloseEditingPost = () => setEditingPostId(null);

  const handleUploadImage = file => imageService.uploadImage(file);

  const handleCloseSharedPostLink = () => setSharedPostId(undefined);

  useEffect(() => {
    handleGetMorePosts();
  }, [handleGetMorePosts]);

  return (
    <div className={styles.threadContent}>
      <div className={styles.addPostForm}>
        <AddPost onPostAdd={handlePostAdd} onUploadImage={handleUploadImage} />
      </div>
      <form name="thread-toolbar">
        <div className={styles.toolbar}>
          <Checkbox
            name={ThreadToolbarKey.SHOW_OWN_POSTS}
            control={control}
            label="Show only my posts"
          />
        </div>
      </form>
      <InfiniteScroll
        dataLength={posts.length}
        next={handleGetMorePosts}
        scrollThreshold={0.8}
        hasMore={hasMorePosts}
        loader={<Spinner key="0" />}
      >
        {posts.map(post => (
          post.id === editingPostId ? (
            <UpdatePost
              post={post}
              onPostUpdate={handlePostUpdate}
              onClose={handleCloseEditingPost}
              onUploadImage={handleUploadImage}
            />
          ) : (
            <Post
              post={post}
              isOwnPost={post.userId === userId}
              onPostLike={handlePostLike}
              onPostDislike={handlePostDislike}
              onExpandedPostToggle={handleExpandedPostToggle}
              onSharePost={handleSharePost}
              onEditingPost={handleEditingPost}
              key={post.id}
            />
          )
        ))}
      </InfiniteScroll>
      {expandedPost && (
        <ExpandedPost
          isOwnPost={expandedPost.userId === userId}
          onSharePost={handleSharePost}
          onEditingPost={handleEditingPost}
        />
      )}
      {sharedPostId && (
        <SharedPostLink
          postId={sharedPostId}
          onClose={handleCloseSharedPostLink}
        />
      )}
    </div>
  );
};

export { Thread };
