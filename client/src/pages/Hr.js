import React, { useState, useEffect } from 'react';
import { Tooltip, Button, Input, Modal } from 'antd';
import { FiGrid } from "react-icons/fi";
import { FaTableList } from "react-icons/fa6";
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import CandidateCard from '../components/CandidateCard';
import CandidateTable from '../components/CandidateTable';
import Registration from '../components/Registration';
import Hotpicks from '../components/Hotpicks';

const Hr = () => {
  const [view, setView] = useState('tile');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const {auth} = useAuth();
  const [candidates, setCandidates] = useState([]);

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

  const filteredCandidates = candidates.filter(candidate =>
    candidate.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='table-container'>
      <div className='topContainer'>
        <Tooltip title="Add Applicant" color='cyan'>
          <Button onClick={showModal} type='text' className='add-button'>Add New Candidate</Button>
        </Tooltip>
        {view === 'tile' && (
          <Input
            placeholder="Search Candidates"
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
          <CandidateCard candidates={filteredCandidates} />
        ) : (
          <CandidateTable auth={auth}/>
        )}
      </div>
      <div>
        <div>
       
        
        <Hotpicks />
        </div>
      </div>
      <Modal open={isModalVisible} onCancel={closeModal} footer={null} width={800} title={<h2>Add New Applicant</h2>}>
        <Registration closeModal={closeModal} />
      </Modal>
    </div>
  );
};

export default Hr;
