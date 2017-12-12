// import {
//   SEND_MESSAGE_ATTEMPT,
//   SEND_MESSAGE_SUCCESS,
//   SEND_MESSAGE_FAIL,
//   RECEIVE_MESSAGE,
//   SET_CLIENT_ID,
//   SET_NICKNAME,
//   RECEIVE_TYPING,
//   STOP_TYPING_NOTIFICATION,
//   PING,
//   PONG,
//   RECONNECT,
//   START_PING,
//   STOP_PING,
//   WEBSOCKET_CLOSING,
//   WEBSOCKET_OPEN,
//   WEBSOCKET_CLOSED,
//   WEBSOCKET_ERROR,
//   WEBSOCKET_CONNECTING
// } from 'constants/action-types';

import * as at from 'constants/action-types';

export const websocketStatus = (state = null, action) => {
  switch (action.type) {
    case at.WEBSOCKET_OPEN:
    case at.WEBSOCKET_CONNECTING:
    case at.WEBSOCKET_CLOSING:
    case at.WEBSOCKET_CLOSED:
    case at.WEBSOCKET_ERROR:
      return action.status;
    default:
      return state;
  }
};

export const connectionMonitoring = (state = { heartbeat: true }, action) => {
  switch (action.type) {
    case at.START_PING:
    case at.STOP_PING:
      return {
        ...state,
        intervalId: action.intervalId,
        heartbeat: action.heartbeat
      };
    case at.PING:
    case at.PONG:
    case at.RECONNECT:
      return {
        ...state,
        heartbeat: action.heartbeat
      };
    default:
      return state;
  }
};

export const nickname = (state = '', action) => {
  switch (action.type) {
    case at.SET_NICKNAME:
      return action.nickname;
    default:
      return state;
  }
};

export const clientId = (state = '', action) => {
  switch (action.type) {
    case at.SET_CLIENT_ID:
      return action.clientId;
    default:
      return state;
  }
};

export const messages = (state = [], action) => {
  switch (action.type) {
    case at.SEND_MESSAGE_ATTEMPT:
      return [...state, {
        ...action.message
      }];
    case at.SEND_MESSAGE_SUCCESS:
      return state.map((msg) => {
        if (msg.id === action.message.id) {
          return {
            ...action.message
          };
        }
        return msg;
      });
    case at.RECEIVE_MESSAGE:
      // TODO: check if such message already exist by comparing message ids
      return [...state, {
        ...action.message
      }];
    default:
      return state;
  }
};

export const whoIsTyping = (state = '', action) => {
  switch (action.type) {
    case at.RECEIVE_TYPING:
      return action.nickname;
    case at.STOP_TYPING_NOTIFICATION:
      return '';
    default:
      return state;
  }
};

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
