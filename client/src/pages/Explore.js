import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Pagination, Button, Modal } from 'antd';
import axios from 'axios';
import moment from 'moment';
import '../styles/Explore.css';
import logo from "../Assests/enfuse-logo.png";
import Registration from "../components/Registration";
import { useNavigate } from 'react-router-dom';
import {useSpring, animated} from 'react-spring';

const Explore = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const jobsPerPage = 8;
  const navigate = useNavigate();

  const pageAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1500 }
  });

  const headingAnimation = useSpring({
    from: { opacity: 0, transform: 'translateX(-50px)' },
    to: { opacity: 1, transform: 'translateX(0px)' },
    config: { duration: 3000 },
  });

  const heading2Animation = useSpring({
    from: { opacity: 0, transform: 'translateY(100%)' },
  to: { opacity: 1, transform: 'translateY(0%)' },
  config: { duration: 2000 }
  })

  useEffect(() => {
    axios.get('http://localhost:5040/viewjobs')
      .then(response => {
        const activeJobs = response.data.filter(job => job.status === 'Active');
        const sortedJobs = activeJobs.reverse();
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

  const handleRedirect = () =>{
    navigate('/')
  }

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <animated.div style={pageAnimation} className="explore-page">
      <div className="header">
        <div className="quote">
          <animated.h1 style={headingAnimation}>Welcome to EnFuse!</animated.h1>
        </div>
        <animated.div style={heading2Animation} className="logo">
          <img src={logo} alt="Company Logo" />
        </animated.div>
      </div>
      <animated.h3 style={headingAnimation}>Join us to be part of a dynamic team where your ideas shape the future and your career thrives with limitless possibilities.</animated.h3>
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
        <div style={{display:'flex', justifyContent:'space-between'}}>
        <Button type="default" 
        style={{ color: '#00B4D2', background: 'white', marginTop:'25px', fontWeight:'bold' }}
        onClick={handleRedirect}>Back</Button>
        <Pagination
          current={currentPage}
          pageSize={jobsPerPage}
          total={jobs.length}
          className="pagination-white"
          onChange={handlePageChange}
          style={{ textAlign: 'right', marginTop: '20px', color:'white'}}
        />
      </div>
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
    </animated.div>
  );
};

export default Explore;
