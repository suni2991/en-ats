import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Col, Row, Badge, Pagination, Modal, Table, Tag } from 'antd';

const colors = {
  Active: 'green',
  Hold: '#00B4D2',
  Inactive: 'red',
};

const statusColors = {
  Selected: 'green',
  L1: 'yellow',
  L2: 'blue',
  Rejected: 'red',
  HR: 'skyblue',
  Processing: 'purple'
};

const JobDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [candidateCounts, setCandidateCounts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const pageSize = 16;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5040/viewjobs');
        const jobs = response.data;
        setJobs(jobs);

        const counts = await Promise.all(jobs.map(async (job) => {
          const countResponse = await axios.get(`http://localhost:5040/candidates/position/${job.position}`);
          return { position: job.position, count: countResponse.data.count };
        }));

        const countsObject = counts.reduce((acc, { position, count }) => {
          acc[position] = count;
          return acc;
        }, {});

        setCandidateCounts(countsObject);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  const showApplicants = async (position) => {
    try {
      const response = await axios.get(`http://localhost:5040/applicants/position/${position}`);
      setApplicants(response.data);
      setSelectedJob(position);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentJobs = jobs.slice(startIndex, startIndex + pageSize);

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
   
    {
      title: 'Qualification',
      dataIndex: 'qualification',
      key: 'qualification',
    },
   
    {
      title: 'Relevant Experience',
      dataIndex: 'relevantExperience',
      key: 'relevantExperience',
    },
    {
      title: 'Notice Period',
      dataIndex: 'noticePeriod',
      key: 'noticePeriod',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status] || 'gray'}>{status}</Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {currentJobs.map((job) => (
          <Col key={job._id} xs={20} sm={12} md={8} lg={6}>
            <Badge
              count={candidateCounts[job.position] !== undefined ? candidateCounts[job.position] : 0}
              style={{ backgroundColor: 'green' }}
              showZero
            >
              <Card
                bordered={false}
                style={{ border: '#00B4D2', boxShadow: '0px 2px 4px rgb(38, 39, 130)', 
                  backgroundColor: '#eceff1',
                  height: '180px', // Fixed height
                  width: '100%'}} // Make sure it occupies full width of the column }}
                onClick={() => showApplicants(job.position)}
              >
                <div className="card-title"><span>{job.position}</span></div>
                <hr />
                - {job.jobLocation}
                <p><strong>HR:</strong> HR</p>
                <p><strong>Department:</strong> {job.department}</p>
                <p><strong>Status:</strong> <span style={{ color: colors[job.status], fontWeight: 'bold' }}>{job.status}</span></p>
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
      <Modal
        title={`Applicants for ${selectedJob}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={columns}
          dataSource={applicants}
          rowKey="_id"
          pagination={{ pageSize: 8 }}
        />
      </Modal>
    </div>
  );
};

export default JobDashboard;
