import React from 'react';
import PropTypes from 'prop-types';
/* eslint no-magic-numbers: 0 */
export default class FadeInOutText extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opacity: 0,
      // cssClass: 'blinking-text opaque',
      isActive: false
    };
  }
  componentDidMount() {
    console.log('-----------------------------------------------------MOUNT');
    // TODO: log warning on empty textToShow
    if (this.props.textToShow) {
      this.startAnimation();
    }
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('scu ------------------------------------------------- START ');
  //   console.log(`scu isActive: ${this.state.isActive}, ` +
  //     `opacity === nextState.opacity: ${this.state.opacity} ` +
  //     `=== ${nextState.opacity}`);
  //   console.log(`scu this.props === nextProps: ${this.props === nextProps}`);
  //   console.log('scu nextState: ', nextState);
  //
  //   // when blinking is active and parent component is trying to rerender this
  //   // component, it will refuse such excess rendering
  //
  //   // NOTE: condition for version that changes className
  //   // if (this.state.isActive && (this.state.cssClass === nextState.cssClass ||
  //   //     this.props !== nextProps)) {
  //
  //   if (this.state.isActive &&
  //     (this.state.opacity === nextState.opacity || this.props !== nextProps)) {
  //     console.log('scu -------------------------------------------- END false');
  //     return false;
  //   }
  //   console.log('scu -------------------------------------------- END true ');
  //   return Boolean(nextProps.textToShow);
  // }
  componentDidUpdate(prevProps, prevState) {
    // TODO: terminate on empty textToShow
    // console.log('cDU ------------------------------------------------- START ');
    // console.log('cDU state ', this.state);
    // console.log('cDU prevState ', prevState);
    // console.log('cDU this.state.isActive: ', this.state.isActive);
    // console.log(`cDU this.props === prevProps: ${this.props === prevProps}`);

    // NOTE: alternative condition - whole fade-in/out animation has ended on
    // prev render, single additional exit:
    // if (this.state.isActive || prevState.isActive) { return; }

    // TODO: consider replacing of 2nd reversed condition into next block
    if (this.state.isActive || this.props === prevProps) {
      // console.log('cDU ------------------------------------------------- RETURN due to ACTIVE || this.props === prevProps');
      return;
    }

    // TODO: log warning on empty textToShow
    if (this.props.textToShow) {
      // console.log('cDU ------------------------------------------------- START ANIMATION, props.textToShow === true');
      this.startAnimation();
    }
  }
  componentWillUnmount() {
    // console.log('----------------------------------------------------- UNMOUNT');
    clearInterval(this.animationTimerId);
  }
  setAnimationTimer(repeats, duration, isBidirectional) {
    const stepsInTotal = repeats * (isBidirectional ? 2 : 1);

    this.stepsDone = 1;

    this.animationTimerId = setInterval(() => {
      if (this.stepsDone === stepsInTotal) {
        clearInterval(this.animationTimerId);
        this.setState({
          opacity: 1,
          // cssClass: 'blinking-text opaque',
          isActive: false
        });
        this.stepsDone = 0;
        this.props.onAnimationEnd();
        return;
      }
      this.setState((prevState) => {
        return {
          // cssClass: prevState.cssClass === 'blinking-text opaque'
          //   ? 'blinking-text transparent'
          //   : 'blinking-text opaque'
          opacity: Number(!prevState.opacity)
        };
      });
      this.stepsDone += 1;
    }, duration);
  }
  startAnimation() {
    this.setState({
      opacity: 1,
      // cssClass: 'blinking-text transparent',
      isActive: true
    });
    const { repeats, duration, isBidirectional } = this.props;

    this.setAnimationTimer(repeats, duration, isBidirectional);
  }
  render() {
    // TODO: render placeholder as separate div
    return (
      <div
        // className={this.state.cssClass}
        className="blinking-text"
        style={{
          // opacity: `${this.state.opacity}`
          color: `rgba(0, 0, 0, ${this.state.opacity})`
        }}
      >
        {this.state.isActive ? this.props.textToShow : this.props.placeholder}
      </div>
    );
  }
}

FadeInOutText.propTypes = {
  duration: PropTypes.number,
  isBidirectional: PropTypes.bool,
  onAnimationEnd: PropTypes.func,
  placeholder: PropTypes.string,
  repeats: PropTypes.number,
  textToShow: PropTypes.string
};

FadeInOutText.defaultProps = {
  repeats: 3,
  duration: 500,
  isBidirectional: true,
  // TODO: consider to set default placeholder as null
  placeholder: '',
  textToShow: '',
  onAnimationEnd: f => f
};
