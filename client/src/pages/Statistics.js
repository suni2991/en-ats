import React, { useState } from 'react';
import { Tooltip, Button } from 'antd';
import { FiGrid } from "react-icons/fi";
import { FaTableList } from "react-icons/fa6";
import JobDashboard from '../components/JobDashboard';
import Viewjob from '../components/Viewjob';
import CustomModal from '../components/CustomModal';
import Postjob from '../components/Postjob';
import SearchDept from '../components/SearchDept';
import JobPositionPieChart from '../components/JobPosition';


const Statistics = () => {
  const [view, setView] = useState('tile');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const toggleView = () => {
    setView(view === 'tile' ? 'table' : 'tile');
  };

  return (
    <div className='table-container'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tooltip title="Post a Job" color='cyan'>
          <Button colorPrimary='cyan' onClick={showModal} type='primary' className='toggle-button' >Add New Job</Button>
        </Tooltip>
        <SearchDept />
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
          <JobDashboard />
        ) : (
          <Viewjob />
        )}
      </div>
      <div className='stat-repo'>
        <div className='search-dept'>
          <SearchDept />
        </div>
        <div className='buttons'>
          <button>Statistics</button>
          <button>Report</button>
        </div>
        <JobPositionPieChart />
      </div>
      <CustomModal isVisible={isModalVisible} onClose={closeModal}>
        <Postjob />
      </CustomModal>
    </div>
  );
};

export default Statistics;
