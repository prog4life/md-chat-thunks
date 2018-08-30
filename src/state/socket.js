import * as aT from 'state/action-types';
import * as sE from 'constants/socket-events';
import { loginAnonSucces, loginAnonFail } from 'state/auth';
import { joinWallSucces, joinWallFail } from 'state/wall';
import { toJSON, parseJSON } from 'utils';

export const socketEventHandlers = {
  [sE.AUTH_ANON_OK]: data => dispatch => dispatch(loginAnonSucces(data)),
  [sE.AUTH_ANON_ERR]: data => dispatch => dispatch(loginAnonFail(data)),
  [sE.WALL_CONNECT_DONE]: data => dispatch => dispatch(joinWallSucces(data)),
  [sE.WALL_CONNECT_ERR]: data => dispatch => dispatch(joinWallFail(data)),
};

export default function setSocketListeners() {
  return (dispatch, getState, socket) => {
    // add listeners for each socket event from server
    Object.keys(socketEventHandlers).forEach((event) => {
      socket.on(event, (income) => {
        const received = parseJSON(income);
        // NOTE:
        // scoketEventHandlers[event](received, { dispatch, getState, socket });
        dispatch(socketEventHandlers[event](received));
      });
    });
  };
}
