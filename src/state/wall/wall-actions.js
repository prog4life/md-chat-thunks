import {
  JOIN_WALL, JOIN_WALL_SUCCESS, JOIN_WALL_FAIL, LEAVE_WALL, FETCH_WALL_ID,
} from 'state/action-types';

export const joinWall = (clientUid, wallId) => ({
  type: JOIN_WALL,
  payload: { clientUid, wallId },
});
export const joinWallSuccess = ({ entities, result }) => ({
  type: JOIN_WALL_SUCCESS,
  payload: { byId: entities.posts, ids: result },
});
export const joinWallFail = () => ({ type: JOIN_WALL_FAIL });
export const leaveWall = (uid, wallId) => ({
  type: LEAVE_WALL,
  payload: { uid, wallId },
});

export const fetchWallId = city => ({ type: FETCH_WALL_ID, city });
