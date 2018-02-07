import { combineReducers } from 'redux';

import chats from './chatsReducer';
import messages from './messagesReducer';
import {
  nickname,
  clientId,
  whoIsTyping,
  unsent
} from './reducers';

export default combineReducers({
  nickname,
  clientId,
  chats,
  messages,
  whoIsTyping,
  unsent
});
