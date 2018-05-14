import { ActionTypes } from 'redux-mw-ws';

const initialState = {
  isConnected: false,
  receivedData: {},
  errorMessage: '',
  endpoint: '',
};

export default function routeWebsocket(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.WEBSOCKET_CONNECTED:
      return {
        ...state,
        isConnected: true,
        endpoint: action.meta.socket,
      };
    case ActionTypes.WEBSOCKET_DISCONNECTED:
      return {
        ...state,
        isConnected: false,
        endpoint: action.meta.socket,
      };
    case ActionTypes.RECEIVED_WEBSOCKET_DATA:
      return {
        ...state,
        receivedData: action.payload,
        endpoint: action.meta.socket,
      };
    case ActionTypes.WEBSOCKET_ERROR:
      return {
        ...state,
        errorMessage: action.payload.message,
        endpoint: action.meta.socket,
      };
    default:
      return state;
  }
}
