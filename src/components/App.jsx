import React from 'react';

import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import startWs, {setOnMessageHandler} from '../api/websocket';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '005',
      nickname: 'React Learner',
      messages: [
        {
          id: '32425gser27408908',
          nickname: 'test user',
          message: 'Sample test user message'
        }
      ]
    };
  }
  componentDidMount() {
    startWs((websocket) => {
      this.setState({
        websocket
      }, onSetState);
    });

    var that = this;

    function onSetState() {
      setOnMessageHandler(that.state.websocket, messageEventCallback);
    }

    const messageEventCallback = (error, stateUpdates) => {
      this.setState({
        // ...this.state,
        id: stateUpdates.id ? stateUpdates.id : this.state.id,
        websocket: this.state.websocket,
        nickname: this.state.nickname,
        messages: stateUpdates.message
          ? this.state.messages.concat(stateUpdates.message)
          : this.state.messages
        // isWriting: stateUpdates.isWriting
        //   ? stateUpdates.isWriting
        //   : this.state.isWriting,
        // participants: 43
      });
    };
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('New state', this.state);
    console.log('prevProps ', prevProps);
    console.log('prevState ', prevState);
    console.log('this.state.websocket.onmessage ', this.state.websocket.onmessage);
  }
  render() {
    return (
      <div className="chat-app">
        <h3>Chat App</h3>
        <ChatHistory>
          <ChatMessage/>
        </ChatHistory>
        <ChatInput/>
      </div>
    );
  }
}
