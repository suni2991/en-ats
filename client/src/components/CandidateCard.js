import React, { useEffect, useState } from 'react';

import { Card, Col, Row, Pagination } from 'antd';

const CandidateCard = () => {
  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 16;

  useEffect(() => {
    const getCandidates = async () => {
      try {
        const response = await fetch(`http://localhost:5040/candidatesreport`);
        const data = await response.json();
        if (data && data.length > 0) {
          data.forEach((item) => {
            item.psychometric = item.psychometric === -1 ? 0 : item.psychometric;
            item.quantitative = item.quantitative === -1 ? 0 : item.quantitative;
            item.vocabulary = item.vocabulary === -1 ? 0 : item.vocabulary;
            item.java = item.java === -1 ? 0 : item.java;
            item.accounts = item.accounts === -1 ? 0 : item.accounts;
            item.excel = item.excel === -1 ? 0 : item.excel;
          });
        }
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCandidates(data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    getCandidates();
  }, []);

  const startIndex = (currentPage - 1) * pageSize;
  const currentCandidates = candidates.slice(startIndex, startIndex + pageSize);

  return (
    <div style={{ padding: '30px 20px' }}>
      <Row gutter={[16, 16]}>
        {currentCandidates.map((candidate) => (
          <Col key={candidate._id} xs={20} sm={12} md={8} lg={6}>
            <Card
              bordered={false}
              style={{
                border: '#00B4D2',
                boxShadow: '0px 2px 4px rgb(38, 39, 130)',
                backgroundColor: '#eceff1',
                height: '180px', // Fixed height
                width: '100%', // Make sure it occupies full width of the column
                textAlign: 'center',
              }}
            >
              <div style={{ fontWeight: 'bold', color: 'red', fontSize: '18px' }}>
                {candidate.fullName}
              </div>
              <p>{candidate.position}</p>
              <p>{candidate.relevantExperience} Years</p>
              <p>{candidate.currentLocation}</p>
              <p><strong>LWD:</strong> date</p>
              <p><strong>Status:</strong> <span style={{ color: 'blue', fontWeight: 'bold' }}>{candidate.status}</span></p>
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={candidates.length}
        onChange={(page) => setCurrentPage(page)}
        style={{ textAlign: 'right', marginTop: '20px' }}
      />
    </div>
  );
};

export default CandidateCard;
