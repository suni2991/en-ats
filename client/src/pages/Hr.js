import React, { useState } from 'react';
import { Tooltip, Button } from 'antd';
import { FiGrid } from "react-icons/fi";
import { FaTableList } from "react-icons/fa6";

import CustomModal from '../components/CustomModal';
import Postjob from '../components/Postjob';
import CandidateCard from '../components/CandidateCard';
import CandidateTable from '../components/CandidateTable';
import Registration from '../components/Registration';



const Hr = () => {
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
        <Tooltip title="Add Applicant" color='cyan'>
          <Button colorPrimary='cyan' onClick={showModal} type='primary' className='toggle-button' >Add New Candidate</Button>
        </Tooltip>
        
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
          <CandidateCard />
        ) : (
          <CandidateTable />
        )}
      </div>
      <div className='stat-repo'>
       
        <div className='buttons'>
          <button>Statistics</button>
          <button>Report</button>
        </div>
        
      </div>
      <CustomModal isVisible={isModalVisible} onClose={closeModal}>
        <Registration />
      </CustomModal>
    </div>
  );
};

export default Hr;
