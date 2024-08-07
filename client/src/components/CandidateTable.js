import React, { useState } from 'react';
import { MdOutlineAddTask } from "react-icons/md";
import { TiEyeOutline } from "react-icons/ti";
import CandidateProfileDrawer from '../components/CandidateProfileDrawer';
import Fetchtable from '../components/Fetchtable';
import AssignInterview from '../components/AssignInterview';
import { Tooltip } from 'antd';

const URL = process.env.REACT_APP_API_URL;
const CandidateTable = ({auth}) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleDrawerClose = () => {
    setShowDrawer(false);
    setProfileOpen(false);
  };

  const handleView = (row) => {
    
    setSelectedCandidate(row);
    setShowDrawer(false);
    setProfileOpen(true);
  };
  
  const handleAssign = (row) => {
    setSelectedCandidate(row);
    setShowDrawer(true);
    setProfileOpen(false);
  };

  const renderResumeLink = (row) => {
    if (row.resume) {
      const downloadLink = `${URL}${row.resume}`;
      return (
        <a href={downloadLink} target="_blank" rel="noopener noreferrer" className='resume-link'>
          {row.firstName} CV
        </a>
      );
    } else {
      return "Resume not available";
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'HR':
        return { backgroundColor: '#4DC230', color: 'white' };
      case 'L1':
        return { backgroundColor: 'yellow', color: 'black' };
      case 'L2':
        return { backgroundColor: '#1884E8', color: 'white' };
      case 'Rejected':
        return { backgroundColor: 'red', color: 'white' };
      case 'Processing':
        return { backgroundColor: '#00B4', color: 'white' };
      case 'Selected':
        return { backgroundColor: '#00B4D2', color: 'white' };
      default:
        return { backgroundColor: 'black', color: 'white' };
    }
  };

  const userColumns = [
    { name: 'Name', selector: (row) => row.fullName,
      cell: (row) => (
        <div style={{
         textTransform: 'capitalize', 
        }}>
          {row.fullName}
        </div>
      ),
      sortable: true, width: '200px', },
    { name: 'Location', selector: (row) => row.currentLocation,cell: (row) => (
      <div style={{
       textTransform: 'capitalize', 
      }}>
        {row.currentLocation}
      </div>
    ), sortable: true, width: '130px' },
    { name: 'Resume', cell: (row) => renderResumeLink(row), sortable: true, width: '130px' },
    { name: 'Notice Period', selector: (row) => row.noticePeriod, sortable: true },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <div style={{
          ...getStatusStyles(row.status),
          padding: '5px 10px',
          borderRadiufs: '5px',
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
        url={`${URL}/candidatesreport`}
        columns={userColumns} 
        setSelectedCandidate={setSelectedCandidate}
      />
      <AssignInterview 
        open={showDrawer} 
        onClose={handleDrawerClose} 
        auth={auth}
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
