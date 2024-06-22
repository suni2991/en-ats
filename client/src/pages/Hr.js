import React, { useState, useEffect } from 'react';
import { Tooltip, Button, Input } from 'antd';
import { FiGrid } from "react-icons/fi";
import { FaTableList } from "react-icons/fa6";
import axios from 'axios';
import CustomModal from '../components/CustomModal';

import CandidateCard from '../components/CandidateCard';
import CandidateTable from '../components/CandidateTable';
import Registration from '../components/Registration';
import Hotpicks from '../components/Hotpicks';

const Hr = () => {
  const [view, setView] = useState('tile');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [candidates, setCandidates] = useState([]);
  
  const showModal = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5040/candidatesreport');
        setCandidates(response.data.reverse());
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, []);

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const toggleView = () => {
    setView(view === 'tile' ? 'table' : 'tile');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCandidates = candidates.filter(candidate => 
    candidate.fullName.toLowerCase().includes(searchQuery.toLowerCase()) 
   
  );

  return (
    <div className='table-container'>
      <div className='topContainer'>
        <Tooltip title="Add Applicant" color='cyan'>
          <Button colorPrimary='cyan' onClick={showModal} type='primary' className='add-button' >Add New Candidate</Button>
        </Tooltip>
        <Input
          placeholder="Search Candidates"
          value={searchQuery}
          onChange={handleSearch}
          className='ant-searchIn'
        />
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
          <CandidateCard candidates={filteredCandidates} />
        ) : (
          <CandidateTable />
        )}
      </div>
      <div>
      <div className='hotpicks'>
      <h1>Hot picks</h1>
      </div>
      
        <Hotpicks />
      </div>
      <CustomModal isVisible={isModalVisible} onClose={closeModal}>
        <Registration />
      </CustomModal>
    </div>
  );
};

export default Hr;
