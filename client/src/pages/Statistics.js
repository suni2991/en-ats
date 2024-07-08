import React from 'react';

import ApplicationStatus from '../components/ApplicationStatus';
import UsersByRole from '../components/UsersByRole';

import OnboardedCandidates from '../components/Onboarded';

const Statistics = () => {
  return (
    <div>
      <UsersByRole />
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
