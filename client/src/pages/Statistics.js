import React from 'react'
import VacanciesChart from '../components/Vacancies'
import JobPositionPieChart from '../components/JobPosition'
import ApplicationStatus from '../components/ApplicationStatus'
import UsersByRole from '../components/UsersByRole'
import CandidateScoresChart from '../components/CandidateScore'


const Statistics = () => {
  return (
    <div className='table-container'>
    <UsersByRole />
    <div className="statistics-container">
      <div className="chart-container">
      <CandidateScoresChart />
        <VacanciesChart />
        <JobPositionPieChart />
        <ApplicationStatus />
        
      </div>
    </div>
    </div>
  )
}

export default Statistics