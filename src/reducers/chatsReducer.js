const chats = (state = [], action) => {
  switch (action.type) {
    case 'ADD_CHAT':
      return [
        ...state,
        {
          chatId: action.chatId,
          participants: [...action.participants]
        }
      ];
    case 'DELETE_CHAT':
      return state.filter(chat => chat.chatId !== action.chatId);
    default:
      return state;
  }
};

export default chats;
