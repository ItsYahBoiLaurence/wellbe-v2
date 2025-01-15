import { useState } from 'react';
import SurveyCompleted from './Completed';
import SurveyQuestions from './Questions';
import SurveyStartPage from './Start';

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
    <div>
      {surveyStatus === SurveyStatus.START && (
        <SurveyStartPage changeStateFunction={handleChange} status={surveyStatus} />
      )}
      {surveyStatus === SurveyStatus.IN_PROGRESS && (
        <SurveyQuestions changeStateFunction={handleChange} status={surveyStatus} />
      )}
      {surveyStatus === SurveyStatus.COMPLETED && (
        <SurveyCompleted />
      )}
    </div>
  );
};

export default SurveyPage;
