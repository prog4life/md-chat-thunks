import * as aT from 'constants/actionTypes';

export const websocketOpen = () => ({ type: aT.WEBSOCKET_OPEN });
export const websocketClosed = () => ({ type: aT.WEBSOCKET_CLOSED });

export const send = outgoing => (dispatch) => {
  dispatch({
    // type: 'WRITE_TO_SOCKET',
    payload: outgoing,
    meta: { socket: true },
  });
};
