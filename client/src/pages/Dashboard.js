import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, Table, Tooltip } from 'antd';
import { FiGrid } from 'react-icons/fi';
import { FaTableList } from 'react-icons/fa6';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import JobDashboard from '../components/JobDashboard';
import Viewjob from '../components/Viewjob';
import Postjob from '../components/Postjob';
import JobPositionPieChart from '../components/JobPosition';



const Dashboard = () => {
  const { auth } = useAuth();
  const [view, setView] = useState('tile');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingJobs, setPendingJobs] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log('Parameters for fetching jobs:', { mgrRole: auth.role, fullName: auth.fullName });
        const response = await axios.get('http://localhost:5040/viewjobs', {
          params: { mgrRole: auth.role, fullName: auth.fullName }
        });
        console.log('Fetched jobs:', response.data);
        setJobs(response.data.reverse());
      } catch (error) {
        console.error('Error fetching jobs:', error);
        
      }
    };

    if (auth.role && auth.fullName) {
      fetchJobs();
    }
  }, [auth.role, auth.fullName]);

  useEffect(() => {
    const fetchPendingJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5040/pendingjobs', {
          params: { mgrRole: auth.role, fullName: auth.fullName }
        });
        setPendingJobs(response.data.reverse());
      } catch (error) {
        console.error('Error fetching pending jobs:', error);
       
      }
    };

    fetchPendingJobs();
  }, [auth.role, auth.fullName]);

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

  const columns = [
    {
      title: 'Posted Date',
      dataIndex: 'postedAt',
      key: 'postedAt',
      render: date => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <div className='dashboard-container'>
      <div className='topContainer'>
        <Tooltip title="Post a Job" color='cyan'>
          <Button colorPrimary='cyan' onClick={showModal} type='text' className='add-button' style={{ float: 'left' }}>Add New Job</Button>
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
          </Button> 
          <span classname='btn-divider'>&nbsp; | &nbsp;</span>
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
          <Viewjob auth={auth}/>
        )}
      </div>

      {auth.role !== 'Ops-Manager' && (
        <div className='stat-repo-dashboard'>
          <JobPositionPieChart />
        </div>
      )}

      <div className='list-applicants'>
        <Table
          dataSource={pendingJobs}
          columns={columns}
          rowKey={record => record._id}
          title={() => <h1 style={{ marginBottom: '10px' }}>Jobs Sent for Approval</h1>}
        />
      </div>

      <Modal
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        title={<h2>Add New Job Posting</h2>}
        width={800}
      >
        <Postjob />
      </Modal>
    </div>
  );
};

export default Dashboard;
