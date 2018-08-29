import { createSelector } from 'reselect';

// Beware of problem with selector which returns a new object everytime,         !!!
// and that will violate the shallow comparison in "connect"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ AUTH ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export const getUserId = state => state.auth.userId;
export const isAnonymousSelector = state => state.auth.isAnonymous;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ WALL ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export const getWallId = state => state.wall.id;
export const isSubscribedToWall = state => state.wall.isSubscribed;
export const isSubscribingToWall = state => state.wall.isSubscribing;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ POSTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export const getPostsById = state => state.posts.postsById;
export const getPostById = (state, id) => getPostsById(state)[id];
export const getPostIds = state => state.posts.listedIds;
export const getPosts = createSelector(
  [getPostsById, getPostIds],
  (postsById, ids) => (
    postsById && ids
      // const ids = postsById ? Object.keys(postsById) : [];
      // was !deletedPosts.includes(post.id)
      ? ids.map(id => postsById[id]).filter(post => !post.isDeleted)
      : null
  ),
);

export const isFetchingPosts = state => state.posts.isFetching;
export const isPostIdTemporary = (state, id) => getPostById(state, id).hasTempId;
export const isPostRemovalRequested = (state, id) => (
  getPostById(state, id).isDeleted
);
