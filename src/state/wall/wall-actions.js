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
  const outgoing = toJSON({ userId: shortId.generate(), city });

  dispatch({ type: JOIN_WALL, userId, city });
  socket.emit(sE.WALL_CONNECT, outgoing);
};

export const joinWallSucces = ({ wallId, city }) => ({
  type: JOIN_WALL_SUCCESS,
  payload: { wallId, city },
});

export const joinWallFail = ({ message }) => ({
  type: JOIN_WALL_FAIL,
  payload: new Error(message), // TODO: converError({ code, message });
  error: true,
});

export const leaveWall = (userId, wallId) => (dispatch, getState, socket) => {
  dispatch({ type: JOIN_WALL, payload: { userId, wallId } });
  socket.emit(sE.WALL_DISCONNECT, toJSON({ userId, wallId }));
};

export const fetchWallId = city => ({ type: FETCH_WALL_ID, city });
