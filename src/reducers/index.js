import { combineReducers } from 'redux';
import {
  nickname,
  clientId,
  messages,
  typing,
  websocketStatus,
  unsent
} from './reducers';

export default combineReducers({
  websocketStatus,
  nickname,
  clientId,
  messages,
  typing,
  unsent
});
