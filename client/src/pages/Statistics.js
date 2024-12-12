import React from 'react';
import ApplicationStatus from '../components/ApplicationStatus';
import UsersByRole from '../components/UsersByRole';
import OnboardedCandidates from '../components/Onboarded';
import RecruiterScorecard from '../components/RecruiterScoreCard';

const Statistics = () => {
  return (
    <div>
      <UsersByRole />
     <RecruiterScorecard />
     <div className='stat-container'>
          <div className='stat-repo1'>
          <ApplicationStatus />
        </div>
        <div className='stat-repo2'>
          <OnboardedCandidates />
        </div>  
      </div>
    </div>
   
  );
};

export default Statistics;
