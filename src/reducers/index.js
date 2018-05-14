import { combineReducers } from 'redux';

import chats from './chatsReducer';
import messages from './messagesReducer';
import wall from './wall';
import isWebsocketOpen from './isWebsocketOpen';
import client from './client';
import {
  // nickname,
  // clientId,
  whoIsTyping,
  unsent,
} from './reducers';

import websocket from './routeWebsocket';

// exporting of rootReducer
export default combineReducers({
  client,
  // nickname,
  // clientId,
  chats,
  messages,
  wall,
  whoIsTyping,
  unsent,
  isWebsocketOpen,
  websocket,
});

export const getClientId = state => state.client.id;
export const getChats = state => state.chats;
export const getPosts = state => Object.values(state.wall.postsById);
export const isWebsocketOpenSelector = state => state.isWebsocketOpen;
export const isWallTrackedSelector = state => state.wall.isTracked;
