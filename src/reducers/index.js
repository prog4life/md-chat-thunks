import { combineReducers } from 'redux';
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
  messages,
  whoIsTyping,
  connectionMonitoring,
  unsent
});
