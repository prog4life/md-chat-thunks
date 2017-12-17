import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TextFieldMaterialUI extends Component {
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
          className="nickname__input"
          name="nickname"
          onBlur={this.handleFocusToggle}
          onChange={this.handleValueChange}
          onFocus={this.handleFocusToggle}
          placeholder={placeholder}
          type="text"
          value={typeof value === 'string' ? value : undefined}
        />
        <div className="underliner">
          <hr className="underline" />
          <hr className={isFocused
              ? 'underline on'
              : 'underline off'
            }
          />
        </div>
        <div className="nickname__hint">
          <span className="nickname__hint-text">
            {wrongInputMsg}
          </span>
        </div>
      </div>
    );
  }
}

TextFieldMaterialUI.propTypes = {
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  wrongInputMsg: PropTypes.string
};

TextFieldMaterialUI.defaultProps = {
  onChange: undefined,
  placeholder: '',
  value: undefined,
  wrongInputMsg: 'Enter from 2 to 30 characters please'
};

export default TextFieldMaterialUI;
