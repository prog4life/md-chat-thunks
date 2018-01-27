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
    default:
      return state;
  }
};

export default chats;
