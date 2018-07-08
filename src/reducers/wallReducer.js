import { combineReducers } from 'redux';

import {
  // LOAD_POSTS, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAIL, WEBSOCKET_CLOSED,
  JOIN_WALL, JOIN_WALL_SUCCESS, JOIN_WALL_FAIL, LEAVE_WALL, WEBSOCKET_CLOSED,
} from 'constants/actionTypes';

import { makeUnion } from './helpers';

// const initialState = {
//   postsById: {},
//   visiblePosts: [],
//   isConnecting: false,
//   isTracked: false,
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

// attempt to subscribe to the wall
const isConnecting = (state = false, action) => {
  switch (action.type) {
    case JOIN_WALL:
      return true;
    case JOIN_WALL_SUCCESS:
    case JOIN_WALL_FAIL:
    case LEAVE_WALL:
    case WEBSOCKET_CLOSED:
      return false;
    default:
      return state;
  }
};

// whether this client subscribed to the wall or not
const isTracked = (state = false, action) => {
  switch (action.type) {
    case JOIN_WALL_SUCCESS:
      return true;
    case LEAVE_WALL:
    case WEBSOCKET_CLOSED:
      return false;
    default:
      return state;
  }
};

export default combineReducers({
  postsById,
  visiblePosts,
  isConnecting,
  isTracked,
});
