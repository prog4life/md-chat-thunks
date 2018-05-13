// import {
//   LOAD_POSTS, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAIL,
// } from 'constants/actionTypes';
import {
  JOIN_WALL, JOIN_WALL_SUCCESS, JOIN_WALL_FAIL, LEAVE_WALL,
} from 'constants/actionTypes';

import { tryToSend } from './connection';

export const joinWallSuccess = ({ entities, result }) => ({
  type: JOIN_WALL_SUCCESS,
  payload: { byId: entities.posts, ids: result },
});

export const joinWallFail = () => ({ type: JOIN_WALL_FAIL });

export const joinWall = id => (dispatch, getState) => {
  const state = getState();
  // const { id: clientId } = state.client; // TODO: replace by selector and:
  const clientId = id || state.client.id;

  console.log('CALL JOIN WALL');
  if (state.wall.isConnecting) {
    return null;
  }
  dispatch({ type: JOIN_WALL });

  const outgoing = { type: 'Join_Wall', clientId };

  return dispatch(tryToSend(outgoing, null, {
    failAction: joinWallFail(),
  }));
};

export const leaveWall = id => (dispatch, getState) => {
  const state = getState();
  // const { id: clientId } = state.client; // TODO: replace by selector and:
  const clientId = id || state.client.id;

  dispatch({ type: LEAVE_WALL });

  dispatch(tryToSend({ type: 'Leave_Wall', clientId }));
};
