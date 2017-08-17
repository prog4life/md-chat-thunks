import React from 'react';
import PropTypes from 'prop-types';

import FadingText from './FadingText';

export default class TypingNotification extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.whoIsTyping[0] === nextProps.whoIsTyping[0]) {
      return false;
    } // TODO: also return false if nextProps.whoIsTyping[0] == false
    return true;
  }
  renderNotification() {
    const {
      whoIsTyping: [whoIsTyping],
      config
    } = this.props;

    // TODO: use next variant, temporarily Object.assign is used instead
    // let updConfig = {
    //   ...this.props.config
    // };

    const updConfig = {};

    Object.assign(updConfig, config);
    // if (!whoIsTyping) {
    //   return (
    //     <div className="noanimation-text">
    //       {config.placeholderText}
    //     </div>
    //   );
    // }
    if (whoIsTyping) {
      updConfig.textToShow = `${whoIsTyping} is typing`;
    }
    return (
      <FadingText
        onAnimationEnd={this.props.onStop}
        {...updConfig}
      />
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

TypingNotification.propTypes = {
  config: PropTypes.object.isRequired,
  onStop: PropTypes.func.isRequired,
  // shouldDisplay: PropTypes.bool.isRequired,
  whoIsTyping: PropTypes.arrayOf(PropTypes.string).isRequired
};

// export default class TypingNotification extends React.Component {
//   componentDidUpdate(prevProps, prevState) {
//     if (this.props.whoIsTyping.length === 0) {
//       return;
//     }
//     this.props.handleShowTyping(this.refs.typingText);
//   }
//   shouldComponentUpdate() {
//     if (this.props.shouldDisplay) {
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
