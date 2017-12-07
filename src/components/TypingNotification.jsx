import React from 'react';
import PropTypes from 'prop-types';

import FadeInOutText from './FadeInOutText';

export default class TypingNotification extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    // console.log(`TypingNotif scu nextProps === this.props:
    // ${nextProps === this.props} ---------------------TypingNotif scu START`);
    // console.log('TypingNotif scu this.props: ', this.props);
    // console.log('TypingNotif scu nextProps: ', nextProps);
    // if (this.props.whoIsTyping === nextProps.whoIsTyping) {
    //   console.log(`---------------------------------------------------------
    //                ---------------------------- TypingNotif scu END false`);
    //   return false;
    // }
    // console.log(`-----------------------------------------------------------
    //              -------------------------------- TypingNotif scu END true`);
    return true;
  }
  renderNotification() {
    const {
      whoIsTyping,
      config
    } = this.props;

    return (
      <FadeInOutText
        onAnimationEnd={this.props.onNotificationEnd}
        textToShow={whoIsTyping ? `${whoIsTyping} is typing` : ''}
        {...config}
      />
    );

    // TODO: use next variant, temporarily Object.assign is used instead
    // const updatedConfig = {
    //   ...this.props.config
    // };

    // const updatedConfig = {};
    // Object.assign(updatedConfig, config);

    // if (whoIsTyping) {
    //   // console.log(`---------------------------------------------------------
    //   //              -------------------------- TypingNotif RENDER ANIMATION`);
    //   updatedConfig.textToShow = `${whoIsTyping} is typing`;
    //   return (
    //     <FadeInOutText
    //       onAnimationEnd={this.props.onNotificationEnd}
    //       {...updatedConfig}
    //     />
    //   );
    // }
    // return config.placeholderText;
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
    repeats: PropTypes.number,
    duration: PropTypes.number,
    bidirectional: PropTypes.bool
  }).isRequired,
  onNotificationEnd: PropTypes.func.isRequired,
  whoIsTyping: PropTypes.string.isRequired
};
