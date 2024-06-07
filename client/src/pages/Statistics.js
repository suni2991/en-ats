import React, { useState } from 'react';
import { Tooltip, Button } from 'antd';
import { FiGrid } from "react-icons/fi";
import { FaTableList } from "react-icons/fa6";
import JobPositionPieChart from '../components/JobPosition';
import ApplicationStatus from '../components/ApplicationStatus';
import Viewjob from '../components/Viewjob';
import JobDashboard from '../components/JobDashboard';
import CustomModal from '../components/CustomModal';
import Postjob from '../components/Postjob';
import SearchDept from '../components/SearchDept';

const Statistics = () => {
  const [view, setView] = useState('tile');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const toggleView = () => {
    setView(view === 'tile' ? 'table' : 'tile');
  };

  return (
    <div className='table-container'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tooltip title="Post a Job" color='cyan'>
          <button onClick={showModal} className="submit-button">+ Job</button>
        </Tooltip>
        <SearchDept />
        <div className='toggle-button'>
          <Button onClick={toggleView} type='text' icon={<FaTableList />} className={view === 'table' ? 'active-button' : ''}>
            Table
          </Button>
          <Button onClick={toggleView} type='text' icon={<FiGrid />} className={view === 'tile' ? 'active-button' : ''}>
            Tile
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
   
      </div>
      <CustomModal isVisible={isModalVisible}>
        <Postjob />
      </CustomModal>
    </div>
  );
};

export default Statistics;
