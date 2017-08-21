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
    // TODO: check if it's better to place something into componentWillUpdate
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
      // TODO: bind this or wrap into arrow function
      addOnMessageListener(websocket, {
        messageCallback: this.incomingMessageCallback.bind(this),
        typingCallback: this.incomingTypingCallback.bind(this)
      });
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
    addOnMessageListener(this.websocket, {
      // immediate call with done, callback returned
      idCallback: this.incomingIdCallback(done)
    });
    this.websocket.send(JSON.stringify({
      type: 'GET_ID'
    }));
  }
  incomingIdCallback(done) {
    return (extractedData) => {
      this.clientId = extractedData.id;
      // TODO: check if function passed
      done(extractedData.id);
    };
  }
  incomingMessageCallback(extractedData) {
    this.setState((prevState, props) => {
      return {
        messages: extractedData.message
          // NOTE: maybe replace with array + spread off:
          // [...prevState.messages, extractedData.message]
          ? prevState.messages.concat(extractedData.message)
          : prevState.messages
      };
    });
  }
  incomingTypingCallback(extractedData) {
    this.setState((prevState, props) => {
      return {
        whoIsTyping: extractedData.whoIsTyping || prevState.whoIsTyping
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

    // IDEA: store outgoing as this.unsent [], check it in componentDidUpdate
    // and send all data if not empty + clear array

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
