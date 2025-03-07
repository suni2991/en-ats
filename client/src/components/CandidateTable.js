import React, { useEffect, useState } from 'react';
import { MdOutlineAddTask } from "react-icons/md";
import { TiCancel, TiDelete, TiEdit, TiEyeOutline, TiUserDelete, TiUserDeleteOutline } from "react-icons/ti";
import CandidateProfileDrawer from '../components/CandidateProfileDrawer';
import Fetchtable from '../components/Fetchtable';
import AssignInterview from '../components/AssignInterview';
import { Modal, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import EditCandidate from './EditCandidate';

const URL = process.env.REACT_APP_API_URL;
const CandidateTable = ({ auth, token }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // const navigateTo = useNavigate();

  const closeModal = () => {
    // setSelectedCandidate(null);
    setIsEditModalVisible(false);
  };

  const handleDrawerClose = () => {
    setShowDrawer(false);
    setProfileOpen(false);
    setReloadData(true);
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

  const handleEditCandidate = (row) => {
    setSelectedCandidate(row);
    setIsEditModalVisible(true);
    // navigateTo('/editCandidate', { state: row });
  }

  const renderResumeLink = (row) => {
    if (row.resume) {
      // const downloadLink = `${URL}${row.resume}`;

      let downloadLink = `${URL}${row.resume}`;
      if (row.resume.includes("google.com")) {
        downloadLink = row.resume;
      }

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
      case 'HR Interview Cleared':
        return { backgroundColor: '#4DC230', color: 'white' };
      case 'L1 Interview Cleared':
        return { backgroundColor: '#7BC9FF', color: 'black' };
      case 'L2 Interview Cleared':
        return { backgroundColor: '#88C273', color: 'white' };
      case 'CV Rejected':
        return { backgroundColor: 'red', color: 'white' };
      case 'CV Shortlisted' || 'CV Sourced':
        return { backgroundColor: '#DEF9C4', color: '#00B4D2' };
      case 'L1 Assigned':
        return { backgroundColor: '#50B498', color: 'white' };
      case 'L2 Assigned':
        return { backgroundColor: '#7BC9FF ', color: 'white' };
      case 'HR Assigned':
        return { backgroundColor: '#88C273', color: 'white' }
      case 'Onboarded':
        return { backgroundColor: '#00B4D2', color: 'white' };
      case 'Screening Done':
        return { backgroundColor: '#9CDBA6', color: 'white' };
      default:
        return { backgroundColor: 'white', color: 'red' }
    }
  };

  const userColumns = [
    {
      name: 'Name', selector: (row) => row.fullName,
      cell: (row) => (
        <div style={{
          textTransform: 'capitalize',
        }}>
          {row.fullName}
        </div>
      ),
      sortable: true, width: '200px',
    },
    {
      name: 'Location', selector: (row) => row.currentLocation, cell: (row) => (
        <div style={{
          textTransform: 'capitalize',
        }}>
          {row.currentLocation}
        </div>
      ), sortable: true, width: '130px'
    },
    { name: 'Resume', cell: (row) => renderResumeLink(row), sortable: true, width: '130px' },
    { name: 'Notice Period', selector: (row) => row.noticePeriod, sortable: true, width: '230px' },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      width: '250px',
      cell: (row) => (
        <div style={{
          ...getStatusStyles(row.status),
          padding: '5px 10px',
          // borderRadius: '5px',
          textAlign: 'center',
          // width: '30%'
        }}>
          {row.status}
        </div>
      ),
    },
    {
      name: 'Actions',
      width: '298px',
      cell: (row) => (
        <div style={{marginLeft: '45px', paddingTop: '10px', paddingBottom: '10px'}}>
          <Tooltip title="Assign Interview" color='cyan'>
            <button className='table-btn' style={{}}  name='Assign' onClick={() => handleAssign(row)}>
              <MdOutlineAddTask />
            </button>
          </Tooltip>
          <Tooltip title="View Details" color='cyan'>
            <button className='table-btn'   name='View' onClick={() => handleView(row)}>
              <TiEyeOutline />
            </button>
          </Tooltip>
          <Tooltip title="Edit Candidate" color='cyan' >
            <button className='table-btn'   name='Edit' onClick={() => handleEditCandidate(row)}>
              <TiEdit />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];


  return (
    <>
      <div>
        <Fetchtable
          url={`${URL}/api/candidatesreport`}
          columns={userColumns}
          setSelectedCandidate={setSelectedCandidate}
          reloadData={reloadData}
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
            candidateManager={selectedCandidate ? selectedCandidate.mgrEmail : ''}
          />}

        <Modal
          // key={selectedCandidate._id}
          open={isEditModalVisible}
          onCancel={closeModal}
          footer={null}
          width={800}
          title={<h2>Edit Candidate</h2>}
        >
          <EditCandidate selectedCandidate={selectedCandidate} closeModal={closeModal} />
        </Modal>
      </div>
    </>
  );
};

export default CandidateTable;