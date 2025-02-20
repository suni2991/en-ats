import React, { useState, useEffect } from "react";
import { Collapse, Button, Row, Col, Modal, Pagination } from "antd";
import axios from "axios";
import "../styles/Explore.css";
import Registration from "../components/Registration";
import { useNavigate } from "react-router-dom";
import logo from "../Assests/enfuse-logo.png";

const { Panel } = Collapse;

const Explore = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const jobsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5041/viewjobs")
      .then((response) => {
        const activeJobs = response.data.filter(
          (job) => job.status === "Active"
        );
        setJobs(activeJobs.reverse());
      })
      .catch((error) => console.error("Error fetching jobs:", error));
  }, []);

  const showApplyModal = (job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setSelectedJob(null);
  };

  return (
    <div className="explore-page">
      <div>

      <img src={logo} alt="Company Logo" /> <p>Explore jobs from EnFuse</p>
      </div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Collapse
            accordion
            bordered={false}
            style={{ background: "transparent" }}
          >
            {jobs
              .slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage)
              .map((job) => (
                <Panel
                  key={job._id}
                  showArrow={false}
                  header={
                    <div className="job-panel-header">
                      <div className="job-detail">
                        <span className="job-panel-title">Position</span>
                        <div className="job-position">{job.position}</div>
                      </div>
                      <div className="job-location-container">
                        <span className="job-panel-title">Location</span>
                        <div className="job-location">{job.jobLocation}</div>
                      </div>
                      <Button
                        shape="circle"
                        icon="+"
                        className="expand-button"
                      />
                    </div>
                  }
                  style={{
                    borderRadius: "10px",
                    background: "#fff",
                    marginBottom: "5px",
                    padding: "5px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div style={{ padding: "10px" }}>
                    <p>
                      <span className="bold-text">Experience: </span>
                      {job.experience}+
                    </p>
                    <p>
                      <span className="bold-text">Skills: </span>
                      {Array.isArray(job.primarySkills)
                        ? job.primarySkills.join(",  ")
                        : typeof job.primarySkills === "string"
                        ? job.primarySkills
                        : "N/A"}
                    </p>
                    <p style={{ textAlign: 'justify' }}>
                    <span className="bold-text">Description: </span>
  {job.description.replace(/^Job description:\s*/, "")}
</p>

                    <Button
                      type="primary"
                      style={{
                        backgroundColor: "#00B4D2",
                        color: "white",
                        transition:
                          "transform 0.2s ease, background-color 0.2s ease",
                        height: "auto",
                        margin: "20px 10px", // Adjust height for centering
                        // padding: '8px 16px', // Button padding to look even
                      }}
                      onClick={() => showApplyModal(job)}
                    >
                      Apply Now
                    </Button>
                  </div>
                </Panel>
              ))}
          </Collapse>
        </Col>
      </Row>

      <Row>
        <Col span={24} style={{ textAlign: "center", marginTop: "20px" }}>
          <Pagination
            current={currentPage}
            pageSize={jobsPerPage}
            total={jobs.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </Col>
      </Row>

      <Modal
        title={`Apply for ${selectedJob?.position}`}
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        {selectedJob && (
          <Registration
            closeModal={handleCancel}
            appliedPosition={selectedJob.position}
          />
        )}
      </Modal>
    </div>
  );
};

export default Explore;
