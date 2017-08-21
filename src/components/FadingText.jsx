import React from 'react';
import PropTypes from 'prop-types';
/* eslint no-magic-numbers: 0 */
export default class FadingText extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opacity: 1,
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
    if (this.state.fading && this.state.opacity === nextState.opacity) {
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
    // TODO: can check this.props === prevProps
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
      opacity: 0,
      fading: true
    });
    const {repeats, duration, step, bidirectional} = this.props;

    this.setFadeTimer(repeats, duration, step, bidirectional);
  }
  setFadeTimer(repeats, duration, step, bidirectional) {
    // TODO: pass initialOpacity too
    const steps = 1 / step;
    const stepsOverall = steps * (bidirectional ? 2 : 1) * repeats;
    const singleStepInterval = duration / stepsOverall;

    this.increasing = true; // initialOpacity === 1 ? false : true;
    this.stepsDone = 0;

    this.fadeTimerId = setInterval(() => {
      if (this.stepsDone === stepsOverall) {
        clearInterval(this.fadeTimerId);
        this.setState({
          opacity: 1,
          fading: false
        });
        this.stepsDone = 0;
        this.props.onAnimationEnd();
        return;
      }
      this.setState((prevState) => {
        return {
          opacity: this.countOpacity(prevState, bidirectional, step)
        };
      });
      this.stepsDone++;
    }, singleStepInterval);
  }
  countOpacity(prevState, bidirectional, step) {
    if (bidirectional) {
      if (prevState.opacity === 1) {
        this.increasing = false;
      } else if (prevState.opacity === 0) {
        this.increasing = true;
      }
      if (this.increasing) {
        return Number((prevState.opacity + step).toFixed(2));
      }
      return Number((prevState.opacity - step).toFixed(2));

    } else if (this.increasing) {
      if (prevState.opacity === 1) {
        return 0;
      }
      return Number((prevState.opacity + step).toFixed(2));

    } else if (!this.increasing) {
      if (prevState.opacity === 0) {
        return 1;
      }
      return Number((prevState.opacity - step).toFixed(2));
    }
  }
  render() {
    // TODO: try change color rgba alpha-channel instead of opacity
    return (
      <div
        className="fading-text"
        style={{ opacity: `${this.state.opacity}`}}
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
  step: PropTypes.oneOf([0.01, 0.02, 0.04, 0.05, 0.1, 0.2, 0.25, 0.5, 1]),
  textToShow: PropTypes.string
};

FadingText.defaultProps = {
  // TODO: initialOpacity
  repeats: 3,
  duration: 1800,
  step: 0.05,
  bidirectional: true,
  placeholderText: '',
  textToShow: '',
  onAnimationEnd(f) {
    return f;
  }
};
