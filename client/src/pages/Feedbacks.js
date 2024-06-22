import React, { useState } from 'react';
import Fetchtable from '../components/Fetchtable';
import useAuth from '../hooks/useAuth';
import { Tooltip, DatePicker, Form, Button, Modal, Select } from 'antd';
import axios from 'axios';
import { MdUpdate } from "react-icons/md";
import { VscFeedback } from "react-icons/vsc";
import Panelist from '../components/Panelist';

const { Option } = Select;

const Feedback = () => {
  const { auth } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isJoiningDateModalVisible, setIsJoiningDateModalVisible] = useState(false);
  const [joiningDate, setJoiningDate] = useState(null);
  const [updateType, setUpdateType] = useState('status');
  const [status, setStatus] = useState('');
  
  const userColumns = [
    { name: 'Name', selector: (row) => row.fullName, sortable: true },
    { name: 'Position', selector: (row) => row.position, sortable: true  },
   
    { name: 'Resume', cell: (row) => renderResumeLink(row), sortable: true },
    { name: 'Status', selector: (row) => row.status, sortable: true },
    {
      name: 'Action', 
      cell: (row) => (
        <div>
          <Tooltip title="Give Feedback" color='cyan'>
            <Button to="#" className='table-btn' onClick={() => showModal(row)}>
              <VscFeedback />
            </Button>
          </Tooltip>
          {auth.role === 'HR' && (
            <Tooltip title="Update" color='cyan'>
              <Button to="#" className='table-btn' onClick={() => showJoiningDateModal(row)}>
                <MdUpdate />
              </Button>
            </Tooltip>
          )}
        </div>
      ),
    },
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

  const showModal = (row) => {
    setSelectedCandidate(row);
    setIsModalVisible(true);
  };
  
  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedCandidate(null);
  };

  const showJoiningDateModal = (row) => {
    setSelectedCandidate(row);
    setIsJoiningDateModalVisible(true);
  };

  const closeJoiningDateModal = () => {
    setIsJoiningDateModalVisible(false);
    setSelectedCandidate(null);
    setJoiningDate(null);
    setStatus('');
    setUpdateType('status');
  };

  const handleJoiningDateChange = (date) => {
    setJoiningDate(date);
  };

  const handleUpdateTypeChange = (value) => {
    setUpdateType(value);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleUpdate = async () => {
    if (selectedCandidate) {
      console.log('Selected Candidate:', selectedCandidate); // Log the selected candidate
      try {
        const updates = {};
        if (updateType === 'joiningDate' && joiningDate) {
          updates.joiningDate = joiningDate.toISOString();
        } else if (updateType === 'status' && status) {
          updates.status = status;
          if (status === 'Onboarded') {
            updates.role = 'Enfusian';
          }
        }
        await axios.put(`http://localhost:5040/feedback/${selectedCandidate._id}`, updates); // Ensure _id is used
        closeJoiningDateModal();
      } catch (error) {
        console.error('Failed to update', error);
      }
    }
  };
  

  return (
    <div className='vh-page' style={{textTransform:'capitalize'}}>
      <Fetchtable
        url={`http://localhost:5040/panelist/${auth.fullName}`}
        columns={userColumns}
      />
      <Modal
        title="Interview Feedback Form"
        open={isModalVisible}
        onCancel={closeModal}
        width={700}
        footer={null}
      >
        {selectedCandidate && <Panelist candidateData={selectedCandidate} auth={auth} />}
      </Modal>
      <Modal
        title="Update Status / Joining Date"
        open={isJoiningDateModalVisible}
        onCancel={closeJoiningDateModal}
        footer={null}
      >
        <Form layout="vertical">
          <Form.Item label="Update Type">
            <Select defaultValue="status" onChange={handleUpdateTypeChange}>
              <Option value="status">Update Status</Option>
              <Option value="joiningDate">Update Joining Date</Option>
            </Select>
          </Form.Item>
          {updateType === 'status' && (
            <Form.Item label="Status">
              <Select onChange={handleStatusChange}>
                <Option value="Onboarded">Onboarded</Option>
                <Option value="Rejected">Rejected</Option>
              </Select>
            </Form.Item>
          )}
          {updateType === 'joiningDate' && (
            <Form.Item label="Joining Date">
              <DatePicker onChange={handleJoiningDateChange} />
            </Form.Item>
          )}
        </Form>
        <Button type="primary" onClick={handleUpdate}>
          Update
        </Button>
      </Modal>
    </div>
  );
};

export default Feedback;
