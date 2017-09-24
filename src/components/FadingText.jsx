import React from 'react';
import PropTypes from 'prop-types';
/* eslint no-magic-numbers: 0 */
export default class FadingText extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // opacity: 1,
      class: 'fading-text opaque-text',
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
    if (this.state.fading && this.state.class === nextState.class) {
      return false;
    }
    return Boolean(nextProps.textToShow);
  }
  componentDidUpdate(prevProps, prevState) {
    // console.log('Fade componentDidUpdate props ', this.props, 'state ', this.state);
    // fade-in/out is currently happening
    if (this.state.fading) {
      return;
    }
    // whole fade-in/fadeout animation has ended on prev cycle; single cooldown
    // NOTE: can check this.props === prevProps
    if (prevState.fading) {
      return;
    }

    if (!this.state.fading && this.props.textToShow) {
      this.startFading();
    }
  }
  componentWillUnmount() {
    // doublecheck
    clearInterval(this.fadeTimerId);
  }
  startFading() {
    this.setState({
      // opacity: 0,
      class: 'fading-text transparent-text',
      fading: true
    });
    const {repeats, duration, bidirectional} = this.props;

    this.setFadeTimer(repeats, duration, bidirectional);
  }
  setFadeTimer(repeats, duration, bidirectional) {
    // TODO: pass initialOpacity too
    // TODO: test case when duration isn't divided by 2 with integer result
    const switchInterval = duration / (bidirectional ? 2 : 1);
    const stepsOverall = repeats * (bidirectional ? 2 : 1);

    this.increasing = true; // initialOpacity === 1 ? false : true;
    this.stepsDone = 0;

    this.fadeTimerId = setInterval(() => {
      if (this.stepsDone === stepsOverall) {
        clearInterval(this.fadeTimerId);
        this.setState({
          // opacity: 1,
          class: 'fading-text opaque-text',
          fading: false
        });
        this.stepsDone = 0;
        this.props.onAnimationEnd();
        return;
      }
      this.setState((prevState) => {
        return {
          // class: this.changeClass(prevState)
          class: prevState.class === 'fading-text opaque-text'
            ? 'fading-text transparent-text'
            : 'fading-text opaque-text'
        };
      });
      this.stepsDone++;
    }, switchInterval);

    // this.changeClass = (prevState) => {
    //   if (prevState.class === 'fading-text-opaque') {
    //     return 'fading-text-transparent';
    //   } else if (prevState.class === 'fading-text-transparent') {
    //     return 'fading-text-opaque';
    //   }
    // }
  }
  render() {
    return (
      <div
        className={this.state.class}
        // style={{
        //   opacity: `${this.state.opacity}`
        //   color: `rgba(0, 0, 0, ${this.state.opacity})`
        // }}
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
  // TODO: initialOpacity
  repeats: 3,
  duration: 1000,
  bidirectional: true,
  // TODO: consider to set default placeholder as null
  placeholderText: '',
  textToShow: '',
  onAnimationEnd(f) {
    return f;
  }
};
