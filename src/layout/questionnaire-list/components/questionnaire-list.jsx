import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Questionnaire from './questionnaire';

import Dictionary from 'utils/dictionary/dictionary';
import { formatDate, getState } from 'utils/component/component-utils';

const QuestionnaireList = props => {
  const { questionnaires, user } = props;
  const [filter, setFilter] = useState('');

  const updateFilter = (value) => {
		setFilter(value);
  };
  
  const list = questionnaires
    .filter(q => {
      return (
        filter === '' ||
        q.label.toLowerCase().indexOf(filter) >= 0 ||
        getState(q.final)
          .toLowerCase()
          .indexOf(filter) >= 0 ||
        (q.lastUpdatedDate &&
          formatDate(q.lastUpdatedDate)
            .toLowerCase()
            .indexOf(filter) >= 0)
      );
    })
    .map(q => {
      return (
        <Questionnaire
          key={q.id}
          id={q.id}
          label={q.label}
          lastUpdatedDate={q.lastUpdatedDate}
          final={q.final}
        />
      );
    });

	useEffect(() => {
    if (props.user && props.user.permission)
      props.loadQuestionnaireList(props.user.permission);
  }, []);

  useEffect(() => {
    props.loadQuestionnaireList(props.user.permission);
  }, [props.user.permission]);


	return (
    <div className="box home-questionnaires">
    <h3>{Dictionary.homeQuestionnairesInProgress}</h3>
    <h4>
      {Dictionary.stamp} {user.permission}
    </h4>
    <div id="questionnaire-list">
      {questionnaires.length > 0 ? (
        <div>
          <div className="ctrl-input">
            <input
              className="form-control"
              placeholder={Dictionary.search}
              type="text"
              onChange={e => updateFilter(e.target.value)}
            />
          </div>
          <div className="questionnaire-list_header">
            <div>{Dictionary.QUESTIONNAIRE}</div>
            <div>{Dictionary.state}</div>
            <div>{Dictionary.lastUpdate}</div>
          </div>
          {list}
        </div>
      ) : (
        <div className="questionnaire-list_noresults">
          {Dictionary.noQuestionnnaires}
        </div>
      )}
    </div>
  </div>
	);
};
// Prop types and default props

QuestionnaireList.propTypes = {
  loadQuestionnaireList: PropTypes.func.isRequired,
  questionnaires: PropTypes.array,
  user: PropTypes.shape({
    name: PropTypes.string,
    permission: PropTypes.string,
    id: PropTypes.string,
    picture: PropTypes.string,
  }),
};

QuestionnaireList.defaultProps = {
  questionnaires: [],
  user: {},
};

// Component

class QuestionnaireList extends Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      loaded: false,
    };
  }

  UNSAFE_componentWillMount() {
    if (this.props.user && this.props.user.permission){
      this.props.loadQuestionnaireList(this.props.user.permission);
      this.setState({
        loaded: true,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.permission !== this.props.user.permission) {
      this.props.loadQuestionnaireList(nextProps.user.permission);
      this.setState({
        loaded: true,
      });
    }
  }

  updateFilter(value) {
    this.setState({
      filter: value,
    });
  }

  render() {
    const { questionnaires, user } = this.props;

    const list = questionnaires
      .filter(q => {
        return (
          this.state.filter === '' ||
          q.label.toLowerCase().indexOf(this.state.filter) >= 0 ||
          getState(q.final)
            .toLowerCase()
            .indexOf(this.state.filter) >= 0 ||
          (q.lastUpdatedDate &&
            formatDate(q.lastUpdatedDate)
              .toLowerCase()
              .indexOf(this.state.filter) >= 0)
        );
      })
      .map(q => {
        return (
          <Questionnaire
            key={q.id}
            id={q.id}
            label={q.label}
            lastUpdatedDate={q.lastUpdatedDate}
            final={q.final}
          />
        );
      });

    return (
      <div className="box home-questionnaires">
        <h3>{Dictionary.homeQuestionnairesInProgress}</h3>
        <h4>
          {Dictionary.stamp} {user.permission}
        </h4>
        <div id="questionnaire-list">
          {questionnaires.length > 0 ? (
            <div>
              <div className="ctrl-input">
                <input
                  className="form-control"
                  placeholder={Dictionary.search}
                  type="text"
                  onChange={e => this.updateFilter(e.target.value)}
                />
              </div>
              <div className="questionnaire-list_header">
                <div>{Dictionary.QUESTIONNAIRE}</div>
                <div>{Dictionary.state}</div>
                <div>{Dictionary.lastUpdate}</div>
              </div>
              {list}
            </div>
          ) : this.state.loaded? (
            <div className="questionnaire-list_noresults">
              {Dictionary.noQuestionnaires}
            </div>
          ) : (
            <div className="questionnaire-list_loading">
              {Dictionary.loading}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default QuestionnaireList;
