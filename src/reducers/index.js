import { combineReducers } from 'redux';
import {
  nicknameReducer, idReducer, messagesReducers, typingReducer
} from './reducers';

export default combineReducers({
  nickname: nicknameReducer,
  id: idReducer,
  messages: messagesReducers,
  whoIsTyping: typingReducer
});
