import uuidv4 from 'uuid/v4';
import * as aT from 'state/action-types';

export const fetchPosts = filter => ({ type: aT.FETCH_POSTS, filter });

export const addPost = postData => ({
  type: aT.ADD_POST,
  payload: { id: uuidv4(), ...postData },
});

export const deletePost = (postId, wallId = null) => ({
  type: aT.DELETE_POST,
  payload: { id: postId, wallId },
});

// export const maybeDeletePost = postId => (dispatch, getState) => {
//   const state = getState();
//
//
// };
