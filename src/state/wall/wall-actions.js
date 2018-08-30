import {
  JOIN_WALL, JOIN_WALL_SUCCESS, JOIN_WALL_FAIL, LEAVE_WALL, FETCH_WALL_ID,
} from 'state/action-types';
import shortId from 'shortid';
import * as sE from 'constants/socket-events';
import { toJSON, parseJSON } from 'utils';

// export const joinWall = (userId, wallId) => ({
//   type: JOIN_WALL,
//   payload: { userId, wallId },
// });
export const joinWall = (userId, wallId) => (dispatch, getState, socket) => {
  const city = 'Singapore';
  dispatch({ type: JOIN_WALL, userId, city });

  const outgoing = toJSON({ userId: shortId.generate(), city });

  socket.emit(sE.WALL_CONNECT, outgoing);
  socket.on(sE.WALL_CONNECT_DONE, (data) => {
    dispatch({ type: 'JOIN_WALL_OK', data });
  });
  socket.on(sE.WALL_CONNECT_ERR, (data) => {
    dispatch({ type: 'JOIN_WALL_ERROR', data });
  });
};
export const joinWallSuccess = ({ entities, result }) => ({
  type: JOIN_WALL_SUCCESS,
  payload: { byId: entities.posts, ids: result },
});
export const joinWallFail = () => ({ type: JOIN_WALL_FAIL });

export const leaveWall = (userId, wallId) => (dispatch, getState, socket) => {
  dispatch({ type: JOIN_WALL, payload: { userId, wallId } });
  socket.emit(sE.WALL_DISCONNECT, toJSON({ userId, wallId }));
};

export const fetchWallId = city => ({ type: FETCH_WALL_ID, city });
