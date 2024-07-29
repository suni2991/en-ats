import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Pagination, Button, Modal } from 'antd';
import axios from 'axios';
import moment from 'moment';
import '../styles/Explore.css';
import logo from "../Assests/enfuse-logo.png";
import Registration from "../components/Registration";

const Explore = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const jobsPerPage = 8;

  useEffect(() => {
    axios.get('http://localhost:5040/viewjobs')
      .then(response => {
        const sortedJobs = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setJobs(sortedJobs);
      })
      .catch(error => console.error('Error fetching jobs:', error));
  }, []);

  const showApplyModal = (job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setSelectedJob(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <div className="explore-page">
      <div className="header">
        <div className="quote">
          <h1>Welcome to Enfuse!</h1>
        </div>
        <div className="logo">
          <img src={logo} alt="Company Logo" />
        </div>
      </div>
      <h3>Join us to be part of a dynamic team where your ideas shape the future and your career thrives with limitless possibilities.</h3>
      <div className="content">
        <Row gutter={[16, 16]}>
          {currentJobs.map((job) => {
            const daysRemaining = moment(job.fulfilledBy).diff(moment(), 'days');
            const primarySkills = job.primarySkills.slice(0, 5).join(', ');

            return (
              <Col key={job._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  className="card-hover"
                  bordered={false}
                  style={{
                    borderRadius: '10px',
                    height: '220px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <h4 className="card-head">{job.position}</h4>
                  </div>
                  <div className="card-det">
                    <p>Location: {job.jobLocation}</p>
                    <p>Exp: {job.experience}+</p>
                  </div>
                  <p style={{ textAlign: 'left', padding: '0 5px',  color:'white' }}>Skills: {primarySkills}</p>
                  <p style={{ textAlign: 'left', padding: '0 5px',  color:'white' }}><strong>Closes in: </strong> {daysRemaining} days</p>
                  <div className="btn-wrapper">
                    
                    <Button 
                      type="default" 
                      style={{ color: 'white', background: 'transparent', marginTop:'15px' }}
                      onClick={() => showApplyModal(job)}
                    >
                      Apply Now
                    </Button>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
        <Pagination
          current={currentPage}
          pageSize={jobsPerPage}
          total={jobs.length}
          className="pagination-white"
          onChange={handlePageChange}
          style={{ textAlign: 'right', marginTop: '20px', color:'white'}}
        />
      </div>

      <Modal
        title={`Apply for ${selectedJob?.position}`}
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        className="glass-modal"
      >
        {selectedJob && <Registration closeModal={handleCancel} appliedPosition={selectedJob.position} />}
      </Modal>
    </div>
  );
};

export default Explore;
