// import {
//   SEND_MESSAGE_ATTEMPT,
//   SEND_MESSAGE_SUCCESS,
//   SEND_MESSAGE_FAIL,
//   RECEIVE_MESSAGE,
//   SET_CLIENT_ID,
//   SET_NICKNAME,
//   RECEIVE_TYPING,
//   STOP_TYPING_NOTIFICATION,
// } from 'constants/action-types';

import * as at from 'constants/action-types';

export const nickname = (state = '', action) => {
  switch (action.type) {
    case at.SET_NICKNAME:
      return action.nickname;
    default:
      return state;
  }
};

export const clientId = (state = null, action) => {
  switch (action.type) {
    case at.SET_CLIENT_ID:
      return action.clientId;
    default:
      return state;
  }
};

export const whoIsTyping = (state = '', { type, nickname }) => {
  switch (type) {
    case at.RECEIVE_TYPING:
      return nickname;
    case at.STOP_TYPING_NOTIFICATION:
      return state === nickname || !nickname ? '' : state;
    default:
      return state;
  }
};

// NOTE: think over storing unsents as obj with id as property names
export const unsent = (state = [], action) => {
  switch (action.type) {
    case at.SEND_MESSAGE_SUCCESS:
      return state.filter(msg => action.message.id !== msg.id);
    case at.SEND_MESSAGE_FAIL:
      return [...state, {
        ...action.message
      }];
    default:
      return state;
  }
};
