import React, { useState, useEffect } from 'react';
import { Tooltip, Button, Input, Modal } from 'antd';
import { FiGrid } from "react-icons/fi";
import { FaTableList } from "react-icons/fa6";
import JobDashboard from '../components/JobDashboard';
import Viewjob from '../components/Viewjob';
import Postjob from '../components/Postjob';
import JobPositionPieChart from '../components/JobPosition';
import axios from 'axios';

const Dashboard = () => {
  const [view, setView] = useState('tile');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5040/viewjobs');
        setJobs(response.data.reverse());
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const toggleView = () => {
    setView(view === 'tile' ? 'table' : 'tile');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredJobs = jobs.filter(job => 
    job.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.jobLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='dashboard-container'>
      <div className='topContainer'>
        <Tooltip title="Post a Job" color='cyan'>
          <Button colorPrimary='cyan' onClick={showModal} type='primary' className='add-button' style={{ float: 'left' }}>Add New Job</Button>
        </Tooltip>
        
        {view === 'tile' && (
          <Input
            placeholder="Search jobs"
            value={searchQuery}
            onChange={handleSearch}
            className='ant-searchIn'
          />
        )}

        <div className='toggle-button'>
          <Button onClick={toggleView} type='text' icon={<FiGrid />} className={view === 'tile' ? 'active-button' : ''}>
            Tile View
          </Button> |
          <Button onClick={toggleView} type='text' icon={<FaTableList />} className={view === 'table' ? 'active-button' : ''}>
            Grid View
          </Button>
        </div>
      </div>
      <br />
      <div>
        {view === 'tile' ? (
          <JobDashboard jobs={filteredJobs} />
        ) : (
          <Viewjob jobs={filteredJobs} />
        )}
      </div>
     
      <div className='stat-repo'>
        <JobPositionPieChart />
      </div>
      
      <Modal 
        open={isModalVisible} 
        onCancel={closeModal} 
        footer={null} 
        title="Add New Job Posting"
        width={800}
      >
        <Postjob />
      </Modal>
    </div>
  );
};

export default Dashboard;
