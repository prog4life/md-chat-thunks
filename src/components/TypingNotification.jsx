import React from 'react';

import FadingText from './FadingText';

export default class TypingNotification extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    // TODO: need another check, fires unnecessarily
    if (this.props.whoIsTyping[0] !== prevProps.whoIsTyping[0]) {
      // TODO: removing to early, need to remove after fading have ended
      // this.props.onAnimationSwitch();
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log(`shouldComponentUpdate nextProps %o
      this.props %o
      and nextState %o`, nextProps, this.props, nextState);
    return !nextProps.isTypingAnimationOn;
  }
  renderNotification() {
    const {
      whoIsTyping: [whoIsTyping],
      isTypingAnimationOn,
      animationConfig
    } = this.props;

    if (!isTypingAnimationOn && !whoIsTyping) {
      return (
        <div className="noanimation-text">
          {animationConfig.placeholderText}
        </div>
      );
    }
    if (!isTypingAnimationOn && whoIsTyping) {
      animationConfig.textToShow = `${whoIsTyping} is typing`;
    }
    return (
      <FadingText
        onAnimationSwitch={this.props.onAnimationSwitch}
        {...animationConfig} />
    );
  }
  render() {
    return (
      <div className="typing-notif">
        {this.renderNotification()}
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
//     const renderNotification = () => {
//       if (this.props.whoIsTyping.length === 1) {
//         return `${this.props.whoIsTyping[0]} is typing`;
//       }
//       return `No one is typing`;
//     };
//     return (
//       <div className="typing">
//         <p className="typing-text" ref="typingText">{renderNotification()}</p>
//       </div>
//     );
//   }
// }
