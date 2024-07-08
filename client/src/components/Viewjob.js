import React, { useState, useEffect } from 'react';
import Fetchtable from './Fetchtable'; // Assuming Fetchtable is a custom component for fetching data
import { Modal, Button, Spin, Tooltip, Typography, Select, message, Input, Row, Col } from 'antd';
import { TiEyeOutline } from "react-icons/ti";
import axios from 'axios';
import { CiEdit } from "react-icons/ci";
import { AiOutlineCheckCircle, AiOutlineDelete } from "react-icons/ai";

const { Option } = Select;
const { Text } = Typography;

const Viewjob = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [candidateCounts, setCandidateCounts] = useState({});
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [editFields, setEditFields] = useState({
    position: '',
    department: '',
    jobLocation: '',
    experience: '',
    vacancies: '',
    postedBy: '',
    status: '',
    description: ''
  });

  const colors = {
    Active: 'green',
    Hold: '#00B4D2',
    Inactive: 'red',
  };

  useEffect(() => {
    const fetchCandidateCounts = async () => {
      try {
        const jobsResponse = await axios.get('http://localhost:5040/viewjobs');
        const jobs = jobsResponse.data;

        const counts = await Promise.all(
          jobs.map(async (job) => {
            const countResponse = await axios.get(`http://localhost:5040/candidates/position/${job.position}`);
            return { position: job.position, count: countResponse.data.count };
          })
        );

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
  }, []);

  const userColumns = [
    { name: 'Role', selector: (row) => row.position, sortable: true },
    { name: 'Department', selector: (row) => row.department, sortable: true },
    { name: 'Location', selector: (row) => row.jobLocation, sortable: true, width: '150px' },
    { name: 'HR Name', selector: (row) => row.postedBy, sortable: true, width: '150px' },
    // { name: 'Vacancies', selector: (row) => row.vacancies, sortable: true, width: '120px' },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      width: '100px',
      cell: (row) => (
        <div style={{
          backgroundColor: getStatusColor(row.status),
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          textAlign: 'center',
          alignItems: 'center',
        }}>
          {row.status}
        </div>
      ),
    },
    {
      name: 'Action',
      cell: (row) => (<>
        <Tooltip title="View Details" color='cyan'><button className='table-btn' name='View' onClick={() => handleRowButtonClick(row._id)}><TiEyeOutline /></button></Tooltip>
        <Tooltip title="Delete Job" color='cyan'><button className='table-btn' name='delete' onClick={() => showConfirmModal(row._id)}>
          <AiOutlineDelete />
        </button></Tooltip>
      </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
     
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
      const job = response.data;
      setSelectedJob(job);
      setEditFields({
        position: job.position,
        department: job.department,
        jobLocation: job.jobLocation,
        experience: job.experience,
        vacancies: job.vacancies,
        postedBy: job.postedBy,
        status: job.status,
        description: job.description
      });
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const showConfirmModal = (jobId) => {
    setJobToDelete(jobId);
    setIsConfirmModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5040/job-posts/${jobToDelete}`);
      if (response.status === 200) {
        const updatedJobs = jobs.filter((job) => job._id !== jobToDelete);
        setJobs(updatedJobs);
        setFilteredJobs(updatedJobs);
        message.success('Job deleted successfully!');
      } else {
        console.error('Job deletion failed:', response.data);
        message.error('Failed to delete job. Please check server logs for details.');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      message.error('An error occurred while deleting the job', error);
    } finally {
      setIsConfirmModalVisible(false);
      setJobToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmModalVisible(false);
    setJobToDelete(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedJob(null);
    setIsEditClicked(false);
    setSelectedStatus('');
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const updatedJob = {
        ...editFields,
        postedAt: new Date() // Set postedAt to the current date
      };
      await axios.put(`http://localhost:5040/job-posts/${selectedJob._id}`, updatedJob);

      const updatedJobs = jobs.map((job) => job._id === selectedJob._id ? updatedJob : job);
      setJobs(updatedJobs);
      setFilteredJobs(updatedJobs);

      setIsModalVisible(false);
      setIsEditClicked(false);
    } catch (error) {
      console.error('Error updating job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFields((prevFields) => ({
      ...prevFields,
      [name]: value
    }));
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
              <h2 style={{ fontWeight: 'bold', marginRight: 'auto', fontSize: '20px', color: '#00B4D2' }}>Job Title: {isEditClicked ? <Input name="position" value={editFields.position} onChange={handleInputChange} /> : selectedJob.position}</h2>
              <h1 style={{ fontWeight: 'bold', marginLeft: 'auto', color: colors[selectedJob.status] }}>{isEditClicked ? (
                <Select
                  style={{width:'50px'}}
                  key="status"
                  value={editFields.status}
                  onChange={(value) => setEditFields((prevFields) => ({ ...prevFields, status: value }))}
                  
                >
                  <Option value="Hold">Hold</Option>
                  <Option value="Active">Active</Option>
                  <Option value="Closed">Closed</Option>
                </Select>
              ) : selectedJob.status}</h1>
              {isEditClicked ? (
                <Tooltip title="Save Changes" color='green'>
                  <Button
                    type='text'
                    onClick={handleSaveChanges}
                  >
                    <AiOutlineCheckCircle style={{ color: 'green' }} />
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title="Edit Job" color='cyan'>
                  <Button
                    type='text'
                    onClick={() => setIsEditClicked(true)}
                  >
                    <CiEdit style={{ color: '#1a2763' }} />
                  </Button>
                </Tooltip>
              )}
            </div>
            {isEditClicked ? (
               <>
               <br/>
    <Row gutter={24} style={{ marginBottom: '16px' }}>
      <Col span={8} style={{ marginRight: '5px', width:'100px' }}> 
        <Input name="department" value={editFields.department} onChange={handleInputChange} placeholder="Department" />
      </Col>
      <Col span={8} style={{ marginLeft: '5px', width:'100px' }}>
        <Input name="jobLocation" value={editFields.jobLocation} onChange={handleInputChange} placeholder="Job Location" />
      </Col>
    </Row>
    <Row gutter={24} style={{ marginBottom: '16px' }}>
      <Col span={8}>
        <Input name="experience" value={editFields.experience} onChange={handleInputChange} placeholder="Experience" />
      </Col>
      <Col span={8}>
        <Input name="vacancies" value={editFields.vacancies} onChange={handleInputChange} placeholder="Vacancies" />
      </Col>
    </Row>
    <Col gutter={24}>
      <Col span={8}>
        <Input name="postedBy" value={editFields.postedBy} onChange={handleInputChange} placeholder="Posted By" />
      </Col>
      <br/>
      <Col span={8}>
        <Input.TextArea name="description" value={editFields.description} onChange={handleInputChange} placeholder="Description" />
      </Col>
    </Col>
  </>
            ) : (
              <>
                <p style={{ fontWeight: 'bold' }}>Department: {selectedJob.department}</p>
                <hr color='#00B4D2' />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text style={{ color: 'grey', marginRight: 'auto', background: '#FFF' }}><strong>Job Location:</strong> <br />{selectedJob.jobLocation}</Text>
                  <Text style={{ color: 'grey', marginLeft: 'auto', background: '#FFF' }}><strong>Experience:</strong><br />{selectedJob.experience}</Text>
                  <Text style={{ color: 'grey', marginLeft: 'auto', background: '#FFF' }}><strong>No. of Vacancies:</strong> <br /> {selectedJob.vacancies}</Text>
                </div>
                <div style={{ display: 'flex' }}>
                  <Text style={{ color: 'grey', marginRight: '140px', background: '#FFF' }}><strong>Posted By:</strong><br />{selectedJob.postedBy}</Text>
                  <Text style={{ color: 'grey', background: '#FFF' }}><strong>Posted At:</strong> <br />{new Date(selectedJob.postedAt).toLocaleDateString()}</Text>
                </div>
                <p style={{ fontWeight: 'bold', marginLeft: '10px' }}>Description</p>
                <p style={{ fontWeight: 'bold', marginLeft: '10px' }}>{selectedJob.description}</p>
              </>
            )}
          </>
        ) : (
          <p>No job details available</p>
        )}
      </Modal>
      <Modal
        title="Confirm Deletion"
        open={isConfirmModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this job?</p>
      </Modal>
    </div>
  );
};

export default Viewjob;
