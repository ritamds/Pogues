var PoguesDispatcher = require('../dispatchers/pogues-dispatcher');
var PoguesConstants = require('../constants/pogues-constants');
var Logger = require('../logger/Logger');

var logger = new Logger('PoguesActions', 'Actions');

var PoguesActions = {
  setLanguage: function (language) {
    logger.info('Setting language action');
    PoguesDispatcher.handleViewAction({
      actionType: PoguesConstants.ActionTypes.LANGUAGE_CHANGED,
      language: language
    });
  },
  // Questionnaire list loaded or not from the server
  receiveQuestionnaireList: function(questionnaires) {
    logger.info('Receiving questionnaire list');
    PoguesDispatcher.handleServerAction({
      actionType: PoguesConstants.ActionTypes.RECEIVE_QUESTIONNAIRE_LIST,
      questionnaires: questionnaires
    });
  },
  getQuestionnaireList: function () {
    console.log('PoguesActions, getQuestionnaireList');
    PoguesDispatcher.handleViewAction({
      actionType: PoguesConstants.ActionTypes.LOAD_QUESTIONNAIRE_LIST
    })

  },
  getQuestionnaireListFailed: function(error) {
    PoguesDispatcher.handleServerAction({
      actionType: PoguesConstants.ActionTypes.QUESTIONNAIRE_LIST_LOADING_FAILED,
      error: error
    });
  },
  // Questionnaire loaded or not from the server
  receiveQuestionnaire: function(questionnaire) {
    PoguesDispatcher.handleServerAction({
      actionType: PoguesConstants.ActionTypes.RECEIVE_QUESTIONNAIRE,
      questionnaire: questionnaire
    });
  },
  getQuestionnaireFailed: function(error) {
    PoguesDispatcher.handleServerAction({
      actionType: PoguesConstants.ActionTypes.QUESTIONNAIRE_LOADING_FAILED,
      error: error
    });
  },
  receiveNewIdFromServer: function(oldId, newId) {
    PoguesDispatcher.handleServerAction({
      actionType: PoguesConstants.ActionTypes.RECEIVE_NEW_ID_FROM_SERVER,
      newId: newId,
      oldId: oldId
    });
  },
  // questionnaire-list-store will ask the server for an id
  createQuestionnaire: function(questionnaire) {
    PoguesDispatcher.handleViewAction({
      actionType: PoguesConstants.ActionTypes.CREATE_QUESTIONNAIRE,
      questionnaire: questionnaire
    });
  },
  // posts the questionnaire on the server which returns a new id
  // questionnaire list store will take care of asking the server
  getQuestionnaire: function() {
    PoguesDispatcher.handleServerAction({
      actionType: PoguesConstants.ActionType.GET_QUESTIONNAIRE
    })

  },
  // Questionnaire selected in questionnaire picker or newly created
  // questionnaire (after create questionnaire)
  selectQuestionnaire: function(id) {
    PoguesDispatcher.handleViewAction({
      actionType: PoguesConstants.ActionTypes.SELECT_QUESTIONNAIRE,
      id: id
    });
    PoguesActions.switchToQuestionnaire();
  },
  // A Component is added with the GenericInput (spec is {sequence, depth, text})
  addComponent: function(spec) {
    PoguesDispatcher.handleViewAction({
      actionType: PoguesConstants.ActionTypes.ADD_COMPONENT,
      spec: spec
    });
  },
  // A Component is made editable
  editComponent: function(id) {
    PoguesDispatcher.handleViewAction({
      actionType: PoguesConstants.ActionTypes.EDIT_COMPONENT,
      id : id
    });
  },
  filterComponents: function(filter) {
    logger.info('Filter action sent to dispatcher with value : ' + filter);
    PoguesDispatcher.handleViewAction({
      actionType: PoguesConstants.ActionTypes.FILTER_COMPONENTS,
      filter: filter
    })
  },
  filterQuestionnaires: function(filter) {
    PoguesDispatcher.handleViewAction({
      actionType: PoguesConstants.ActionTypes.FILTER_QUESTIONNAIRES,
      filter: filter
    })
  },
  saveQuestionnaire: function(questionnaire) {
    PoguesDispatcher.handleServerAction({
      actionType: PoguesConstants.ActionTypes.SAVE_QUESTIONNAIRE,
      questionnaire: questionnaire
    });
  },
  switchToQuestionnaire: function(id) {
    PoguesDispatcher.handleViewAction({
      actionType: PoguesConstants.ActionTypes.SWITCH_VIEW_QUESTIONNAIRE,
      idQuestionnaire: id
    })
  },
  switchToPicker: function() {
    PoguesDispatcher.handleViewAction({
      actionType: PoguesConstants.ActionTypes.SWITCH_VIEW_PICKER
    })
  },
  switchToSettings: function() {
    PoguesDispatcher.handleViewAction({
      actionType: PoguesConstants.ActionTypes.SWITCH_VIEW_SETTINGS
    })
  },
  // Edit the current questionnaire prop giving the prop key and the new value
  editQuestionnaire: function(key, value) {
    console.warn('Edit action. ' + key + ' : ' + value);
    PoguesDispatcher.handleViewAction({
      actionType: PoguesConstants.ActionTypes.EDIT_QUESTIONNAIRE,
      k : key,
      v : value
    });
  }
};

module.exports = PoguesActions;
