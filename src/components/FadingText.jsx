import React from 'react';

export default class FadingText extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // repeats: 1,
      // duration: 600,
      opacity: 0, // this.props.initialOpacity, maybe not needed in state at all
      fading: false, // TODO: replace by this.fading = false; or fadingText
      fadingText: ''
    };
  }
  componentDidMount() {
    console.log('Fade props ', this.props);
    // FadingText.renderMessage = function () {
    //   if (this.props.whoIsTyping) {
    //     return `${this.props.whoIsTyping} is typing`;
    //   }
    //   return 'No one is typing';
    // }
  }
  componentDidUpdate(prevProps, prevState) {
    // fade-in/out is happening  now
    if (this.state.fading) {
      this.refs.fade.style.opacity = this.state.opacity;
      return;
    }
    // no fade-in/fadeout at this moment, and placeholder has rendered
    if (!this.props.textToFade) {
      return;
    }
    // fade-in/out is gonna start now
    this.refs.fade.style.opacity = this.state.opacity;
    // TODO: replace by this.fading = true; or fadingText
    this.setState({
      fading: true,
      fadingText: this.props.textToFade
    });
    const {repeats, duration, steps, bidirectional} = this.props;

    this.startFade(repeats, duration, steps, bidirectional);
  }
  startFade(repeats, duration = 600, steps = 10, bidirectional = true) {
    // TODO: pass initialOpacity too
    const step = 1 / steps;
    const directions = bidirectional ? 2 : 1;
    const stepsOverall = steps * directions * repeats;
    const singleStepInterval = duration / stepsOverall;
    let increasing = true; // initialOpacity === 1 ? false : true;
    let stepsDone = 0;

    this.fadeInterval = setInterval(() => {
      if (stepsDone === stepsOverall) {
        clearInterval(this.fadeInterval);
        stepsDone = 0;
        this.setState({
          fading: false
        });
        return;
      }

      if (bidirectional) {
        if (this.state.opacity === 1) {
          increasing = false;
        } else if (this.state.opacity === 0) {
          increasing = true;
        }
        if (increasing) {
          this.increaseOpacity(step);
        } else {
          this.decreaseOpacity(step);
        }

      } else if (increasing) {
        if (this.state.opacity === 1) {
          this.setState({
            opacity: 0
          });
        }
        this.increaseOpacity(step);

      } else if (!increasing) {
        if (this.state.opacity === 0) {
          this.setState({
            opacity: 1
          });
        }
        this.decreaseOpacity(step);
      }
      stepsDone++;
    }, singleStepInterval);
  }
  increaseOpacity(step) {
    this.setState({
      opacity: ((Number(this.state.opacity) * 10) + (step * 10)) / 10
    });
  }
  decreaseOpacity(step) {
    this.setState({
      opacity: Number((Number(this.state.opacity) - step).toFixed(1))
    });
  }
  render() {
    const renderOutput = () => {
      if (this.state.fading) {
        return this.state.fadingText;
      }
      return this.props.textToFade || this.props.placeholderText;
    };
// TODO: render placeholder at the end
    return (
      <div className="fading-text" ref="fade">
        {renderOutput()}
      </div>
    );
  }
}
