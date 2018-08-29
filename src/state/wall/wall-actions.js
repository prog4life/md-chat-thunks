import {
  JOIN_WALL, JOIN_WALL_SUCCESS, JOIN_WALL_FAIL, LEAVE_WALL, FETCH_WALL_ID,
} from 'state/action-types';
import shortId from 'shortid';

const WALL_CONNECT = 'Wall::Connect';
const WALL_CONNECT_OK = 'Wall::Connect::OK';
const WALL_CONNECT_ERR = 'Wall::Connect::Error';

// export const joinWall = (userId, wallId) => ({
//   type: JOIN_WALL,
//   payload: { userId, wallId },
// });
export const joinWall = (userId, wallId) => (dispatch, getState, socket) => {
  const city = 'Singapore';
  dispatch({ type: JOIN_WALL, userId, city });

  const outgoing = JSON.stringify({ userId: shortId.generate(), city });

  socket.emit(WALL_CONNECT, outgoing);
  socket.on(WALL_CONNECT_OK, (data) => {
    dispatch({ type: 'JOIN_WALL_OK', data });
  });
  socket.on(WALL_CONNECT_ERR, (data) => {
    dispatch({ type: 'JOIN_WALL_ERROR', data });
  });
};
export const joinWallSuccess = ({ entities, result }) => ({
  type: JOIN_WALL_SUCCESS,
  payload: { byId: entities.posts, ids: result },
});
export const joinWallFail = () => ({ type: JOIN_WALL_FAIL });
export const leaveWall = (userId, wallId) => ({
  type: LEAVE_WALL,
  payload: { userId, wallId },
});

export const fetchWallId = city => ({ type: FETCH_WALL_ID, city });
