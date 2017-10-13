import React, { Component } from 'react';
import { fieldInputPropTypes, fieldMetaPropTypes } from 'redux-form';
import PropTypes from 'prop-types';
import ClassSet from 'react-classset';
import debounce from 'lodash.debounce';

import {
  clearSuggestions,
  setSuggestions,
  moveDown,
  moveUp,
  updateSelectedOption,
  init,
} from './input-autocomplete-utils';

import { getControlId, getValuesFromControlOptions } from 'utils/widget-utils';
import { HighLighter } from 'widgets/highlighter';
import { INPUT_AUTOCOMPLETE_CONTROL } from 'constants/dom-constants';

const {
  COMPONENT_CLASS,
  BUTTON_CLEAR_CLASS,
  NO_OPTION_SELECTED_ICON,
  OPTION_SELECTED_ICON,
  OPTION_CLEAR_ICON,
} = INPUT_AUTOCOMPLETE_CONTROL;

// PropTypes and defaultProps

export const propTypes = {
  input: PropTypes.shape(fieldInputPropTypes).isRequired,
  meta: PropTypes.shape(fieldMetaPropTypes).isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
  numSuggestionsShown: PropTypes.number,
  getOptionLabel: PropTypes.func,
};

export const defaultProps = {
  required: false,
  children: [],
  numSuggestionsShown: 10,
  getOptionLabel: label => {
    return label;
  },
};

// Component

class InputAutocomplete extends Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  constructor(props) {
    super(props);

    this.state = {
      options: [],
      indexSelectedOption: undefined,
      suggestions: [],
      indexActiveSuggestion: undefined,
      inputSearch: '',
      showSuggestions: false,
    };

    this.onKeyUp = this.onKeyUp.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onClick = this.onClick.bind(this);
    this.removeSelectedOption = this.removeSelectedOption.bind(this);
  }

  componentWillMount() {
    const { children, input: { value } } = this.props;
    const options = getValuesFromControlOptions(children);
    this.setState(init(options, value));
  }

  componentWillUpdate(nextProps) {
    const value = nextProps.input.value;
    if (value !== this.props.input.value) {
      this.setState(init(this.state.options, value));
    }
  }

  onKeyUp(event) {
    const { indexActiveSuggestion, suggestions, options } = this.state;
    const { getOptionLabel, numSuggestionsShown, input: { onChange } } = this.props;
    const inputSearchValue = event.currentTarget.value.trim();

    if (event.key === 'ArrowUp') {
      this.setState(moveUp(indexActiveSuggestion));
    } else if (event.key === 'ArrowDown') {
      this.setState(moveDown(suggestions, indexActiveSuggestion));
    } else if (event.key === 'Enter') {
      updateSelectedOption(suggestions, onChange, indexActiveSuggestion);
    } else if (inputSearchValue.length === 0) {
      this.setState(clearSuggestions());
    } else {
      this.setState(setSuggestions(inputSearchValue, options, getOptionLabel, numSuggestionsShown));
    }
  }

  onBlur() {
    this.setState({ showSuggestions: false });
  }

  onClick(indexClickedSuggestion) {
    updateSelectedOption(this.state.suggestions, this.props.input.onChange, indexClickedSuggestion);
  }

  removeSelectedOption() {
    this.props.input.onChange('');
  }

  render() {
    const { input: { name, value }, label, required, meta: { touched, error } } = this.props;
    const id = getControlId('input-autocomplete', name);
    const { suggestions, indexActiveSuggestion, showSuggestions, inputSearch } = this.state;
    const searchInputStyle = {
      display: showSuggestions ? 'block' : 'none',
    };

    return (
      <div className={COMPONENT_CLASS}>
        <label htmlFor={id}>
          {label}
          {required && <span className="ctrl-required">*</span>}
        </label>
        <div>
          <input type="hidden" name={name} />

          <div className="input-group">
            <div className="input-group-addon">
              <i
                className={ClassSet({
                  glyphicon: true,
                  [NO_OPTION_SELECTED_ICON]: !this.state.indexSelectedOption,
                  [OPTION_SELECTED_ICON]: this.state.indexSelectedOption,
                })}
              />
            </div>

            {/* This is the search input */}
            <input
              value={this.state.inputSearch}
              className="form-control"
              type="text"
              onKeyDown={event => {
                // In this way the form submit is avoided
                if (event.key === 'Enter') event.preventDefault();
              }}
              onKeyUp={this.onKeyUp}
              onFocus={() => {
                this.setState({ showSuggestions: true });
              }}
              onBlur={debounce(this.onBlur, 500)}
              onChange={event => {
                this.setState({ inputSearch: event.currentTarget.value });
              }}
              ref={input => {
                this.input = input;
              }}
            />
            {value && (
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions
              <div
                className={`input-group-addon ${BUTTON_CLEAR_CLASS}`}
                onClick={() => {
                  this.removeSelectedOption();
                }}
              >
                <i className={`glyphicon form-control-feedback ${OPTION_CLEAR_ICON}`} />
              </div>
            )}
          </div>

          {suggestions.length > 0 && (
            <ul style={searchInputStyle}>
              {suggestions.map((su, index) => (
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <li
                  key={su.value}
                  className={ClassSet({
                    active: index === indexActiveSuggestion,
                  })}
                  onClick={() => {
                    this.onClick(index);
                  }}
                >
                  <HighLighter highlight={inputSearch}>{this.props.getOptionLabel(su.label, su.value)}</HighLighter>
                </li>
              ))}
            </ul>
          )}
          {touched && (error && <span className="form-error">{error}</span>)}
        </div>
      </div>
    );
  }
}

export default InputAutocomplete;
