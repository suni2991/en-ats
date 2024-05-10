import React, { useState } from 'react';
import { MdOutlineAddTask } from "react-icons/md";
import { TiEyeOutline } from "react-icons/ti";
import CandidateProfileDrawer from '../components/CandidateProfileDrawer';
import Fetchtable from '../components/Fetchtable';
import AssignInterview from '../components/AssignInterview'; // Import AssignInterview component

const Monitor = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleDrawerClose = () => {
    setShowDrawer(false); // Close the AssignInterview
  };

  const handleView = (row) => {
    setSelectedCandidate(row); // Set the selected candidate
    setShowDrawer(false); // Close the AssignInterview if open
    setProfileOpen(true); // Open the CandidateProfileDrawer
  };
  
  const handleAssign = (row) => {
    setSelectedCandidate(row); // Set the selected candidate
    setShowDrawer(true); // Open the AssignInterview
    setProfileOpen(false); // Close the CandidateProfileDrawer if open
  };

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

  const userColumns = [
    { name: 'Name', selector: (row) => row.fullName, sortable: true },
    { name: 'Email', selector: (row) => row.email, sortable: true },
    { name: 'Resume', cell: (row) => renderResumeLink(row), sortable: true },
    { name: 'Status', selector: (row) => row.status, sortable: true },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <button className='table-btn' name='Assign' onClick={() => handleAssign(row)}><MdOutlineAddTask /></button>
          <button className='table-btn' name='View' onClick={() => handleView(row)}><TiEyeOutline /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="table-container">
      <div className="search-filter">
        <h1>Monitor every candidate - Assign Interview - View the Details/Status</h1>
      </div>
      <Fetchtable 
        url="http://localhost:5040/candidatesreport"
        columns={userColumns} 
        setSelectedCandidate={setSelectedCandidate}
      />
      <AssignInterview 
        visible={showDrawer} 
        onClose={handleDrawerClose} 
        candidateId={selectedCandidate ? selectedCandidate._id : ''}
      />
      {profileOpen && <CandidateProfileDrawer visible={profileOpen} onClose={() => setProfileOpen(false)} candidateId={selectedCandidate ? selectedCandidate._id : ''} />}
    </div>
  );
};

export default Monitor;
