import { WEBSOCKET_OPEN, WEBSOCKET_CLOSED } from 'constants/actionTypes';

const initialState = {
  isOpen: false,
  isClosed: true,
};

export default function websocket(state = initialState, action) {
  switch (action.type) {
    case WEBSOCKET_OPEN:
      return {
        isOpen: true,
        isClosed: false,
      };
    case WEBSOCKET_CLOSED:
      return {
        isOpen: false,
        isClosed: true,
      };
    default:
      return state;
  }
}
