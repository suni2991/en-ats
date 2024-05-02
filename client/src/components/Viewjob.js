import React from 'react'
import Fetchtable from './Fetchtable'

const Viewjob = () => {
  const userColumns = [
    { 
      name: 'Posted Date',
      selector: (row) => {
        const date = new Date(row.postedAt);
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        return formattedDate;
      },
      sortable: true
    },
    { name: 'Position', selector: (row) => row.position, sortable: true },
    { name: 'Job Type', selector: (row) => row.jobType, sortable: true },
    { name: 'Job Location', selector: (row) => row.jobLocation, sortable: true },
    {name: 'Vacancies', selector: (row) => row.vacancies, sortable: true},
   
];

  return (
    <div><h1>Viewjob</h1>
      <Fetchtable 
      url="http://localhost:5040/viewjobs"
                columns={userColumns} 
      />
    </div>
  )
}

export default Viewjob