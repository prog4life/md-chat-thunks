import React from 'react';
import PropTypes from 'prop-types';

import FadingText from './FadingText';

export default class TypingNotification extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.whoIsTyping[0] === nextProps.whoIsTyping[0]) {
      return false;
    }
    return true;
  }
  renderNotification() {
    const {
      whoIsTyping: [whoIsTyping],
      config
    } = this.props;

    // TODO: use next variant, temporarily Object.assign is used instead
    // let updatedConfig = {
    //   ...this.props.config
    // };

    const updatedConfig = {};

    Object.assign(updatedConfig, config);

    if (whoIsTyping) {
      updatedConfig.textToShow = `${whoIsTyping} is typing`;
      return (
        <FadingText
          onAnimationEnd={this.props.onStop}
          {...updatedConfig}
        />
      );
    }
    return config.placeholderText;
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
  config: PropTypes.shape({
    placeholderText: PropTypes.string,
    textToShow: PropTypes.string,
    repeats: PropTypes.number,
    duration: PropTypes.number,
    bidirectional: PropTypes.bool
  }).isRequired,
  onStop: PropTypes.func.isRequired,
  whoIsTyping: PropTypes.arrayOf(PropTypes.string).isRequired
};
