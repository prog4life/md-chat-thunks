// import { WEBSOCKET_OPEN, WEBSOCKET_CLOSED } from 'constants/actionTypes';

import { ActionTypes } from 'redux-mw-ws';

const { WEBSOCKET_CONNECTED, WEBSOCKET_DISCONNECTED } = ActionTypes;

const initialState = {
  isOpen: false,
  isClosed: true,
};

export default function websocket(state = initialState, action) {
  switch (action.type) {
    case WEBSOCKET_CONNECTED:
      return {
        isOpen: true,
        isClosed: false,
      };
    case WEBSOCKET_DISCONNECTED:
      return {
        isOpen: false,
        isClosed: true,
      };
    default:
      return state;
  }
}
