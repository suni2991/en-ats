import React, { useState, useEffect } from 'react';
import Fetchtable from './Fetchtable';
import { Modal, Button, Spin, Tooltip, Typography, Select } from 'antd';
import { TiEyeOutline } from "react-icons/ti";
import axios from 'axios';
import { CiEdit } from "react-icons/ci";
import { AiOutlineCheckCircle } from "react-icons/ai";

const { Option } = Select;
const { Text } = Typography;

const Viewjob = ({ jobs, setJobs, filteredJobs, setFilteredJobs }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [candidateCounts, setCandidateCounts] = useState({});
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isEditClicked, setIsEditClicked] = useState(false);

  const colors = {
    Active: 'green',
    Hold: '#00B4D2',
    Inactive: 'red',
  };

  useEffect(() => {
    const fetchCandidateCounts = async () => {
      try {
        const response = await axios.get('http://localhost:5040/viewjobs');
        const jobs = response.data;

        const counts = await Promise.all(jobs.map(async (job) => {
          const countResponse = await axios.get(`http://localhost:5040/candidates/position/${job.position}`);
          return { position: job.position, count: countResponse.data.count };
        }));

        const countsObject = counts.reduce((acc, { position, count }) => {
          acc[position] = count;
          return acc;
        }, {});

        setCandidateCounts(countsObject);
        setJobs(jobs);
        setFilteredJobs(jobs);
      } catch (error) {
        console.error('Error fetching candidate counts:', error);
      }
    };

    fetchCandidateCounts();
  }, [setJobs, setFilteredJobs]);

  const userColumns = [
    { name: 'Role', selector: (row) => row.position, sortable: true, width:'160px' },
    { name: 'Department', selector: (row) => row.department, sortable: true, width:'160px' },
    { name: 'Location', selector: (row) => row.jobLocation, sortable: true, width: '150px' },
    { name: 'HR Name', selector: (row) => row.postedBy, sortable: true, width:'160px' },
    { name: 'Vacancies', selector: (row) => row.vacancies, sortable: true, width: '130px' },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      width:'100px',
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
      width:'100px'
    },
  ];

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
    setIsEditClicked(false); // Reset edit state
    setSelectedStatus(''); // Reset selected status
  };

  const handleUpdateStatus = async () => {
    if (selectedStatus && selectedJob) {
      setLoading(true);
      try {
        await axios.put(`http://localhost:5040/job-posts/${selectedJob._id}`, { status: selectedStatus });
        const updatedJob = { ...selectedJob, status: selectedStatus };
        setSelectedJob(updatedJob);

        // Update the jobs and filteredJobs with the updated status
        const updatedJobs = jobs.map((job) => job._id === selectedJob._id ? updatedJob : job);
        setJobs(updatedJobs);
        setFilteredJobs(updatedJobs);

        setIsModalVisible(false);
        setIsEditClicked(false);
      } catch (error) {
        console.error('Error updating job status:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Fetchtable
        url="http://localhost:5040/viewjobs"
        columns={userColumns}
        filteredData={filteredJobs}
      />
      <Modal
        title='Details'
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        {loading ? (
          <Spin />
        ) : selectedJob ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h1 style={{ fontWeight: 'bold', marginRight: 'auto' }}>Job Title: {selectedJob.position}</h1>
              <h1 style={{ fontWeight: 'bold', marginLeft: 'auto', color: colors[selectedJob.status] }}>{selectedJob.status}</h1>
              {isEditClicked ? (
                <Tooltip title="Save Changes" color='green'>
                  <Button
                    type='text'
                    onClick={handleUpdateStatus}
                  >
                    <AiOutlineCheckCircle style={{ color: 'green' }} />
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title="Edit Status" color='cyan'>
                  <Button
                    type='text'
                    onClick={() => setIsEditClicked(true)}
                  >
                    <CiEdit style={{ color: '#1a2763' }} />
                  </Button>
                </Tooltip>
              )}
            </div>
            {isEditClicked && (
              <Select
                key="status"
                value={selectedStatus}
                onChange={(value) => setSelectedStatus(value)}
              >
                <Option value="">Choose one</Option>
                <Option value="Hold">Hold</Option>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            )}
            <p style={{ fontWeight: 'bold' }}>Department: {selectedJob.department}</p>
            <hr color='#00B4D2' />
            
            
            <div  style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text style={{ color: 'grey', marginRight: 'auto', background:'#FFF' }}><strong>Job Location:</strong> <br/>{selectedJob.jobLocation}</Text>
              
              <Text style={{ color: 'grey', marginLeft: 'auto', background:'#FFF'  }}><strong>Experience:</strong><br/>{selectedJob.experience}</Text>

              <Text style={{ color: 'grey', marginLeft: 'auto', background:'#FFF'  }}><strong>No. of Vacancies:</strong> <br/> {selectedJob.vacancies}</Text>
            
              
            </div>
            <div  style={{ display: 'flex'}}>
          
            <Text style={{ color: 'grey', marginRight: '140px', background:'#FFF'  }}><strong>Posted By:</strong><br/>{selectedJob.postedBy}</Text>
            <Text style={{color: 'grey', background:'#FFF' }}><strong>Posted At:</strong> <br/>{new Date(selectedJob.postedAt).toLocaleDateString()}</Text>
            
          </div>
          
            <p style={{ fontWeight: 'bold', marginLeft: '10px' }}>Description</p>
            <p style={{ fontWeight: 'bold', marginLeft: '10px' }}>{selectedJob.description}</p>
          </>
        ) : (
          <p>No job details available</p>
        )}
      </Modal>
    </div>
  );
};

export default Viewjob;
