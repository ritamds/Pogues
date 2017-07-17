import { QUESTION_TYPE_ENUM } from 'constants/pogues-constants';

const { SINGLE_CHOICE, MULTIPLE_CHOICE, TABLE } = QUESTION_TYPE_ENUM;

export function getCodesListFromForm(form) {
  const codesList = {};

  if (form.responseFormat) {
    const type = form.responseFormat.type;
    const responseFormatType = form.responseFormat[type];

    if (type === SINGLE_CHOICE) {
      const responseFormatCodesList = responseFormatType[responseFormatType.type].codesList;
      const responseFormatCodes = responseFormatType[responseFormatType.type].codes;
      codesList[responseFormatCodesList.id] = {
        ...responseFormatCodesList,
        codes: responseFormatCodes.map(code => code.id),
      };
    } else if (type === MULTIPLE_CHOICE) {
    } else if (type === TABLE) {
    }
  }

  return codesList;
}

export function getCodesFromForm(form) {
  let codes = {};

  if (form.responseFormat) {
    const type = form.responseFormat.type;
    const responseFormatType = form.responseFormat[type];

    if (type === SINGLE_CHOICE) {
      const responseFormatCodes = responseFormatType[responseFormatType.type].codes;
      codes = responseFormatCodes.reduce((acc, code) => {
        acc[code.id] = { ...code };
        return acc;
      }, {});
    } else if (type === MULTIPLE_CHOICE) {
    } else if (type === TABLE) {
    }
  }

  return codes;
}

/**
 * This function is called when we add a component to a parent
 * 
 * @param {object[]} activeComponents The liste of components
 * @param {string} parentId The id of the parent we should update
 * @param {string} newComponentId The id of the created component
 */
export function updateNewComponentParent(activeComponents, parentId, newComponentId) {
  const parent = activeComponents[parentId];
  return {
    [parentId]: {
      ...parent,
      children: [...parent.children, newComponentId],
    },
  };
}
