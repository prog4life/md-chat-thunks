export const websocketStatus = (state = null, action) => {
  switch (action.type) {
    case 'WEBSOCKET_OPEN':
    case 'WEBSOCKET_CONNECTING':
    case 'WEBSOCKET_CLOSING':
    case 'WEBSOCKET_CLOSED':
    case 'WEBSOCKET_ERROR':
      return action.status;
    default:
      return state;
  }
};

// export const connectionMonitoring = (state = {}, action) => {
//   switch (action.type) {
//     case 'START_PING':
//       return;
//     case 'STOP_PING':
//       return;
//     case 'PING':
//       return;
//     case 'PONG':
//       return;
//     case 'REOPENING':
//       return;
//     default:
//       return state;
//   }
// }

export const nickname = (state = '', action) => {
  switch (action.type) {
    case 'SET_NICKNAME':
      return action.nickname;
    default:
      return state;
  }
};

export const clientId = (state = '', action) => {
  switch (action.type) {
    case 'SET_CLIENT_ID':
      return action.clientId;
    default:
      return state;
  }
};

export const messages = (state = [], action) => {
  switch (action.type) {
    case 'SEND_MESSAGE_ATTEMPT':
      return [...state, {
        ...action.message
      }];
    case 'SEND_MESSAGE_SUCCESS':
      return state.map((msg) => {
        if (msg.id === action.message.id) {
          return {
            ...msg,
            status: 'SENT'
          };
        }
        return msg;
      });
    case 'RECEIVE_MESSAGE':
      // TODO: check if such message already exist by comparing message ids
      return [...state, {
        ...action.message
      }];
    // case 'SEND_MESSAGE_FAIL':
      // return [...state, action.message];
    default:
      return state;
  }
};

export const whoIsTyping = (state = '', action) => {
  switch (action.type) {
    case 'RECEIVE_TYPING':
      return action.nickname;
    case 'STOP_TYPING_NOTIFICATION':
      return '';
    default:
      return state;
  }
};

export const unsent = (state = [], action) => {
  switch (action.type) {
    case 'SEND_MESSAGE_SUCCESS':
      return state.filter(msg => action.message.id !== msg.id);
    case 'SEND_MESSAGE_FAIL':
      return [...state, {
        ...action.message
      }];
    case 'CLEAR_UNSENT':
      return [];
    default:
      return state;
  }
};
