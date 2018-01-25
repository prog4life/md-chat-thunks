import { combineReducers } from 'redux';
import chats from 'reducers/chatsReducer';
import {
  nickname,
  clientId,
  messages,
  whoIsTyping,
  websocketStatus,
  connectionMonitoring,
  unsent
} from './reducers';

export default combineReducers({
  websocketStatus,
  nickname,
  clientId,
  chats,
  messages,
  whoIsTyping,
  connectionMonitoring,
  unsent
});
