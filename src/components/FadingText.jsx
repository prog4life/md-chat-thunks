import React from 'react';

export default class FadingText extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // repeats: 1,
      // duration: 600,
      // consider removing fading and fadingText from state, leave only opacity
      opacity: 1, // this.props.initialOpacity, maybe not needed in state at all
      fading: false, // TODO: replace by this.fading = false; or fadingText
      fadingText: ''
    };
  }
  componentDidMount() {
    this.checkStepValue();
    // TODO: start fading here to
    // TODO: prop types
  }
  componentDidUpdate(prevProps, prevState) {
    this.checkStepValue();
    console.log('Fade componentDidUpdate props ', this.props, 'state ', this.state);
    // console.log('componentDidUpdate prevProps === this.props',
    //   prevProps === this.props);
    // fade-in/out is currently happening
    if (this.state.fading) {
      return;
    }
    // whole fade-in/fadeout animation has ended on prev cycle; single cooldown
    // TODO: can check this.props === prevProps (false if passed from parent)
    if (prevState.fading) {
      return;
    }

    if (!this.state.fading && this.props.textToShow) {
      // fade-in/out is gonna start now
      this.setState({
        opacity: 0,
        fading: true,
        fadingText: this.props.textToShow
      });
      const {repeats, duration, step, bidirectional} = this.props;

      this.setFadeTimer(repeats, duration, step, bidirectional);
    }
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
          fading: false,
          fadingText: ''
        });
        this.stepsDone = 0;
        return;
      }
      this.setState((prevState) => {
        return {
          opacity: this.countOpacity(prevState, bidirectional, step)
        }
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
        // multiply by 1000 to avoid inaccuracy of operations with floats
        // return ((prevState.opacity * 1000) + (step * 1000)) / 1000;
        return Number((prevState.opacity + step).toFixed(2));
      }
      // return ((prevState.opacity * 1000) - (step * 1000)) / 1000;
      return Number((prevState.opacity - step).toFixed(2));

    } else if (this.increasing) {
      if (prevState.opacity === 1) {
        return 0;
      }
      // return ((prevState.opacity * 1000) + (step * 1000)) / 1000;
      return Number((prevState.opacity + step).toFixed(2));

    } else if (!this.increasing) {
      if (prevState.opacity === 0) {
        return 1;
      }
      // return ((prevState.opacity * 1000) - (step * 1000)) / 1000;
      return Number((prevState.opacity - step).toFixed(2));
    }
  }
  checkStepValue() {
    if (!Number.isInteger(1 / this.props.step) || this.props.step < 0.01 ||
        this.props.step > 1) {
      throw new Error('Inappropriate opacity change step value was passed, ' +
        'must be one of 0.01, 0.02, 0.04, 0.05, 0.1, 0.2, 0.25, 0.5, 1');
    }
  }
  render() {
    const renderOutput = () => {
      if (this.state.fading) {
        return this.state.fadingText;
      } else if (this.props.placeholderText) {
        return this.props.placeholderText;
      }
      return '';
    };

// TODO: render placeholder at the end
    return (
      <div
        className="fading-text"
        ref="fade"
        style={{ opacity: `${this.state.opacity}`}}>
        {renderOutput()}
      </div>
    );
  }
}
