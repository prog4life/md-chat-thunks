import { combineReducers } from 'redux';

import * as aT from 'constants/actionTypes';

// const login = (state = '', action) => {
//   switch (action.type) {
//     case aT.SET_LOGIN:
//       return action.login;
//     default:
//       return state;
//   }
// };

const id = (state = '', action) => {
  switch (action.type) {
    case aT.SET_CLIENT_ID:
      return action.clientId;
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
  id,
  token,
  nickname,
});
