const websocketMsgHandlers = {
  THIRD_TYPE_MSG: (incoming) => {
    dispathc(addSomething(incoming.goods));
    dispatch(doSecond());
  },
  ANOTHER_TYPE(incoming) {
    console.log(incoming.msg);
  }
};

const routeIncoming = (incoming, handlers = websocketMsgHandlers) => {
  handlers[incoming.type](incoming);
};

// const routeIncoming = (incoming, handlers) => {
//   let handlerName = '';

//   handlerName = incoming.type.toLowerCase().split('_').map((piece, index) => (
//     index === 0
//       ? piece
//       : piece.charAt(0).toUpperCase() + piece.slice(1)
//   )).join('');

//   handlers[handlerName]();
// };

// routeIncoming({ type: 'ANOTHER_TYPE', msg: 'Yay' }, websocketMsgHandlers);
routeIncoming({ type: 'ANOTHER_TYPE', msg: 'Yay' });

// export default routeIncoming;
