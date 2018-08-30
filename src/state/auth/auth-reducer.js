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
    // case aT.SIGN_IN_EMAIL:
    case aT.LOGIN_ANON:
      return null;
    case aT.LOGIN_ANON_SUCCESS:
      return action.payload.id;
    // case aT.SIGN_IN_ANON_FAIL:
    // case aT.SIGN_IN_EMAIL_FAIL:
    case aT.SIGN_OUT:
      return null;
    default:
      return state;
  }
};

// TODO: isAuthenticating

const isAnonymous = (state = null, { type, payload }) => {
  switch (type) {
    // case aT.LOGIN_ANON:
    //   return true;
    // case aT.SIGN_IN_EMAIL:
    //   return false;
    case aT.LOGIN_ANON_SUCCESS:
      return true;
    // case aT.SIGN_IN_EMAIL_FAIL:
    // case aT.SIGN_OUT:
    case aT.LOGIN_ANON_FAIL:
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
