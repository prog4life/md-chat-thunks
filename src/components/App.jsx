import React from 'react';
import shortid from 'shortid';

import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import TypingNotification from './TypingNotification';
import openWebSocket, {addOnMessageListener} from '../api/websocket';
import animationConfig from '../helpers/animation';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: '',
      // TODO: change to form in ChatInput and make it controlled
      messageText: '',
      messages: [
        {
          id: '32425gser27408908',
          nickname: 'test user',
          text: 'Sample test user message'
        }
      ],
      // TODO: remove from state ?
      whoIsTyping: []
    };

    this.handleTypingAnimationEnd = this.handleTypingAnimationEnd.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }
  componentDidMount() {
    this.startWebSocket(() => {
      this.checkId((id) => console.log('Checked id: ', id));
    });
  }
  componentDidUpdate(prevProps, prevState) {
    // console.log('prevState ', prevState);
    // TODO: handle id absence
    if (this.websocket.readyState !== WebSocket.OPEN) {
      console.log('webscoket readystate is not OPEN');
      this.startWebSocket(() => {
        this.checkId((id) => console.log('Checked id: ', id));
      });
    }

    if (!this.clientId) {
      this.getNewId((id) => console.log('Received new id: ', id));
    }
  }
  componentWillUnmount() {
    // doublecheck
    clearInterval(this.websocketIntervalId);
  }
  startWebSocket(done) {
    const handleOpen = (websocket) => {
      this.websocket = websocket;
      // TODO: probably need to bind this or wrap into arrow function
      addOnMessageListener(websocket, this.incomingMessageHandler.bind(this));
      addOnMessageListener(websocket, this.incomingTypingHandler.bind(this));
      // TODO: check if function passed
      done(websocket);
    };

    openWebSocket(handleOpen);

    this.websocketIntervalId = setInterval(() => {
      if (this.websocket.readyState === WebSocket.OPEN) {
        clearInterval(this.websocketIntervalId);
        return;
      }
      openWebSocket(handleOpen);
    }, 1000);
  }
  checkId(done) {
    if (this.clientId) {
      this.websocket.send(JSON.stringify({
        id: this.clientId,
        type: 'HAS_ID'
      }));
      // TODO: check if function passed
      done(this.clientId);
    } else {
      this.getNewId(done);
    }
  }
  getNewId(done) {
    addOnMessageListener(this.websocket, (receivedData) => {
      // TODO: remove this check after splitting listeners setter in websocket.js
      if (!receivedData.id) {
        console.log('getNewId without id: ', receivedData);
        return;
      }
      this.clientId = receivedData.id;
      // TODO: check if function passed
      done(receivedData.id);
    });
    this.websocket.send(JSON.stringify({
      type: 'GET_ID'
    }));
  }
  incomingMessageHandler(receivedData) {
    // TODO: remove this check after splitting listeners setter in websocket.js
    if (!receivedData.message) {
      console.log('incomingMessageHandler without message: ', receivedData);
      return;
    }
    this.setState((prevState, props) => {
      return {
        messages: receivedData.message
          // NOTE: maybe replace with array + spread off:
          // [...prevState.messages, receivedData.message]
          ? prevState.messages.concat(receivedData.message)
          : prevState.messages
      };
    });
  }
  incomingTypingHandler(receivedData) {
    // TODO: remove this check after splitting listeners setter in websocket.js
    if (!receivedData.whoIsTyping) {
      console.log('incomingTypingHandler without whoIsTyping: ', receivedData);
      return;
    }
    this.setState((prevState, props) => {
      return {
        whoIsTyping: receivedData.whoIsTyping || prevState.whoIsTyping
      };
    });
  }
  handleSendMessage(nickname, text) {
    // TODO: check if socket readyState is OPEN, create connection if not
    // TODO: chaeck id presence
    // NOTE: can check for new message in componentDidUpdate and send from there
    // TODO: try currying here = id => () => { }
    const onReadyToSend = () => {
      // save sent message to state for rendering
      this.setState({
        nickname,
        messages: this.state.messages.concat({
          // TODO: remove from here and check id presence before setState
          id: this.clientId,
          isNotification: false,
          nickname: 'Me',
          text
        })
      });
      const outgoingData = {
        id: this.clientId,
        name: nickname,
        text,
        type: 'MESSAGE'
      };

      this.websocket.send(JSON.stringify(outgoingData));
    };

    if (this.websocket.readyState !== WebSocket.OPEN) {
      // TODO: consider passing checkId and onReadyToSend directly as param
      this.startWebSocket(() => {
        this.checkId((id) => {
          console.log('Check id in handleSendMessage', id);
          onReadyToSend();
        });
      });
    }

    if (!this.clientId) {
      this.getNewId((id) => {
        console.log('Received new id in handleSendMessage: ', id);
        onReadyToSend();
      });
    }
    onReadyToSend();
  }
  renderMessageList() {
    return this.state.messages.map((message) => (
      // TODO: replace key value by client id from message
      <ChatMessage key={shortid.generate()} {...message} />));
  }
  handleTypingAnimationEnd() {
    // remove one, whose typing notification was shown, after showing it
    this.setState({
      whoIsTyping: []
    });
  }
  handleTyping(event) {
    if (this.state.nickname.length < 2) {
      return;
    }
    this.websocket.send(JSON.stringify({
      id: this.clientId,
      name: this.state.nickname,
      type: 'IS_TYPING'
    }));
  }
  render() {
    return (
      <div className="chat-app">
        <h3>Lil Chat</h3>
        <ChatHistory messages={this.state.messages}>
          {this.renderMessageList()}
        </ChatHistory>
        <TypingNotification
          whoIsTyping={this.state.whoIsTyping}
          config={animationConfig}
          onStop={this.handleTypingAnimationEnd}
        />
        <ChatInput
          onTyping={this.handleTyping}
          onSendMessage={this.handleSendMessage}
        />
      </div>
    );
  }
}
