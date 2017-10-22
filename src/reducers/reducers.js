export const readyStateReducer = (state = null, action) => {
  switch (action.type) {
    case 'WEBSOCKET_OPEN':
    case 'WEBSOCKET_CLOSE':
    case 'WEBSOCKET_ERROR':
      return action.readyState;
    default:
      return state;
  }
};

export const nicknameReducer = (state = '', action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const clientIdReducer = (state = '', action) => {
  switch (action.type) {
    case 'ID_RECEIVED':
      return action.id;
    default:
      return state;
  }
};

export const messagesReducer = (state = [], action) => {
  switch (action.type) {
    case 'MESSAGE_ADD':
      return [...state, action.message];
    default:
      return state;
  }
};

export const typingReducer = (state = [], action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const unsentReducer = (state = [], action) => {
  switch (action.type) {
    case 'UNSENT_ADD':
      return [...state, action.data];
    case 'UNSENT_CLEAR':
      return [];
    default:
      return state;
  }
};
