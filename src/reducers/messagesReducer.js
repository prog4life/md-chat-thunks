import {
  SEND_MESSAGE_ATTEMPT,
  SEND_MESSAGE_SUCCESS,
  RECEIVE_MESSAGE
} from 'constants/action-types';

// TODO: add queued/postponed status
export const message = (state, action) => {
  switch (action.type) {
    case SEND_MESSAGE_ATTEMPT:
      return {
        ...action.message
      };
    case SEND_MESSAGE_SUCCESS:
      if (state.id === action.message.id) {
        return {
          ...state,
          status: action.message.status
        };
      }
      return state;
    case RECEIVE_MESSAGE:
      return {
        ...action.message
      };
    default:
      return state;
  }
};

// NOTE: think over storing messages as obj with id as property names
const messages = (state = [], action) => {
  switch (action.type) {
    case SEND_MESSAGE_ATTEMPT:
      return [...state, message(undefined, action)];
    case SEND_MESSAGE_SUCCESS:
      return state.map(msg => message(msg, action));
    case RECEIVE_MESSAGE:
      // TODO: check if such message already exists by comparing message ids
      return [...state, message(undefined, action)];
    default:
      return state;
  }
};

export default messages;
