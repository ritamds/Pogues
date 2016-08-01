import React, { PropTypes } from 'react'
import SimpleMeasure from './simple-measure'
import SingleMeasure from './single-measure'
import ResponseFormatPicker from './response-format-picker'
import SimpleResponseFormatEditor from './simple-response-format-editor'
import SingleResponseFormatEditor from './single-response-format-editor'
import { RESPONSE_FORMAT } from '../constants/pogues-constants'
const { SIMPLE, SINGLE } = RESPONSE_FORMAT
const RESPONSE_FORMAT_FOR_TABLE = {
  SIMPLE,
  SINGLE
}

export default function Measure({
  measure, index, allowRemoval, allowAddition,
  update, updateFormat, newCodeListFormat,
  updateDatatype,
  addMeasure, removeMeasure,
  locale }) {
  const { label, type } = measure
  // two kinds of measures : SIMPLE and SINGLE
  // const measureEl = type === SIMPLE ?
  //   <SimpleMeasure measure={measure.simple} /> :
  //   <SingleMeasure measure={measure.single} />
  const selectFormat = type => update({ type })
  return (
      <div>
        <hr/>
        <div className="form-group">
          <label htmlFor="label" className="col-sm-3 control-label">
            Measure {index + 1}
          </label>
          <div className="col-sm-7">
            <input value={label}
              onChange={e => update({ label: e.target.value })}
              type="text" className="form-control" id="minimum"
              placeholder={locale.label}/>
          </div>
          { allowRemoval &&
            <div className="col-sm-2">
              <button className="btn btn-default form-control" type="button"
                onClick={removeMeasure}>
                <span className="fa fa-trash"/>
              </button>
            </div>
          }
        </div>
        <div className="form-group">
          <div className="col-sm-5">
            <ResponseFormatPicker
              type={type} types={RESPONSE_FORMAT_FOR_TABLE}
              select={selectFormat}
              locale={locale} />
          </div>
        </div>
        {
          type === SIMPLE ?
            <SimpleResponseFormatEditor format={measure[type]}
              locale={locale} updateFormat={updateFormat}
              updateDatatype={updateDatatype} /> :
            <SingleResponseFormatEditor format={measure[type]}
              updateFormat={updateFormat}
              newCodeListFormat={newCodeListFormat}
              locale={locale} />
        }
        { allowAddition &&
          <div className="form-group">
            <div className="col-sm-offset-9 col-sm-3">
              <button className="btn btn-default form-control"
                onClick={addMeasure}>
              {"Add a measure"}
              </button>
            </div>
          </div>
        }
      </div>
  )
}

Measure.propTypes = {
  measure: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  allowRemoval: PropTypes.bool.isRequired,
  allowAddition: PropTypes.bool.isRequired,
  addMeasure: PropTypes.func.isRequired,
  removeMeasure: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  updateFormat: PropTypes.func.isRequired,
  updateDatatype: PropTypes.func.isRequired,
  newCodeListFormat: PropTypes.func.isRequired,
  locale: PropTypes.object.isRequired
}