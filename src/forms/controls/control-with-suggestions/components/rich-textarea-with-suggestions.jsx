import React from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from 'gillespie59-react-rte/lib/RichTextEditor';
import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';

import ControlWithSuggestion from './control-with-suggestions';
import { updateSuggestions, initialize } from './input-with-suggestions-utils';
import {
  getValueWithSuggestion,
  getPattern,
  getStartValueWithSuggestion
} from 'forms/controls/control-with-suggestions/components/utils';

import {
  getEditorValue,
  contentStateToString,
  formatURL,
  toolbarConfig,
  toolbarConfigQuestion,
  rootStyle,
} from 'forms/controls/rich-textarea';
import { EditorState, Modifier, SelectionState } from 'draft-js';
import { getControlId } from 'utils/widget-utils';
import { CONTROL_RICH_TEXTAREA } from 'constants/dom-constants';

const { COMPONENT_CLASS } = CONTROL_RICH_TEXTAREA;

// PropTypes and defaultProps

const propTypes = {
  submitOnEnter: PropTypes.bool,
  toolbar: PropTypes.object,
};
const defaultProps = {
  submitOnEnter: false,
  toolbar: toolbarConfig,
};

// Control

class RichTextareaWithSuggestions extends ControlWithSuggestion {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  constructor(props) {
    const parent = super(props);

    this.state = {
      ...parent.state,
      value: getEditorValue(props.input.value),
      currentValue: props.input.value,
      typedInput: ''
    };
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.textChange = this.textChange.bind(this);
  }

  componentDidMount() {
    if (this.props.focusOnInit) this.input._focus();
  }

  shouldComponentUpdate() {
    // @TODO
    return true;
  }

  componentWillReceiveProps(nextProps) {
    const isReset = nextProps.input.value === '';
    const itemSelected =
      nextProps.input.value.indexOf(this.state.currentValue) < 0 ||
      (this.state.currentValue === '' && nextProps.input.value.length > 1);
    if (isReset || itemSelected) {
      this.setState({
        ...parent.state,
        value: getEditorValue(nextProps.input.value),
        currentValue: nextProps.input.value,
      });
    }
  }

  myKeyBindingFn = (e) => {
    if (e.key === 'Tab') {
      return 'myeditor-save';
    } else if (e.key === 'Backspace') {
        if (this.state.typedInput) {
          this.handleBackSpace(e);
        } else {
          return getDefaultKeyBinding(e);
        }  
    }
    return getDefaultKeyBinding(e);
  }

  handleKeyCommand(command) {
    if (command === 'myeditor-save') {
      return 'handled';
    }
    return 'not-handled';
  }

  handleChange = value => {
    const editorState = value.getEditorState();
    const contentState = editorState.getCurrentContent();
    const transformedValue = contentStateToString(contentState);

    const caretCursor = this.state.value
      .getEditorState()
      .getSelection()
      .getStartOffset();

    const filteredValue = getPattern(transformedValue, caretCursor, true);

    let newState = {
      value,
      currentValue: filteredValue,
    };
    if (caretCursor > 0) {
      newState = {
        ...newState,
        ...updateSuggestions(
          filteredValue,
          RichTextareaWithSuggestions.InputRegex,
          this.props.availableSuggestions,
        ),
      };
    }
    this.setState(newState);
    this.props.input.onChange(transformedValue);
  };

  handleReturn = e => {
    if (this.props.submitOnEnter) {
      e.preventDefault();
      e.target
        .closest('form')
        .querySelector('button[type=submit]')
        .click();
    }
  };

  textChange(value) {
    const contentState = value.getEditorState().getCurrentContent();
    const currentValue = contentStateToString(contentState);
    this.props.input.onChange(currentValue);
    this.setState({ value, currentValue });
  }

  handleSuggestionClick = suggestion => {

    const caretCursor = this.state.value
      .getEditorState()
      .getSelection()
      .getStartOffset();

    const fullText = this.state.value
      .getEditorState()
      .getCurrentContent()
      .getPlainText();

      this.setState({ typedInput: fullText })

    const newCurrentValue = getStartValueWithSuggestion(
      caretCursor,
      fullText,
    );

    const targetSelection = this.state.value.getEditorState().getSelection(); 
    let contentState = this.state.value.getEditorState().getCurrentContent(); 
    const contentStateWithEntity  = contentState.createEntity(
      'suggestion',
      'MUTABLE', 
      { status: 'complete' }
      );

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const targetRange = targetSelection.merge({
      anchorOffset: newCurrentValue+1,
      focusOffset: caretCursor,
      isBackward: false
    });

    const newContentState = Modifier.replaceText(contentState,
      targetRange,
     `${suggestion}$`,
      null,
      entityKey);
      const newEditorState = EditorState.push(this.state.value.getEditorState(), newContentState, "addentity");
      this.textChange(this.state.value.setEditorState(newEditorState));
  };

    handleBackSpace = (e) => {
      const { typedInput } = this.state;

      if (typedInput) {
        let contentState = this.state.value.getEditorState().getCurrentContent();
        console.log("contentState", contentState)
        let targetSelection = this.state.value.getEditorState().getSelection();
        console.log("targetSelection", targetSelection)
        const newContentState = Modifier.replaceText(contentState, targetSelection, typedInput);
        console.log("newContentState", newContentState)
        const newEditorState = EditorState.push(this.state.value.getEditorState(), newContentState, "addentity");
        console.log("newEditorState", newEditorState)
        this.textChange(this.state.value.setEditorState(newEditorState));

        this.setState({ typedInput: '' }, () => console.log("typedInput", typedInput))
      }
    };

  render() {
    const {
      label,
      required,
      disabled,
      input,
      toolbar,
      meta: { touched, error },
      targetIsQuestion,
    } = this.props;
    const id = getControlId('rich-textarea', input.name);
    const editorValue = this.state.value;
    return (
      <div className={COMPONENT_CLASS}>
        <label htmlFor={id}>
          {label}
          {required && <span className="ctrl-required">*</span>}
        </label>
        <div>
          <RichTextEditor
            blockStyleFn={() => 'singleline'}
            value={editorValue}
            onChange={this.handleChange}
            toolbarConfig={
              targetIsQuestion ? toolbarConfigQuestion : toolbar
            }
            handleReturn={this.handleReturn}
            rootStyle={rootStyle}
            formatURL={formatURL}
            disabled={disabled}
            onFocus={() => {
              this.handleInputFocus();
              input.onFocus();
            }}
            ref={node => {
              this.input = node;
            }}
            handleKeyCommand={this.handleKeyCommand}
            keyBindingFn={this.myKeyBindingFn}
          />
          {touched && (error && <span className="form-error">{error}</span>)}
          {super.render()}
        </div>
      </div>
    );
  }
}

export default RichTextareaWithSuggestions;
