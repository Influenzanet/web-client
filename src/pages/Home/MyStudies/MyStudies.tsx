import React, { useState } from 'react';

import { Container } from '@material-ui/core';

import SurveyView from '../../../components/survey/SurveyView/SurveyView';
import { useTranslation } from 'react-i18next';
import { Survey, SurveySingleItemResponse, SurveyResponse } from 'survey-engine/lib/data_types';

import { useMountEffect, useQuery, useAsyncCall } from '../../../hooks';
import NavigationHomePage from '../../../components/ui/pages/Home/NavigationHomePage';
import { SurveyAndContextMsg } from '../../../types/study-api';
import LoadingDialog from '../../../components/ui/dialogs/LoadingDialog';
import { getAssignedSurveyRequest, submitSurveyResponseRequest } from '../../../api/study-api';
import moment from 'moment';
import { useHistory } from 'react-router';
import { HomePaths } from '../../../routes';

export const surveyKeyQueryKey = "surveyKey";
export const studyKeyQueryKey = "studyKey";

const MyStudies: React.FC = () => {
  const { t, i18n } = useTranslation(['common', 'survey']);
  const history = useHistory();

  const query = useQuery();
  const surveyKeyParam = query.get(surveyKeyQueryKey);
  const studyKeyParam = query.get(studyKeyQueryKey);

  const [loading, asyncCall] = useAsyncCall();

  const [surveyWithContext, setSurveyWithContext] = useState<SurveyAndContextMsg | undefined>();

  useMountEffect(() => {
    getSurvey();
  });

  const getSurvey = () => {
    if (!studyKeyParam || !surveyKeyParam) return;
    asyncCall(async () => {
      const response = await getAssignedSurveyRequest({
        studyKey: studyKeyParam,
        surveyKey: surveyKeyParam,
      });
      setSurveyWithContext(response.data);
    });
  }

  const onSurveySubmitted = (responses: SurveySingleItemResponse[]) => {
    const surveyResponse: SurveyResponse = {
      key: surveyWithContext ? surveyWithContext.survey.current.surveyDefinition.key : surveyKeyParam ? surveyKeyParam : 'unknown',
      submittedAt: moment().unix(),
      responses: [...responses],
      context: {
        engineVersion: process.env.REACT_APP_SURVEY_ENGINE_VERSION,
      }
    }

    console.log(surveyResponse);

    asyncCall(async () => {
      await submitSurveyResponseRequest({
        studyKey: studyKeyParam ? studyKeyParam : "unknown",
        response: surveyResponse,
      });
      history.push(HomePaths.Dashboard);
    });
  }

  return (
    <NavigationHomePage title="My Studies">
      <Container maxWidth="lg">
        {surveyWithContext
          ? <SurveyView
            survey={surveyWithContext.survey}
            prefills={surveyWithContext.prefill?.responses}
            context={surveyWithContext.context}
            languageCode={i18n.language}
            onSubmit={onSurveySubmitted}
            submitBtnText={t('survey:submitBtn')}
            nextBtnText={t('survey:nextBtn')}
            backBtnText={t('survey:backBtn')}
          />
          : null
        }
        <LoadingDialog open={loading} />
      </Container>
    </NavigationHomePage>
  )
}

export default MyStudies;
