import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fieldInputPropTypes, fieldMetaPropTypes } from 'redux-form';
import ClassSet from 'react-classset';
import {
  getValueWithSuggestion,
  getPattern,
} from 'forms/controls/control-with-suggestions/components/utils';

import {
  updateSuggestions,
  initialize,
  getNewIndex,
} from './input-with-suggestions-utils';
import { HighLighter } from 'widgets/highlighter';
import { getKey } from 'utils/widget-utils';

import { CONTROL_WITH_SUGGESTIONS } from 'constants/dom-constants';

const {
  COMPONENT_CLASS,
  LIST_CLASS,
  ITEM_CLASS,
  ITEM_SELECTED_CLASS,
} = CONTROL_WITH_SUGGESTIONS;

const InputRegex = new RegExp(/\$(\w+)\b(?!\s)/);

// PropTypes and defaultProps

export const propTypes = {
  input: PropTypes.shape(fieldInputPropTypes).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  meta: PropTypes.shape(fieldMetaPropTypes).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  label: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  required: PropTypes.bool,
  // eslint-disable-next-line react/no-unused-prop-types
  disabled: PropTypes.bool,
  numSuggestionsShown: PropTypes.number,
  availableSuggestions: PropTypes.arrayOf(PropTypes.string),
  focusOnInit: PropTypes.bool,
};

export const defaultProps = {
  required: false,
  disabled: false,
  numSuggestionsShown: 10,
  availableSuggestions: [],
  focusOnInit: false,
};

// Component

class ControlWithSuggestions extends Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;
  static InputRegex = InputRegex;

  constructor(props) {
    super(props);
    this.state = initialize();
  }

  componentDidMount() {
    if (this.props.focusOnInit) this.input.focus();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.input.value !== this.props.input.value ||
      nextProps.meta.error !== this.props.meta.error ||
      nextState.hoveredSuggestionIndex !== this.state.hoveredSuggestionIndex ||
      nextProps.focusedInput !== this.props.focusedInput
    );
  }

  componentDidUpdate() {
    if (this.activeItem) this.activeItem.scrollIntoView(false);
  }

  // OnChange of the input
  handleInputChange = value => {
    this.setState(
      updateSuggestions(
        getPattern(value, this.input.selectionStart),
        InputRegex,
        this.props.availableSuggestions,
      ),
    );

    // Execute default code afterwards
    this.props.input.onChange(value);
  };

  // OnClick of an item
  handleSuggestionClick = suggestion => {
    const newValue = getValueWithSuggestion(
      suggestion,
      this.input.selectionStart,
      this.input.value,
    );
    const restfullText = this.input.value.substr(this.input.selectionStart, this.input.value.length);

    this.props.input.onChange(`${newValue} ${restfullText}`);
    this.setState(initialize());
    this.setState({ typedInput: this.input.value });
  };

  // OnKeyDown of the input
  handleInputKeyDown = e => {
    if (e.key === 'Tab') {
      this.handleTab(e);
    } else if (e.key === 'Enter') {
      this.handleEnter(e);
    } else if (e.key === 'Backspace') {
      this.handleBackSpace(e);
    }
  };

  handleTab = e => {
    const { numSuggestionsShown } = this.props;
    const { suggestions, hoveredSuggestionIndex } = this.state;

    if (suggestions.length > 0) {
      this.setState({
        hoveredSuggestionIndex: getNewIndex(
          hoveredSuggestionIndex,
          suggestions,
          numSuggestionsShown,
        ),
      });
      e.preventDefault();
    }
  };

  handleEnter = e => {
    const { suggestions, hoveredSuggestionIndex } = this.state;

    if (suggestions.length > 0) {
      this.handleSuggestionClick(suggestions[hoveredSuggestionIndex]);
      e.preventDefault();
    }
  };

  handleBackSpace = e => {
    const { typedInput } = this.state;

    if (typedInput && this.input.value !== typedInput) {
      this.input.value = typedInput;
      this.setState({ typedInput: '' });
      e.preventDefault();
    }
  };

  // OnFocus of the input
  handleInputFocus = () => {
    this.setState({ hoveredSuggestionIndex: 0 });
  };

  render() {
    const { input, numSuggestionsShown, focusedInput } = this.props;
    const { suggestions, hoveredSuggestionIndex } = this.state;
    const matches = input.value.match(InputRegex);
    const highlight = matches ? matches[1] : '';

    return (
      focusedInput === input.name && (
        <div className={COMPONENT_CLASS}>
          {suggestions.length > 0 && (
            <div className={LIST_CLASS}>
              {suggestions.slice(0, numSuggestionsShown).map((
                suggest,
                index, // eslint-disable-next-line jsx-a11y/no-static-element-interactions
              ) => (
                <div
                  key={getKey(suggest)}
                  onClick={() => {
                    this.handleSuggestionClick(suggest);
                  }}
                  role="button"
                  className={ClassSet({
                    [ITEM_CLASS]: true,
                    [ITEM_SELECTED_CLASS]: index === hoveredSuggestionIndex,
                  })}
                  title={suggest}
                  ref={node => {
                    if (index === hoveredSuggestionIndex)
                      this.activeItem = node;
                  }}
                >
                  <HighLighter highlight={highlight} caseSensitive={false}>
                    {suggest}
                  </HighLighter>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    );
  }
}

export default ControlWithSuggestions;
