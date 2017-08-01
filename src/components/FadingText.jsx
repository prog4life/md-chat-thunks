import React from 'react';

export default class FadingText extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // repeats: 1,
      // duration: 600,
      opacity: 1, // this.props.initialOpacity, maybe not needed in state at all
      fading: false, // TODO: replace by this.fading = false; or fadingText
      fadingText: ''
    };
  }
  componentDidMount() {
    if (this.props.steps < 1 || this.props.steps > 1000) {
      console.error('Inapropriate number of steps passed');
    }
    // TODO: start fading here to
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('Fade componentDidUpdate props ', this.props);
    console.log('componentDidUpdate prevProps === this.props',
      prevProps === this.props);
    // fade-in/out is happening  now
    if (this.state.fading) {
      // this.refs.fade.style.opacity = this.state.opacity;
      return;
    }
    // whole fade-in/fadeout animation has ended on prev cycle; single cooldown
    // TODO: can check this.props === prevProps (false if passed from parent)
    if (prevState.fading) {
      return;
    }

    if (!this.state.fading && this.props.textToShow) {
      // fade-in/out is gonna start now
      // this.refs.fade.style.opacity = this.state.opacity;
      // TODO: replace by functional setState - not needed here, fresh state/props
      this.setState({
        opacity: 0,
        fading: true,
        fadingText: this.props.textToShow
      });
      const {repeats, duration, steps, bidirectional} = this.props;

      // this.startFade(repeats, duration, steps, bidirectional);
      this.setFadeTimer(repeats, duration, steps, bidirectional);
    }
  }
  setFadeTimer(repeats, duration, steps, bidirectional) {
    // TODO: pass initialOpacity too
    // TODO: replace steps by smoothness or step (from 0.001 to 1)
    // TODO: round step for 3 numbers after dot
    const step = 1 / steps;
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
        return Number((prevState.opacity + step).toFixed(1));
      }
      // return ((prevState.opacity * 1000) - (step * 1000)) / 1000;
      return Number((prevState.opacity - step).toFixed(1));

    } else if (this.increasing) {
      if (prevState.opacity === 1) {
        return 0;
      }
      // return ((prevState.opacity * 1000) + (step * 1000)) / 1000;
      return Number((prevState.opacity + step).toFixed(1));

    } else if (!this.increasing) {
      if (prevState.opacity === 0) {
        return 1;
      }
      // return ((prevState.opacity * 1000) - (step * 1000)) / 1000;
      return Number((prevState.opacity - step).toFixed(1));
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
