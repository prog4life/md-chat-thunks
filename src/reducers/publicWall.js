import { combineReducers } from 'redux';

import {
  LOAD_POSTS, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAIL, WEBSOCKET_CLOSED,
  JOIN_WALL, JOIN_WALL_SUCCESS, JOIN_WALL_FAIL, WEBSOCKET_CLOSED,
} from 'constants/action-types';

import { makeUnion } from './helpers';

// const initialState = {
//   postsById: {},
//   visiblePosts: [],
//   isLoading: false,
// };

const postsById = (state = {}, action) => {
  switch (action.type) {
    case JOIN_WALL_SUCCESS:
      return { ...state, ...action.payload.byId };
    default:
      return state;
  }
};

const visiblePosts = (state = [], action) => {
  switch (action.type) {
    case JOIN_WALL_SUCCESS:
      return makeUnion(state, action.payload.ids);
    default:
      return state;
  }
};

const isLoading = (state = false, action) => {
  switch (action.type) {
    case JOIN_WALL:
      return true;
    case JOIN_WALL_SUCCESS:
    case JOIN_WALL_FAIL:
    case WEBSOCKET_CLOSED:
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
