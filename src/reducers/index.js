import { combineReducers } from 'redux';

import chats from './chatsReducer';
import messages from './messagesReducer';
import publicWall from './publicWall';
import isWebsocketOpen from './isWebsocketOpen';
import {
  nickname,
  clientId,
  whoIsTyping,
  unsent,
} from './reducers';

// exporting of rootReducer
export default combineReducers({
  nickname,
  clientId,
  chats,
  messages,
  publicWall,
  whoIsTyping,
  unsent,
  isWebsocketOpen,
});

export const getClientId = state => state.clientId;
export const getPosts = state => Object.values(state.publicWall.postsById);
export const isWebsocketOpenSelector = state => state.isWebsocketOpen;
export const isWallTrackedSelector = state => state.publicWall.isTracked;
