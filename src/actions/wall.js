// import {
//   LOAD_POSTS, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAIL,
// } from 'constants/actionTypes';
import {
  JOIN_WALL, JOIN_WALL_SUCCESS, JOIN_WALL_FAIL, LEAVE_WALL,
} from 'constants/actionTypes';
import * as wsKeys from 'constants/websocket-keys';

import { send, tryToSend } from 'actions';
import { getClientId } from 'reducers';

export const joinWallSuccess = ({ entities, result }) => ({
  type: JOIN_WALL_SUCCESS,
  payload: { byId: entities.posts, ids: result },
});

export const joinWallFail = () => ({ type: JOIN_WALL_FAIL });

export const joinWall = id => (dispatch, getState) => {
  const state = getState();
  // TODO: consider not using some id on client at all, just store id in
  // connection object on backend
  // const clientId = id || getClientId(state); // TODO: consider to use checkClientId instead

  console.log('CALL JOIN WALL');
  // if (state.wall.isConnecting || !clientId) {
  if (state.wall.isConnecting) { // TODO: replace this check to component ?
    return false;
  }
  dispatch({ type: JOIN_WALL });

  // const outgoing = { key: wsKeys.JOIN_WALL, clientId };
  const outgoing = { key: wsKeys.JOIN_WALL };

  // return dispatch(tryToSend(outgoing, null, {
  //   failAction: joinWallFail(),
  // }));
  return dispatch(send(outgoing));
};

export const leaveWall = id => (dispatch, getState) => {
  // const state = getState();
  // const { id: clientId } = state.client; // TODO: replace by selector and:
  // const clientId = id || state.client.id;

  dispatch({ type: LEAVE_WALL });

  // dispatch(tryToSend({ key: wsKeys.LEAVE_WALL, clientId }));
  // return dispatch(send({ key: wsKeys.LEAVE_WALL, clientId }));
  return dispatch(send({ key: wsKeys.LEAVE_WALL }));
};
