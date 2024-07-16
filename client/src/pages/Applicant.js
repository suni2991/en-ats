import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdOutlineDeleteOutline } from "react-icons/md";
import { TbEyeCheck } from "react-icons/tb";
import { List, Spin, Typography, Button, message, Pagination } from 'antd';
import CandidateProfileDrawer from '../components/CandidateProfileDrawer';
import EmailAllotModal from '../components/EmailAllotModal';
import Statistics from './Statistics';

const { Title } = Typography;

const Applicant = () => {
  const [candidates, setCandidates] = useState([]);
  const [onboardedCandidates, setOnboardedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [currentOnboardedPage, setCurrentOnboardedPage] = useState(1);
  const [onboardedPageSize, setOnboardedPageSize] = useState(6);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [emailModalVisible, setEmailModalVisible] = useState(false);

  useEffect(() => {
    fetchCandidates();
    fetchOnboardedCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get('http://localhost:5040/candidatesreport');
      setCandidates(response.data.reverse());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError('Failed to fetch candidates');
      setLoading(false);
    }
  };

  const fetchOnboardedCandidates = async () => {
    try {
      const response = await axios.get('http://localhost:5040/candidate/Onboarded');
      setOnboardedCandidates(response.data.reverse());
    } catch (error) {
      console.error('Error fetching onboarded candidates:', error);
      setError('Failed to fetch onboarded candidates');
    }
  };

  const deleteCandidate = async (id) => {
    try {
      await axios.delete(`http://localhost:5040/candidate/${id}`);
      message.success('Candidate deleted successfully');
      fetchCandidates();
      fetchOnboardedCandidates();
    } catch (error) {
      console.error('Error deleting candidate:', error);
      message.error('Failed to delete candidate');
    }
  };

  const allotEmail = async (candidateId, email) => {
    if (!email.toLowerCase().endsWith('@enfuse-solutions.com')) {
      message.error('Use @enfuse-solutions.com only');
      return;
    }

    try {
      // Prepare history update details
      const historyUpdate = {
        updatedBy: 'Admin',
        updatedAt: new Date(),
        note: 'Onboarded Applicant allotted Enfuse email successfully'
      };

      // Update candidate's email, status to 'Onboarded', and history
      const response = await axios.put(`http://localhost:5040/candidates/${candidateId}`, {
        email,
        status: 'Onboarded',
        historyUpdate
      });

      if (response.data.status === 'SUCCESS') {
        message.success('Email allotted successfully');
        fetchCandidates();
        fetchOnboardedCandidates();
      } else {
        message.error('Failed to allot email');
      }
    } catch (error) {
      console.error('Error allotting email:', error);
      message.error('Failed to allot email');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'HR':
        return '#4DC230';
      case 'L1':
        return 'Green';
      case 'L2':
        return '#1884E8';
      case 'Rejected':
        return 'red';
      case 'Processing':
        return '#00B4';
      case 'Selected':
        return '#00B4D2';
      default:
        return 'black';
    }
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleOnboardedPageChange = (page, pageSize) => {
    setCurrentOnboardedPage(page);
    setOnboardedPageSize(pageSize);
  };

  const handleViewCandidate = (candidateId) => {
    setSelectedCandidateId(candidateId);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedCandidateId(null);
  };

  const handleAllotEmail = (candidateId) => {
    setSelectedCandidateId(candidateId);
    setEmailModalVisible(true);
  };

  const handleEmailModalClose = () => {
    setEmailModalVisible(false);
    setSelectedCandidateId(null);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const capitalizeEachWord = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const paginatedCandidates = candidates.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const paginatedOnboardedCandidates = onboardedCandidates.slice((currentOnboardedPage - 1) * onboardedPageSize, currentOnboardedPage * onboardedPageSize);

  return (
    <div className='vh-page'>
      <Statistics />
      <div className='list-applicants'>
        <div className='title-container'>
          <Title level={5} className='fixed-title'>
            Total Applicants ({candidates.length})
          </Title>
        </div>
        <div className='list-container'>
          <List
            itemLayout="horizontal"
            dataSource={paginatedCandidates}
            renderItem={candidate => (
              <List.Item
                actions={[
                  <Button type="text" color='cyan' onClick={() => handleViewCandidate(candidate._id)}>
                    <TbEyeCheck size={20} color='#00B4D2' />
                  </Button>,
                  <Button type="text" danger onClick={() => deleteCandidate(candidate._id)}>
                    <MdOutlineDeleteOutline size={20} />
                  </Button>
                 
                  
                ]}
              >
                <List.Item.Meta
                  title={
                    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{candidate.fullName}</span>
                      <span style={{ textAlign: 'center' }}>{candidate.position}</span>
                      <span style={{ color: getStatusColor(candidate.status), textAlign: 'center', alignItems: 'center' }}>{candidate.status}</span>
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        </div>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={candidates.length}
          onChange={handlePageChange}
        />
      </div>
      <div className='list-onboarded'>
        <Title level={5} style={{ backgroundColor: '#00B4D2', fontWeight: 'bold', padding: '10px', color: '#FFFF' }}>
          Onboarded Applicants ({onboardedCandidates.length})
        </Title>
        <List
          itemLayout="horizontal"
          dataSource={paginatedOnboardedCandidates}
          renderItem={candidate => (
            <List.Item
              actions={[
                <Button type="text" color='cyan' onClick={() => handleViewCandidate(candidate._id)}>
                  <TbEyeCheck size={20} color='#00B4D2' />
                </Button>,
                !candidate.email?.toLowerCase().includes('@enfuse-solutions.com') && (
                  <Button type="text" style={{ backgroundColor: '#00B4D2', color: '#FFF' }} onClick={() => handleAllotEmail(candidate._id)}>
                    Allot Email
                  </Button>
                )
              ]}
            >
              <List.Item.Meta
                title={<span>{capitalizeEachWord(candidate.fullName)}</span>}
                description={candidate.email && candidate.email.toLowerCase().includes('@enfuse-solutions.com')
                  ? candidate.email
                  : 'Email not assigned yet'}
              />
            </List.Item>
          )}
        />
        <Pagination
          current={currentOnboardedPage}
          pageSize={onboardedPageSize}
          total={onboardedCandidates.length}
          onChange={handleOnboardedPageChange}
        />
      </div>
      <CandidateProfileDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        candidateId={selectedCandidateId}
      />
      <EmailAllotModal
        visible={emailModalVisible}
        onClose={handleEmailModalClose}
        onAllotEmail={allotEmail}
        candidateId={selectedCandidateId}
      />
    </div>
  );
};

export default Applicant
