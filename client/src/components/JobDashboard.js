import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Row, Badge, Pagination, Modal, Table, Tag, message, Button } from "antd";
import CircularProgressCard from "./CircularProgressCard";
import { CopyOutlined } from '@ant-design/icons';
import useAuth from "../hooks/useAuth";
import moment from "moment";

const colors = {
  "REQ Approved": "green",
  Hold: "#00B4D2",
  Inactive: "red",
};

const statusColors = {
  Selected: "green",
  L1: "yellow",
  L2: "blue",
  Rejected: "red",
  HR: "skyblue",
  Processing: "purple",
};

const URL = process.env.REACT_APP_API_URL;
const JobDashboard = ({ jobs, selectedStatus }) => {
  const [candidateCounts, setCandidateCounts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const { token, auth } = useAuth();

  const pageSize = 16;

  useEffect(() => {
    const fetchJobsByStatus = async () => {
      try {
        const response = await axios.get(`${URL}/api/jobs`, {
          params: { status: selectedStatus },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let jobsData = response.data;
        if (auth.role === 'HiringManager') {
          jobsData = jobsData.filter(job => job.department === auth.department);
        }

        setFilteredJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs by status:", error);
      }
    };

    fetchJobsByStatus();
  }, [selectedStatus, token, auth.role, auth.department]);

  useEffect(() => {
    const fetchCandidateCounts = async () => {
      try {
        const response = await axios.get(`${URL}/api/positions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const countsObject = response.data.reduce((acc, job) => {
          acc[job.position] = job.registeredCandidates;
          return acc;
        }, {});

        setCandidateCounts(countsObject);
      } catch (error) {
        console.error("Error fetching candidate counts:", error);
      }
    };

    fetchCandidateCounts();
  }, [jobs, token]);

  const copyJobLink = (jobId) => {
    const jobURL = `${window.location.origin}/register-job/${jobId}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(jobURL).then(() => {
        message.success("Link copied to clipboard!");
      }).catch(err => {
        console.error('Failed to copy job URL: ', err);
      });
    } else {
      // Fallback method
      const textArea = document.createElement('textarea');
      textArea.value = jobURL;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const showApplicants = async (position) => {
    try {
      const response = await axios.get(
        `${URL}/api/applicants/position/${position}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setApplicants(response.data);
      setSelectedJob(position);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };

  const renderResumeLink = (row) => {
    if (row.resume) {
      let downloadLink = `${URL}${row.resume}`;
      if (row.resume.includes("google.com")) {
        downloadLink = row.resume;
      }
  
      return (
        <a href={downloadLink} target="_blank" rel="noopener noreferrer" className='resume-link'>
          {row.firstName} CV
        </a>
      );
    } else {
      return "Resume not available";
    }
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + pageSize);

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
   
    {
      title: "Resume/CV",
      key: "resume",
      render: (text, record) => renderResumeLink(record),
    },
   
    {
      title: "Notice Period",
      dataIndex: "noticePeriod",
      key: "noticePeriod",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          style={{ width: "100%", textAlign: "center" }}
          color={statusColors[status] || "gray"}
        >
          {status}
        </Tag>
      ),
    },
  ];


  if (auth.role === "HiringManager") {
    columns.push({
      title: "Action on CV",
      key: "edit",
      render: (text, record) => (
        <span className="actions-cv-buttons">
          <Button
            type="link"
            onClick={() => handleShortlist(record._id)}
          >
            Shortlist
          </Button>
          <Button
            type="link"
            onClick={() => handleReject(record._id)}
          >
            Reject
          </Button>
        </span>
      ),
    });
  }

  const handleShortlist = async (id) => {
    try {
      const response = await axios.put(`${URL}/api/candidate/${id}`, { status: "CV Shortlisted" }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === "SUCCESS") {
        message.success("CV Shortlisted successfully!");
        // Optionally, refresh the applicants list or update the UI
      } else {
        message.error("Failed to shortlist CV.");
      }
    } catch (error) {
      console.error("Error shortlisting CV:", error);
      message.error("An error occurred while shortlisting the CV.");
    }
  };
  
  const handleReject = async (id) => {
    try {
      const response = await axios.put(`${URL}/api/candidate/${id}`, { status: "CV Rejected" }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === "SUCCESS") {
        message.success("CV Rejected successfully!");
        // Optionally, refresh the applicants list or update the UI
      } else {
        message.error("Failed to reject CV.");
      }
    } catch (error) {
      console.error("Error rejecting CV:", error);
      message.error("An error occurred while rejecting the CV.");
    }
  };
  
  return (
    <div>
      <Row gutter={[16, 16]}>
        {currentJobs.map((job) => {
          const daysRemaining = moment(job.fullfilledBy).diff(moment(), 'days');

          return (
            <Col key={job._id} xs={20} sm={12} md={8} lg={6}>
              <Badge
                count={
                  candidateCounts[job.position] !== undefined
                    ? candidateCounts[job.position]
                    : 0
                }
                style={{ backgroundColor: "#1DAB4D" }}
                showZero
              >
                <div className="card-container">
                  <div className="card-flip">
                    <Card
                      className="card-front"
                      bordered={false}
                      style={{
                        margin: "0 auto",
                        backgroundColor: "#FFFF",
                        height: "180px",
                        width: "230px",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                      onClick={() => showApplicants(job.position)}
                    >
                      <div className="card-title" style={{ cursor: "pointer" }}>
                        <span
                          style={{
                            fontWeight: "bold",
                            textDecoration: "underline",
                            color: "#00B4D2",
                          }}
                          onClick={() => showApplicants(job.position)}
                        >
                          {job.position}
                        </span>
                      </div>
                      <p>
                        <strong>Location:</strong> {job.jobLocation}
                      </p>
                      <p>
                        <strong>HR:</strong> {job.postedBy}
                      </p>
                      <p>
                        <strong>Dept:</strong> {job.department}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          style={{
                            color: colors[job.status],
                            fontWeight: "bold",
                          }}
                        >
                          {job.status}
                        </span>
                      </p>
                      {job.status === "REQ Approved" && job.fullfilledBy !== null && (
                        <p>
                          <strong>Closes in:</strong> {daysRemaining} days
                        </p>
                      )}
                    </Card>
                    <Card
                      className="card-back"
                      onClick={() => showApplicants(job.position)}
                      bordered={false}
                      style={{
                        backgroundColor: "#FFFF",
                        display: "inline-block",
                        position: "relative",
                      }}
                    >
                      <CircularProgressCard
                        job={job}
                        onboardedCount={candidateCounts[job.position] || 0}
                      />
                    </Card>
                  </div>
                </div>
              </Badge>
            </Col>
          );
        })}
      </Row>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={filteredJobs.length}
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
      <Modal
        title={null}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <h2 style={{ margin: 0, paddingTop: 0 }}>Applicants for {selectedJob}</h2>
          </Col>
          <Col>
            <Button
              icon={<CopyOutlined />}
              onClick={() => copyJobLink(selectedJob)}
              style={{
                backgroundColor: "#00B4D2",
                color: "white",
                transition: "transform 0.2s ease, background-color 0.2s ease",
                height: 'auto',
                margin: '20px 10px',
              }}
            >
              Copy Job Registration Link
            </Button>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={applicants}
          rowKey="_id"
          style={{ textTransform: "capitalize" }}
          pagination={{ pageSize: 8 }}
        />
      </Modal>
    </div>
  );
};

export default JobDashboard;

