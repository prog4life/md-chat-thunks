import { combineReducers } from 'redux';
import {
  nicknameReducer,
  clientIdReducer,
  messagesReducer,
  typingReducer,
  readyStateReducer,
  unsentReducer
} from './reducers';

export default combineReducers({
  readyState: readyStateReducer,
  nickname: nicknameReducer,
  clientId: clientIdReducer,
  messages: messagesReducer,
  whoIsTyping: typingReducer,
  // TODO: rename to unsentReducer
  unsent: unsentReducer
});
