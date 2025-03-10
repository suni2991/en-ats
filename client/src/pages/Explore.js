import React, { useState, useEffect } from "react";
import { Collapse, Button, Row, Col, Modal, Pagination } from "antd";
import axios from "axios";
import "../styles/Explore.css";
import Registration from "../components/Registration";
import { useNavigate } from "react-router-dom";
import { FaRegDotCircle } from "react-icons/fa";

const { Panel } = Collapse;

const Explore = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedPanel, setExpandedPanel] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const jobsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://52.44.231.112:5041/api/viewjobs")
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

  const handlePanelChange = (key) => {
    setExpandedPanel(key === expandedPanel ? null : key);
  };

  return (
    <div className="explore-page">
     
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Collapse
            accordion
            bordered={false}
            style={{ background: "transparent" }}
            activeKey={expandedPanel}
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
                        icon={<span className={`expand-icon ${expandedPanel === job._id ? 'expanded' : ''}`}>{expandedPanel === job._id ? "-" : "+"}</span>}
                        className="expand-button no-hover"
                        onClick={() => handlePanelChange(job._id)}
                      />
                    </div>
                  }
                  style={{
                    borderRadius: "10px",
                    background: "#fff",
                    marginBottom: "20px",
                    padding: "5px",
                   
                    boxShadow: "0 0 8px rgba(0, 0, 0, .17)",
                  }}
                >
                  <div style={{ padding: "10px 0px" }}>
                    <p>
                      <span className="bold-text">Years of Experience: </span>
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
                    <p style={{ textAlign: "justify" }}>
  <span className="bold-text">Description: </span>
  {job.description.includes("•") && !job.description.includes("Role:") && !job.description.includes("Location:") ? (
    job.description
      .replace(/^Job description:\s*/, "")
      .split(/[\r\n•]+/)
      .map((line, index) => (
        <React.Fragment key={index}>
          {line.trim() && (
            <span className="bullet-text">
              <FaRegDotCircle style={{ marginRight: "10px" , color:"#1560a5" }} />
              {line.trim()}
            </span>
          )}
          <br />
        </React.Fragment>
      ))
  ) : (
    <span>{job.description.replace(/^Job description:\s*/, "")}</span>
  )}
</p>
                    <Button
                      type="primary"
                      className="btn-apply"
                      
                      onClick={() => showApplyModal(job)}
                    >
                      APPLY NOW
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
        title={`Apply For A Position`}
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
