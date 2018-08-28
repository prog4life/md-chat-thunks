import { combineReducers } from 'redux';

import * as aT from 'state/action-types';

// const login = (state = '', action) => {
//   switch (action.type) {
//     case aT.SET_LOGIN:
//       return action.login;
//     default:
//       return state;
//   }
// };

const userId = (state = null, action) => {
  switch (action.type) {
    // case aT.SIGN_IN:
    //   return null;
    case aT.SIGN_IN_ANON:
    case aT.SIGN_IN_EMAIL:
      return null;
    case aT.SIGN_IN_SUCCESS:
      return action.payload.userId;
    case aT.SIGN_IN_ANON_FAIL:
    case aT.SIGN_IN_EMAIL_FAIL:
    case aT.SIGN_OUT:
      return null;
    default:
      return state;
  }
};

const isAnonymous = (state = null, { type, payload }) => {
  switch (type) {
    case aT.SIGN_IN_ANON:
      return true;
    case aT.SIGN_IN_EMAIL:
      return false;
    case aT.SIGN_IN_SUCCESS:
      return (payload.userId && payload.isAnonymous) || false;
    case aT.SIGN_IN_ANON_FAIL:
    case aT.SIGN_IN_EMAIL_FAIL:
    case aT.SIGN_OUT:
      return null;
    default:
      return state;
  }
};

const token = (state = '', action) => {
  switch (action.type) {
    case aT.SET_TOKEN:
      return action.token;
    default:
      return state;
  }
};

const nickname = (state = '', action) => {
  switch (action.type) {
    case aT.SET_NICKNAME:
      return action.nickname;
    default:
      return state;
  }
};

export default combineReducers({
  // login,
  userId,
  isAnonymous,
  token,
  nickname,
});
