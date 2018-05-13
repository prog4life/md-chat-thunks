import { WEBSOCKET_OPEN, WEBSOCKET_CLOSED } from 'constants/actionTypes';

export default function isWebsocketOpen(state = false, action) {
  switch (action.type) {
    case WEBSOCKET_OPEN:
      return true;
    case WEBSOCKET_CLOSED:
      return false;
    default:
      return state;
  }
}
