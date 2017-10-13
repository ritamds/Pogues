import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fieldInputPropTypes, fieldMetaPropTypes } from 'redux-form';

import { getControlId, getValuesFromControlOptions, toggleValueInList } from 'utils/widget-utils';

// PropTypes and defaultProps

export const propTypes = {
  input: PropTypes.shape(fieldInputPropTypes).isRequired,
  meta: PropTypes.shape(fieldMetaPropTypes).isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  noValuesMessage: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
};

export const defaultProps = {
  required: false,
  disabled: false,
  children: [],
  noValuesMessage: undefined,
};

// Component

class ListCheckboxes extends Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  constructor(props) {
    super(props);

    this.state = {
      listCheckValues: [],
    };

    this.toggleCheck = this.toggleCheck.bind(this);
  }

  componentWillMount() {
    const values = this.props.input.value;
    this.setState({
      listCheckValues: values !== '' ? values.split(',') : [],
    });
  }

  componentWillUpdate(nextProps) {
    const values = nextProps.input.value;

    if (this.props.input.value !== values) {
      this.setState({
        listCheckValues: values !== '' ? values.split(',') : [],
      });
    }
  }

  toggleCheck(checkValue) {
    this.props.input.onChange(toggleValueInList(this.state.listCheckValues, checkValue).join());
  }

  render() {
    const { label, required, disabled, noValuesMessage, children, input, meta: { touched, error } } = this.props;
    const values = getValuesFromControlOptions(children);

    return (
      <div className="ctrl-list-checkboxes">
        <label htmlFor={getControlId('checkbox', input.name, values[0] && values[0].value)}>
          {label}
          {required && <span className="ctrl-required">*</span>}
        </label>
        <div>
          <input type="hidden" name={input.name} />
          {/* No values */}
          {values.length === 0 &&
            noValuesMessage && (
              <div>
                <span>{noValuesMessage}</span>
              </div>
            )}

          {values.map(val => {
            // eslint-disable-next-line no-shadow
            const { label, value, ...otherProps } = val;
            const id = getControlId('checkbox', input.name, value);

            return (
              <div className="form-check-inline" key={id}>
                <label htmlFor={id} className="form-check-label">
                  <input
                    {...otherProps}
                    type="checkbox"
                    id={id}
                    value={value}
                    checked={this.state.listCheckValues.indexOf(value) !== -1 ? 'checked' : false}
                    onChange={() => {
                      this.toggleCheck(value);
                    }}
                    disabled={disabled}
                  />
                  {label}
                </label>
              </div>
            );
          })}
          {touched && (error && <span className="form-error">{error}</span>)}
        </div>
      </div>
    );
  }
}

export default ListCheckboxes;
