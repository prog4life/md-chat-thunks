import { combineReducers } from 'redux';

import {
  LOAD_POSTS, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAIL,
} from 'constants/action-types';

import { makeUnion } from './helpers';

// const initialState = {
//   postsById: {},
//   visiblePosts: [],
//   isLoading: false,
// };

const postsById = (state = {}, action) => {
  switch (action.type) {
    case LOAD_POSTS_SUCCESS:
      return { ...state, ...action.payload.byId };
    default:
      return state;
  }
};

const visiblePosts = (state = [], action) => {
  switch (action.type) {
    case LOAD_POSTS_SUCCESS:
      return makeUnion(state, action.payload.ids);
    default:
      return state;
  }
};

const isLoading = (state = false, action) => {
  switch (action.type) {
    case LOAD_POSTS:
      return true;
    case LOAD_POSTS_SUCCESS:
    case LOAD_POSTS_FAIL:
      return false;
    default:
      return state;
  }
};

export default combineReducers({
  postsById,
  visiblePosts,
  isLoading,
});
