import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Col, Row, Badge, Pagination } from 'antd';

const colors = {
  Active: 'green',
  Hold: '#00B4D2',
  Inactive: 'red',
};

const JobDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [candidateCounts, setCandidateCounts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 16; 

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5040/viewjobs');
        const jobs = response.data;
        setJobs(jobs);
        console.log('Fetched jobs:', jobs);

        const counts = await Promise.all(jobs.map(async (job) => {
          const countResponse = await axios.get(`http://localhost:5040/candidates/position/${job.position}`);
          console.log(`Count for ${job.position}:`, countResponse.data.count);
          return { position: job.position, count: countResponse.data.count };
        }));

        const countsObject = counts.reduce((acc, { position, count }) => {
          acc[position] = count;
          return acc;
        }, {});

        setCandidateCounts(countsObject);
        console.log('Candidate counts:', countsObject);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  const startIndex = (currentPage - 1) * pageSize;
  const currentJobs = jobs.slice(startIndex, startIndex + pageSize);

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {currentJobs.map((job) => (
          <Col key={job._id} xs={20} sm={12} md={8} lg={6}>
            <Badge 
              count={candidateCounts[job.position] !== undefined ? candidateCounts[job.position] : 0} 
              style={{ backgroundColor: candidateCounts[job.position] !== undefined ? colors[job.status] : 'transparent' }}
              showZero
            >
              <Card
                bordered={false}
                style={{ border: '#00B4D2', boxShadow: '0px 2px 4px rgb(38, 39, 130)' }}
              >
                <div className="card-title"><span>{job.position}</span></div>
                <hr />
                - {job.jobLocation}
                <p><strong>HR:</strong> HR</p>
                <p><strong>Department:</strong> {job.department}</p>
                <p><strong>Status:</strong> <span style={{ color: colors[job.status], fontWeight:'bold' }}>{job.status}</span></p>
              </Card>
            </Badge>
          </Col>
        ))}
      </Row>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={jobs.length}
        onChange={(page) => setCurrentPage(page)}
        style={{ textAlign: 'right', marginTop: '20px' }}
      />
    </div>
  );
};

export default JobDashboard;
