import React, { useState } from 'react';
import Fetchtable from './Fetchtable';
import { Modal, Button, Spin, Tooltip } from 'antd';
import { TiEyeOutline } from "react-icons/ti";
import axios from 'axios';

const Viewjob = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'green';
      case 'Hold':
        return '#00B4D2';
      case 'Inactive':
        return 'red';
      default:
        return 'black';
    }
  };
  const handleRowButtonClick = async (jobId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5040/job-posts/${jobId}`);
      setSelectedJob(response.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedJob(null);
  };

  

  const userColumns = [
    // {
    //   name: 'Date',
    //   selector: (row) => {
    //     const date = new Date(row.postedAt);
    //     const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    //     return formattedDate;
    //   },
    //   width: '100px',
    //   sortable: true,
    // },
    { name: 'Role', selector: (row) => row.position, sortable: true },
    {name: 'Department', selector: (row) => row.department, sortable: true },
    
    { name: 'Location', selector: (row) => row.jobLocation, sortable: true, width:'150px' },
    { name: 'HR Name', selector: (row) => row.postedBy, sortable: true },
    { name: 'Vacancies', selector: (row) => row.vacancies, sortable: true, width: '120px' },
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
          textAlign: 'center'
        }}>
          {row.status}
        </div>
      ),
    },
    {
      name: 'Action',
      cell: (row) => (
       
        <Tooltip title="View Details" color='cyan'><button className='table-btn' name='View' onClick={() => handleRowButtonClick(row._id)}><TiEyeOutline /></button></Tooltip>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];



  return (
    <div>
      <h1>Monitor the jobs created</h1>
      <Fetchtable 
        url="http://localhost:5040/viewjobs"
        columns={userColumns}
      />
      <Modal
        title="Job Details"
        open={isModalVisible}
        onCancel={handleCancel}
       
        footer={[
          <Button type='primary' style={{ backgroundColor: '#00B4D2', borderColor: '#fff' }} key="close" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        {loading ? (
          <Spin />
        ) : selectedJob ? (
          <div>
            <p><strong>Position:</strong> {selectedJob.position}</p>
            <p><strong>Department:</strong> {selectedJob.department}</p>
            <p><strong>Description:</strong> {selectedJob.description}</p>
            <p><strong>Job Type:</strong> {selectedJob.jobType}</p>
            <p><strong>Job Location:</strong> {selectedJob.jobLocation}</p>
            <p><strong>Vacancies:</strong> {selectedJob.vacancies}</p>
            <p><strong>Salary Range:</strong> {selectedJob.salaryRange}</p>
            <p><strong>Experience:</strong> {selectedJob.experience}</p>
            <p><strong>Mode of Job:</strong> {selectedJob.modeOfJob}</p>
            <p><strong>Posted At:</strong> {new Date(selectedJob.postedAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {selectedJob.status}</p>
          </div>
        ) : (
          <p>No job details available</p>
        )}
      </Modal>
    </div>
  );
};

export default Viewjob;
