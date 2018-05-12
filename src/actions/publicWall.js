import {
  LOAD_POSTS, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAIL,
} from 'constants/action-types';

import { tryToSend } from './connection';

export const loadPostsSuccess = ({ entities, result }) => ({
  type: LOAD_POSTS_SUCCESS,
  payload: { byId: entities.posts, ids: result },
});

export const loadPosts = () => (dispatch) => {
  dispatch({ type: LOAD_POSTS });

  tryToSend()
};
