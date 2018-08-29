import { combineReducers } from 'redux';

// import chat from './chat';
// import chats from './chats';
import auth from './auth'; // NOTE: or this way:
// import { clientReducer as client } from './client';
// import messages from './messages';
import posts from './posts';
import wall from './wall';

// exporting of rootReducer
export default combineReducers({
  // chat,
  // chats,
  auth,
  // client,
  // messages,
  posts,
  wall,
});
