import { ActionTypes } from 'redux-mw-ws';

const { WEBSOCKET_CONNECTED, WEBSOCKET_DISCONNECTED } = ActionTypes;

const initialState = {
  isOpen: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case WEBSOCKET_CONNECTED:
      return {
        isOpen: true,
      };
    case WEBSOCKET_DISCONNECTED:
      return {
        isOpen: false,
      };
    default:
      return state;
  }
}
