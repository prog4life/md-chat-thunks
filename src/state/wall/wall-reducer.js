import { combineReducers } from 'redux';
import * as aT from 'state/action-types';

// TODO: change to wallIdByCity: { 'CityName': 'some-city-id' }
const id = (state = null, action) => {
  switch (action.type) {
    case aT.FETCH_WALL_ID:
      return null;
    case aT.FETCH_WALL_ID_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

const errors = (state = { wallId: null }, action) => {
  switch (action.type) {
    case aT.FETCH_WALL_ID:
      return { ...state, wallId: null };
    case aT.FETCH_WALL_ID_FAIL:
      return {
        ...state,
        wallId: { ...action.error }, // TEMP
        // wallId: {
        //   code: action.error.code,
        //   message: action.error.message,
        // },
      };
    default:
      return state;
  }
};

// state of subscription to the wall request
const isSubscribing = (state = false, action) => {
  switch (action.type) {
    case aT.JOIN_WALL:
      return true;
    case aT.JOIN_WALL_SUCCESS:
    case aT.JOIN_WALL_FAIL:
    case aT.LEAVE_WALL_SUCCESS: // NOTE: LEAVE_WALL too ???
      return false;
    default:
      return state;
  }
};

// whether this client subscribed to the wall or not
const isSubscribed = (state = false, action) => {
  switch (action.type) {
    case aT.JOIN_WALL_SUCCESS:
      return true;
    case aT.LEAVE_WALL_SUCCESS:
      return false;
    default:
      return state;
  }
};

export default combineReducers({
  id,
  errors,
  isSubscribing,
  isSubscribed,
});
