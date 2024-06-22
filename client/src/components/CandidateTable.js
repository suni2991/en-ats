import React, { useState } from 'react';
import { MdOutlineAddTask } from "react-icons/md";
import { TiEyeOutline } from "react-icons/ti";
import CandidateProfileDrawer from '../components/CandidateProfileDrawer';
import Fetchtable from '../components/Fetchtable';
import AssignInterview from '../components/AssignInterview';
import { Tooltip } from 'antd';

const CandidateTable = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleDrawerClose = () => {
    setShowDrawer(false);
    setProfileOpen(false);
  };

  const handleView = (row) => {
    console.log("Viewing candidate:", row); // Debugging log
    setSelectedCandidate(row);
    setShowDrawer(false);
    setProfileOpen(true);
  };
  
  const handleAssign = (row) => {
    console.log("Assigning candidate:", row); // Debugging log
    setSelectedCandidate(row);
    setShowDrawer(true);
    setProfileOpen(false);
  };

  const renderResumeLink = (row) => {
    if (row.resume) {
      const downloadLink = `http://localhost:5040${row.resume}`;
      return (
        <a href={downloadLink} target="_blank" rel="noopener noreferrer" className='resume-link'>
          {row.firstName} CV
        </a>
      );
    } else {
      return "Resume not available";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'HR':
        return '#4DC230';
      case 'L1':
        return 'yellow';
      case 'L2':
        return '#1884E8';
      case 'Rejected':
        return 'red';
      case 'Processing':
        return '#00B4';
      case 'Selected':
        return '#00B4D2';
      default:
        return 'black';
    }
  };

  const userColumns = [
    { name: 'Name', selector: (row) => row.fullName, sortable: true, width: '200px' },
    { name: 'Location', selector: (row) => row.currentLocation, sortable: true, width: '130px' },
    { name: 'Resume', cell: (row) => renderResumeLink(row), sortable: true, width: '130px' },
    { name: 'Notice Period', selector: (row) => row.noticePeriod, sortable: true },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <div style={{
          backgroundColor: getStatusColor(row.status),
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          textAlign: 'center',
          width: '80%'
        }}>
          {row.status}
        </div>
      ),
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <Tooltip title="Assign Interview" color='cyan'>
            <button className='table-btn' name='Assign' onClick={() => handleAssign(row)}>
              <MdOutlineAddTask />
            </button>
          </Tooltip>
          <Tooltip title="View Details" color='cyan'>
            <button className='table-btn' name='View' onClick={() => handleView(row)}>
              <TiEyeOutline />
            </button>
          </Tooltip>
        </div>
      ),
      width: '150px'
    },
  ];

  
  return (
    <div>
      <Fetchtable 
        url="http://localhost:5040/candidatesreport"
        columns={userColumns} 
        setSelectedCandidate={setSelectedCandidate}
      />
      <AssignInterview 
        open={showDrawer} 
        onClose={handleDrawerClose} 
        candidateId={selectedCandidate ? selectedCandidate._id : ''}
      />
      {profileOpen && 
        <CandidateProfileDrawer 
          open={profileOpen} 
          onClose={handleDrawerClose} 
          candidateId={selectedCandidate ? selectedCandidate._id : ''} 
        />}
    </div>
  );
};

export default CandidateTable;
