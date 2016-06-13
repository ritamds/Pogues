import {
  DATATYPE_NAME, DATATYPE_VIZ_HINT
} from '../constants/pogues-constants'

export const emptyTextDatatype = {
  typeName: DATATYPE_NAME.TEXT,
  visualizationHint: DATATYPE_VIZ_HINT.CHECKBOX,  
  maxLength: undefined,
  pattern: undefined
}

export const emptyNumericDatatype = {
  typeName: DATATYPE_NAME.NUMERIC,
  visualizationHint: DATATYPE_VIZ_HINT.CHECKBOX,
  minimum: undefined,
  maximum: undefined,
  decimals: undefined 
}

export const emptyDateDatatype = {
  typeName: DATATYPE_NAME.DATE,
  visualizationHint: DATATYPE_VIZ_HINT.CHECKBOX,  
  minimum: undefined,
  maximum: undefined,
  format: undefined
}

export const emptyDatatypeFactory = {
  [DATATYPE_NAME.TEXT]: emptyTextDatatype,
  [DATATYPE_NAME.NUMERIC]: emptyNumericDatatype,
  [DATATYPE_NAME.DATE]: emptyDateDatatype
}