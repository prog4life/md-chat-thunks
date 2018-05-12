import { combineReducers } from 'redux';

import chats from './chatsReducer';
import messages from './messagesReducer';
import publicWall from './publicWall';
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
});
