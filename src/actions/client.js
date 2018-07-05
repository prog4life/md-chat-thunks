import {
  SIGN_IN, SET_TOKEN, REQUEST_CLIENT_ID, SET_CLIENT_ID, SET_NICKNAME,
} from 'constants/actionTypes';
import * as wsKeys from 'constants/websocket-keys';

import { send, tryToSend } from 'actions';
import { getClientId } from 'reducers';

// TODO: replace to constants
export const WEBSOCKET_ENDPOINT = 'ws://localhost:8787';

// export const setLogin = login => ({
//   type: SET_LOGIN,
//   login,
// });

export const signIn = login => (dispatch) => {
  const outgoing = { key: wsKeys.SIGN_IN, login };

  dispatch({ type: SIGN_IN });
  // dispatch(tryToSend(outgoing, true));
  dispatch(send(outgoing));
};

export const requestClientId = () => (dispatch) => {
  const outgoing = { key: wsKeys.GET_ID };

  dispatch({ type: REQUEST_CLIENT_ID });
  // dispatch(tryToSend(outgoing, true));
  dispatch(send(outgoing));
};

export const checkClientId = id => (dispatch, getState) => {
  const clientId = id || getClientId(getState());

  if (!clientId) {
    dispatch(requestClientId());
    return null;
  }
  return clientId;
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
