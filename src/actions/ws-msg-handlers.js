import * as wsKeys from 'constants/websocket-keys';
import { joinWallSuccess } from 'actions';
import { normalize } from 'normalizr';
import { postsList } from './schemas';

const websocketMessageHandlers = {
  // SET_ID: ({ clientId }, dispatch) => dispatch(setClientId(clientId)),
  // [wsKeys.SIGN_IN]: ({ clientId, token }, dispatch) => {
  [wsKeys.SIGN_IN]: (incoming, dispatch) => {
    console.log('WS message from server ', incoming);
    // dispatch(setClientId(clientId));
    // dispatch(setToken(token));
  },
  // [wsKeys.SIGN_UP]: ({ clientId, token }, dispatch) => {
  [wsKeys.SIGN_UP]: (incoming, dispatch) => {
    console.log('WS message from server ', incoming);
    // dispatch(setClientId(clientId));
    // dispatch(setToken(token));
  },
  [wsKeys.JOIN_WALL]: (incoming, dispatch) => {
    console.log('WS message from server ', incoming);
    const normalized = normalize(incoming.posts, postsList);
    console.log('NORMALIZED response ', normalized);
    dispatch(joinWallSuccess(normalized));
  },
};

export default websocketMessageHandlers;
