import React, { useState } from 'react';
import { Card, Col, Row, Pagination } from 'antd';
import CandidateProfileDrawer from './CandidateProfileDrawer'; // Adjust the import path as necessary

const CandidateCard = ({ candidates }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const pageSize = 16;

  const startIndex = (currentPage - 1) * pageSize;
  const currentCandidates = candidates.slice(startIndex, startIndex + pageSize);

  const openDrawer = (candidateId) => {
    setSelectedCandidateId(candidateId);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedCandidateId(null);
  };

  return (
    <div className='fetch-cards'>
      <Row gutter={[16, 16]}>
        {currentCandidates.map((candidate) => (
          <Col key={candidate._id} >
            <Card
              className="card-hover"
              bordered={false}
              style={{
                borderRadius: '10px',
                boxShadow: '0px 2px 4px rgb(38, 39, 130)',
                backgroundColor: '#FFFFFF',
                height: '200px',
                width: '200px',
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
              <p><strong>LWD:</strong> {new Date(candidate.lwd).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <span style={{ fontWeight: 'bold' }}>{candidate.status}</span></p>
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
          // boxShadow: '0px 1px 2px rgb(38, 39, 130)',
        }}
      />
      <CandidateProfileDrawer
        open={drawerVisible}
        onClose={closeDrawer}
        candidateId={selectedCandidateId}
      />
    </div>
  );
};

export default CandidateCard;
