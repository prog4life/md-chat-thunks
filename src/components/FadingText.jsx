import React from 'react';
import PropTypes from 'prop-types';
/* eslint no-magic-numbers: 0 */
export default class FadingText extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opacity: 0,
      // class: 'fading-text opaque-text',
      fading: false
    };
  }
  componentDidMount() {
    if (this.props.textToShow) {
      this.startFading();
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    // when fading is active and parent component is trying to rerender this
    // component, it should refuse such excess rendering
    // NOTE: condition for version with className changing
    // if (this.state.fading && this.state.class === nextState.class) {
    // TODO: consider replacing by this.props === nextProps
    if (this.state.fading && this.state.opacity === nextState.opacity) {
      return false;
    }
    return Boolean(nextProps.textToShow);
  }
  componentDidUpdate(prevProps, prevState) {
    // TODO: terminate fading on empty textToShow/whoIsTyping
    // console.log('Fade componentDidUpdate props ', this.props, 'state ', this.state);
    // fade-in/out is currently happening
    if (this.state.fading) {
      return;
    }
    // whole fade-in/fadeout animation has ended on prev cycle; single cooldown
    // NOTE: probably can check this.props === prevProps
    if (prevState.fading) {
      return;
    }

    if (!this.state.fading && this.props.textToShow) {
      this.startFading();
    }
  }
  componentWillUnmount() {
    clearInterval(this.fadeTimerId);
  }
  startFading() {
    this.setState({
      opacity: 1,
      // class: 'fading-text transparent-text',
      fading: true
    });
    const {repeats, duration, bidirectional} = this.props;

    this.setFadeTimer(repeats, duration, bidirectional);
  }
  setFadeTimer(repeats, duration, bidirectional) {
    const stepsInTotal = repeats * (bidirectional ? 2 : 1);

    this.stepsDone = 1;

    this.fadeTimerId = setInterval(() => {
      if (this.stepsDone === stepsInTotal) {
        clearInterval(this.fadeTimerId);
        this.setState({
          opacity: 1,
          // class: 'fading-text opaque-text',
          fading: false
        });
        this.stepsDone = 0;
        this.props.onAnimationEnd();
        return;
      }
      this.setState((prevState) => {
        return {
          // class: prevState.class === 'fading-text opaque-text'
          //   ? 'fading-text transparent-text'
          //   : 'fading-text opaque-text'
          opacity: Number(!prevState.opacity)
        };
      });
      this.stepsDone++;
    }, duration);
  }
  render() {
    return (
      <div
        // className={this.state.class}
        className={this.state.fading ? 'fading-text' : 'fading-placeholder'}
        style={{
          // opacity: `${this.state.opacity}`
          color: `rgba(0, 0, 0, ${this.state.opacity})`
        }}
      >
        {this.state.fading ? this.props.textToShow : this.props.placeholderText}
      </div>
    );
  }
}

FadingText.propTypes = {
  bidirectional: PropTypes.bool,
  duration: PropTypes.number,
  onAnimationEnd: PropTypes.func,
  placeholderText: PropTypes.string,
  repeats: PropTypes.number,
  textToShow: PropTypes.string
};

FadingText.defaultProps = {
  repeats: 3,
  duration: 500,
  bidirectional: true,
  // TODO: consider to set default placeholder as null
  placeholderText: '',
  textToShow: '',
  onAnimationEnd(f) {
    return f;
  }
};
