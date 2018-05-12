// import {
//   LOAD_POSTS, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAIL,
// } from 'constants/action-types';
import {
  JOIN_WALL, JOIN_WALL_SUCCESS, JOIN_WALL_FAIL, LEAVE_WALL,
} from 'constants/action-types';

import { tryToSend } from './connection';

export const joinWallSuccess = ({ entities, result }) => ({
  type: JOIN_WALL_SUCCESS,
  payload: { byId: entities.posts, ids: result },
});

export const joinWallFail = () => ({ type: JOIN_WALL_FAIL });

export const joinWall = () => (dispatch) => {
  dispatch({ type: JOIN_WALL });

  tryToSend({ type: 'JOIN-THE-WALL' }, null, {
    failAction: joinWallFail(),
  });
};

export const leaveTheWall = () => (dispatch) => {
  dispatch({ type: LEAVE_WALL });

  tryToSend({ type: 'LEAVE-THE-WALL' });
};
