import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Row, Badge, Pagination, Modal, Table, Tag } from "antd";
import CircularProgressCard from "./CircularProgressCard";
import useAuth from "../hooks/useAuth";
import moment from "moment";

const colors = {
  Active: "green",
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
const JobDashboard = ({ jobs }) => {
  const [candidateCounts, setCandidateCounts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const pageSize = 16;
  const { token } = useAuth();

  useEffect(() => {
    const fetchCandidateCounts = async () => {
      try {
        const response = await axios.get(`${URL}/positions`, {
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

  const showApplicants = async (position) => {
    try {
      const response = await axios.get(
        `${URL}/applicants/position/${position}`,
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

  const startIndex = (currentPage - 1) * pageSize;
  const currentJobs = jobs.slice(startIndex, startIndex + pageSize);

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Qualification",
      dataIndex: "qualification",
      key: "qualification",
    },
    {
      title: "Relevant Experience",
      dataIndex: "relevantExperience",
      key: "relevantExperience",
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

  return (
    <div className="fetch-cards">
      <Row gutter={[16, 16]}>

        {currentJobs.map((job) => {
          const daysRemaining = moment(job.fullfilledBy).diff(moment(), 'days');

          return (
            <Col key={job._id}>
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
                      {job.status === "Active" && (
                      <p>
                        <strong>Closed in:</strong> {daysRemaining} days
                      </p>)}
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
        total={jobs.length}
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
          style={{ textTransform: "capitalize" }}
          pagination={{ pageSize: 8 }}
        />
      </Modal>
    </div>
  );
};

export default JobDashboard;
