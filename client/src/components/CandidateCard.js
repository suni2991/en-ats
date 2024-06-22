import React, {useState} from 'react';
import { Card, Col, Row, Pagination } from 'antd';

const CandidateCard = ({ candidates }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 16;

  const startIndex = (currentPage - 1) * pageSize;
  const currentCandidates = candidates.slice(startIndex, startIndex + pageSize);

  return (
    <div style={{ padding: '30px 20px' }}>
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
              }}
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
        style={{ textAlign: 'right', marginTop: '20px' }}
      />
    </div>
  );
};

export default CandidateCard;
