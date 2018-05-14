import {
  SET_TOKEN, GET_CLIENT_ID, SET_CLIENT_ID, SET_NICKNAME,
} from 'constants/actionTypes';

import { tryToSend } from './connection';

// export const setLogin = login => ({
//   type: SET_LOGIN,
//   login,
// });

export const signIn = login => (dispatch) => {
  const outgoing = { type: 'SIGN_IN', login };

  dispatch(tryToSend(outgoing, true));
};

export const getClientId = () => (dispatch) => {
  const outgoing = { type: 'GET_ID' };

  dispatch({ type: GET_CLIENT_ID });
  // dispatch(tryToSend(outgoing, true));
  dispatch({
    // type: 'WRITE_TO_SOCKET',
    payload: outgoing,
    meta: { socket: true },
  });
};

export const setClientId = clientId => ({
  type: SET_CLIENT_ID,
  clientId,
});

export const setToken = token => ({
  type: SET_TOKEN,
  token,
});

export const setNickname = nickname => ({
  type: SET_NICKNAME,
  nickname,
});
