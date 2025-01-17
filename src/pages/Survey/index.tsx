import { useState } from 'react';
import SurveyCompleted from './Completed';
import SurveyQuestions from './Questions';
import SurveyStartPage from './Start';
import { Box, Flex, PinInput } from '@mantine/core';

enum SurveyStatus {
  START = 'survey-start',
  IN_PROGRESS = 'survey-in-progress',
  COMPLETED = 'survey-complete',
}

const SurveyPage = () => {
  const [surveyStatus, setSurveyStatus] = useState<SurveyStatus>(SurveyStatus.START);

  const handleChange = (status: SurveyStatus) => {
    setSurveyStatus(status);
  };

  return (
    <Flex direction="column" style={{ height: '100%', backgroundColor: 'white' }}>
      {surveyStatus === SurveyStatus.START && (
        <SurveyStartPage changeStateFunction={handleChange} status={surveyStatus} />
      )}
      {surveyStatus === SurveyStatus.IN_PROGRESS && (
        <SurveyQuestions changeStateFunction={handleChange} status={surveyStatus} />
      )}
      {surveyStatus === SurveyStatus.COMPLETED && (
        <SurveyCompleted />
      )}
    </Flex>


  );
};

export default SurveyPage;
