import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Pagination } from 'antd';
import CandidateProfileDrawer from './CandidateProfileDrawer'; // Adjust the import path as necessary
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const URL = process.env.REACT_APP_API_URL;

const CandidateCard = ({ candidates }) => {

  const {token} = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState({});

  const pageSize = 16;

  const startIndex = (currentPage - 1) * pageSize;
  const currentCandidates = candidates.slice(startIndex, startIndex + pageSize);

  // useEffect(() => {}, [selectedCandidate])
  

  const openDrawer = async (candidateId) => {
    setSelectedCandidateId(candidateId);
    console.log(candidateId);
    // console.log('token', token);
    const candidteUniqueId = candidateId;
    
    const candidateData = await axios.get(`${URL}/api/getCandidateById/${candidteUniqueId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (candidateData) {
      console.log('candidateData: ',candidateData.data);
      const candidate = candidateData.data;
      setSelectedCandidate(candidate);
    }
    setDrawerVisible(true);
  };

  const onUpdateStatus = (candidateId, status) => { 
    const currentCandidate = currentCandidates.find(candidate => candidate._id === candidateId );
    currentCandidate.status = status;

    setSelectedCandidate(prevData =>({
      ...prevData,
      status: status
    }));
  }

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedCandidateId(null);
  };

  return (
    <div className='fetch-cards'>
      <Row gutter={[16, 16]}>
        {currentCandidates.map((candidate) => (
          <Col key={candidate._id} xs={20} sm={12} md={8} lg={6}>
            <Card
              className="card-hover"
              bordered={false}
              style={{
                borderRadius: '1px',
                boxShadow: '0px 2px 4px rgb(38, 39, 130)',
                backgroundColor: '#FFFF',
                height: '180px',
                width: '100%',
                textAlign: 'center',
                cursor: 'pointer',
              }}
              onClick={() => openDrawer(candidate._id)}
            >
              <div style={{ fontWeight: 'bold', color: '#00B4D2', fontSize: '18px', textTransform: 'capitalize' }}>
                {candidate.fullName}
              </div>
              <p>{candidate.position}</p>
              <p>{candidate.relevantExperience} Years</p>
              <p>{candidate.currentLocation}</p>
              {/* <p><strong>LWD:</strong> {new Date(candidate.lwd).toLocaleDateString()}</p> */}
              <p><strong>LWD:</strong> {candidate.lwd ? new Date(candidate.lwd).toLocaleDateString() : " Not Updated "}</p>

              <p><strong>Status:</strong> <span style={{ fontWeight: 'bold' }} >{candidate.status}</span></p>
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={candidates.length}
        onChange={(page) => setCurrentPage(page)}
        style={{
          textAlign: "right",
          marginTop: "20px",
          paddingTop: '10px',
          background: "#fff",
          maxWidth: "100%",
          height: "50px",
          boxShadow: '0px 1px 2px rgb(38, 39, 130)',
        }}
      />
      <CandidateProfileDrawer
        open={drawerVisible}
        onClose={closeDrawer}
        candidateId={selectedCandidateId}
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  );
};

export default CandidateCard;
