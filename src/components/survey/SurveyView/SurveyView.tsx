import React, { useState, Fragment } from 'react';
import { Survey, SurveySingleItem, SurveySingleItemResponse, SurveyContext } from 'survey-engine/lib/data_types';
import { SurveyEngineCore } from 'survey-engine/lib/engine';
import SurveyPageView from './SurveyPageView/SurveyPageView';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router';
import { Box } from '@material-ui/core';
import SurveyProgress from './SurveyProgress/SurveyProgress';

interface SurveyViewProps {
  survey: Survey;
  prefills?: SurveySingleItemResponse[];
  context?: SurveyContext;
  onSubmit: (responses: SurveySingleItemResponse[]) => void;
  languageCode: string;
  backBtnText?: string;
  nextBtnText?: string;
  submitBtnText?: string;
  // init with temporary loaded results
  // save temporary result
}

const SurveyView: React.FC<SurveyViewProps> = (props) => {
  const [surveyEngine] = useState<SurveyEngineCore>(new SurveyEngineCore(props.survey, props.context, props.prefills));
  const surveyPages = surveyEngine.getSurveyPages();

  const [responseCount, setResponseCount] = useState(0);

  let { path: surveyPath } = useRouteMatch();
  let pagesPath = `${surveyPath}/pages`;

  let currentPage = (window.location.href.includes(pagesPath))
    ? parseInt(window.location.href.split("/").slice(-1)[0])
    : 0;

  const onSubmit = () => {
    const resp = surveyEngine.getResponses();
    props.onSubmit(resp);
  }

  const resetScrollPosition = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

  }

  const surveyPage = (surveyPageItems: SurveySingleItem[], primaryActionLabel: string, primaryAction: () => void) => {
    return <SurveyPageView
      surveyEngine={surveyEngine}
      surveyItems={surveyPageItems}
      actionLabel={primaryActionLabel}
      action={primaryAction}
      selectedLanguage={props.languageCode}
      responseCount={responseCount}
      setResponseCount={setResponseCount}
    />
  }

  return (
    <Fragment>
      {surveyPages.length > 1 ?
        <Box px={4} my={4}
        >
          <Box>
            <SurveyProgress
              currentIndex={currentPage}
              totalCount={surveyPages.length}
            />
          </Box>
        </Box> : null}

      <Switch>
        <Route path={`${pagesPath}/:index`} render={routeProps => {
          let index = parseInt(routeProps.match.params.index);

          // If invalid index, redirect to beginning of survey.
          if (index < 0 || index > surveyPages.length - 1) return <Redirect to={`${pagesPath}/0`} />

          let lastPage = index >= surveyPages.length - 1;

          let primaryActionLabel = (lastPage) ?
            (props.submitBtnText ? props.submitBtnText : "Submit") :
            (props.nextBtnText ? props.nextBtnText : "Next");
          let primaryAction = (lastPage)
            ? () => {
              onSubmit();
            }
            : () => {
              routeProps.history.push(`${pagesPath}/${index + 1}`);
              resetScrollPosition();
            }

          return surveyPage(surveyPages[index], primaryActionLabel, primaryAction);
        }} />
        <Redirect to={`${pagesPath}/0`} />
      </Switch>
    </Fragment>
  );
};

export default SurveyView;
