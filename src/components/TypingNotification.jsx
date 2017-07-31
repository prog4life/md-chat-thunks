import React from 'react';

import FadingText from './FadingText';

export default class TypingNotification extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    if (this.props.whoIsTyping[0] !== prevProps.whoIsTyping[0]) {
      // TODO: removing to early, need to remove after fading have ended
      this.props.onShowing();
    }
  }
  render() {
    const showWhosTyping = () => {
      const dataForProps = {
        placeholderText: 'No one is typing',
        textToFade: '',
        repeats: 3,
        duration: 1800,
        steps: 10,
        bidirectional: true
      };

      if (this.props.whoIsTyping.length === 1) {
        dataForProps.textToFade = `${this.props.whoIsTyping[0]} is typing`;
      }
      return <FadingText {...dataForProps}/>;
    };

    return (
      <div className="typing-notif">
        {showWhosTyping()}
      </div>
    );
  }
}

// export default class TypingNotification extends React.Component {
//   componentDidUpdate(prevProps, prevState) {
//     if (this.props.whoIsTyping.length === 0) {
//       return;
//     }
//     this.props.handleShowTyping(this.refs.typingText);
//   }
//   shouldComponentUpdate() {
//     if (this.props.isTypingAnimationOn) {
//       return false;
//     }
//     return true;
//   }
//   render() {
//     const showWhosTyping = () => {
//       if (this.props.whoIsTyping.length === 1) {
//         return `${this.props.whoIsTyping[0]} is typing`;
//       }
//       return `No one is typing`;
//     };
//     return (
//       <div className="typing">
//         <p className="typing-text" ref="typingText">{showWhosTyping()}</p>
//       </div>
//     );
//   }
// }
