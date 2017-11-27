import { combineReducers } from 'redux';
import {
  nicknameReducer,
  clientIdReducer,
  messagesReducer,
  typingReducer,
  websocketStatusReducer,
  unsentReducer
} from './reducers';

export default combineReducers({
  websocketStatus: websocketStatusReducer,
  nickname: nicknameReducer,
  clientId: clientIdReducer,
  messages: messagesReducer,
  whoIsTyping: typingReducer,
  unsent: unsentReducer
});
