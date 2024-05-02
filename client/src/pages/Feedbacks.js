import React from 'react'

import Fetchtable from '../components/Fetchtable';
import useAuth from '../hooks/useAuth';

const Feedbacks = () => {
    const { auth } = useAuth();
    const userColumns = [
        { name: 'Position', selector: (row) => row.postion, sortable: true },
        { name: 'Name', selector: (row) => row.fullName, sortable: true },
        { name: 'Email', selector: (row) => row.email, sortable: true },
        { name: 'Resume', cell: (row) => renderResumeLink(row), sortable: true },
        { name: 'Status', selector: (row) => row.status, sortable: true },
      ];

      const renderResumeLink = (row) => {
        if (row.resume) {
          const downloadLink = `http://localhost:5040${row.resume}`;
          return (
            <a href={downloadLink} target="_blank" rel="noopener noreferrer" className='resume-link'>
              {row.fullName} CV
            </a>
          );
        } else {
          return "Resume not available";
        }
      };
    
  return (
    <div><h1>Feedbacks</h1>
    
    <Fetchtable
    url={`http://localhost:5040/panelist/${auth.fullName}`}
        columns={userColumns}
    />
    </div>
  )
}

export default Feedbacks;