import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TextFieldGoogle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false
    };

    this.handleFocusToggle = this.handleFocusToggle.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    // NOTE: shallow comparison
    const isPropsDiffer = Object.keys(this.props).some(propName => (
      this.props.propName !== nextProps.propName
    ));
    return isPropsDiffer || this.state !== nextState;
  }
  // TODO: maybe it should be used different handlers for onFocus and onBlur
  handleFocusToggle(e) {
    e.preventDefault();

    this.setState(prevState => ({ isFocused: !prevState.isFocused }));
  }
  handleValueChange(e) {
    const { onChange } = this.props;

    if (typeof onChange === 'function') {
      onChange(e);
    }
  }
  render() {
    // TODO: wrong input prop
    const { placeholder, wrongInputMsg, value } = this.props;
    const { isFocused } = this.state;

    return (
      <div className="nickname">
        <input
          className="nickname-field"
          name="nickname"
          onBlur={this.handleFocusToggle}
          onChange={this.handleValueChange}
          onFocus={this.handleFocusToggle}
          placeholder={placeholder}
          type="text"
          value={typeof value === 'string' ? value : undefined}
        />
        {/* <div className="bottomliner">
          <hr className="bottomline" />
          <hr className={isFocused
              ? 'bottomline on'
              : 'bottomline off'
            }
          />
        </div> */}
        <div className="bottomline-base" />
        <div className={isFocused ? 'bottomline on' : 'bottomline'} />
        <div className="wrong-nickname-spacer">
          <span className="wrong-input-hint">
            {wrongInputMsg}
          </span>
        </div>
      </div>
    );
  }
}

TextFieldGoogle.propTypes = {
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  wrongInputMsg: PropTypes.string
};

TextFieldGoogle.defaultProps = {
  onChange: undefined,
  placeholder: '',
  value: undefined,
  wrongInputMsg: 'Enter from 2 to 30 characters please'
};

export default TextFieldGoogle;
