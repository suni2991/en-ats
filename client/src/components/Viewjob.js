import React, { useState, useEffect } from "react";
import Fetchtable from "./Fetchtable";
import {
  Modal,
  Button,
  Spin,
  Tooltip,
  List,
  Select,
  message,
  Input,
  Row,
  Col,
  Drawer,
} from "antd";
import { TiEyeOutline } from "react-icons/ti";
import axios from "axios";
import moment from "moment";
import { CiEdit } from "react-icons/ci";
import { AiOutlineCheckCircle, AiOutlineDelete } from "react-icons/ai";
import useAuth from "../hooks/useAuth";

const { Option } = Select;
const { TextArea } = Input;

const URL = process.env.REACT_APP_API_URL;
const Viewjob = ({ auth }) => {
  const { token } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  const [editFields, setEditFields] = useState({
    position: "",
    department: "",
    jobLocation: "",
    experience: "",
    vacancies: "",
    postedBy: "",
    status: "",
    description: "",
    note: "",
  });

  const colors = {
    Active: "green",
    Hold: "#00B4D2",
    Closed: "red",
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${URL}/viewjobs`, {
          params: { mgrRole: auth.role, fullName: auth.fullName },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [auth.role, auth.fullName, token]);

  const userColumns = [
    { name: "Role", selector: (row) => row.position, sortable: true },
    { name: "Department", selector: (row) => row.department, sortable: true },
    {
      name: "Location",
      selector: (row) => row.jobLocation,
      sortable: true,
      width: "150px",
    },
    {
      name: "HR Name",
      selector: (row) => row.postedBy,
      sortable: true,
      width: "150px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      width: "100px",
      cell: (row) => (
        <div
          style={{
            backgroundColor: getStatusColor(row.status),
            color: "white",
            padding: "5px 10px",
            borderRadius: "5px",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          {row.status}
        </div>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Tooltip title="View Details" color="cyan">
            <button
              className="table-btn"
              name="View"
              onClick={() => handleRowButtonClick(row._id)}
            >
              <TiEyeOutline />
            </button>
          </Tooltip>
          <Tooltip title="Delete Job" color="cyan">
            <button
              className="table-btn"
              name="delete"
              onClick={() => showConfirmModal(row._id)}
            >
              <AiOutlineDelete />
            </button>
          </Tooltip>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "green";
      case "Hold":
        return "#00B4D2";
      case "Closed":
        return "red";
      default:
        return "black";
    }
  };

  const handleRowButtonClick = async (jobId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${URL}/job-posts/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const job = response.data;
      setSelectedJob(job);
      setEditFields({
        position: job.position,
        department: job.department,
        jobLocation: job.jobLocation,
        experience: job.experience,
        vacancies: job.vacancies,
        postedBy: job.postedBy,
        status: job.status,
        description: job.description,
        note: "", // Initialize note as an empty string
      });
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  };

  const showConfirmModal = (jobId) => {
    setJobToDelete(jobId);
    setIsConfirmModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${URL}/job-posts/${jobToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const updatedJobs = jobs.filter((job) => job._id !== jobToDelete);
        setJobs(updatedJobs);
        setFilteredJobs(updatedJobs);
        message.success("Job deleted successfully!");
      } else {
        message.error(
          "Failed to delete job. Please check server logs for details."
        );
      }
    } catch (error) {
      message.error("An error occurred while deleting the job", error);
    } finally {
      setIsConfirmModalVisible(false);
      setJobToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmModalVisible(false);
    setJobToDelete(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedJob(null);
    setIsEditClicked(false);
    setSelectedStatus("");
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const updatedJob = {
        ...editFields,
        updatedAt: new Date(), // Set updatedAt to the current date
      };
      await axios.put(
        `${URL}/job-posts/${selectedJob._id}`,
        updatedJob,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedJobs = jobs.map((job) =>
        job._id === selectedJob._id ? updatedJob : job
      );
      setJobs(updatedJobs);
      setFilteredJobs(updatedJobs);

      setIsModalVisible(false);
      setIsEditClicked(false);
    } catch (error) {
      console.error("Error updating job details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleHistoryClick = (job) => {
    if (job.history) {
      const sortedHistory = job.history.reverse();
      setHistoryData(sortedHistory);
    } else {
      setHistoryData([]);
    }
    setIsDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerVisible(false);
  };

  return (
    <div>
      <Fetchtable
        url={`${URL}/viewjobs`}
        columns={userColumns}
        filteredData={filteredJobs}
      />
      <Modal
        title="Details"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        {loading ? (
          <Spin />
        ) : selectedJob ? (
          <>
            <div
              style={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <h2
                style={{
                  fontWeight: "bold",
                  marginRight: "auto",
                  fontSize: "20px",
                  color: "#00B4D2",
                }}
              >
                Job Title:{" "}
                {isEditClicked ? (
                  <Input
                    name="position"
                    value={editFields.position}
                    onChange={handleInputChange}
                  />
                ) : (
                  selectedJob.position
                )}
              </h2>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  style={{ marginRight: "10px" }}
                  onClick={() => handleHistoryClick(selectedJob)}
                >
                  History
                </Button>
                <h1
                  style={{
                    fontWeight: "bold",
                    color: colors[selectedJob.status],
                    width: "100px",
                    margin: 0,
                  }}
                >
                  {isEditClicked ? (
                    <Select
                      style={{ width: "100px" }}
                      key="status"
                      value={editFields.status}
                      onChange={(value) =>
                        setEditFields((prevFields) => ({
                          ...prevFields,
                          status: value,
                        }))
                      }
                    >
                      <Option value="Hold">Hold</Option>
                      <Option value="Active">Active</Option>
                      <Option value="Closed">Closed</Option>
                    </Select>
                  ) : (
                    selectedJob.status
                  )}
                </h1>
                <Tooltip title="Edit" color="cyan">
                  <button
                    className="table-btn"
                    name="edit"
                    onClick={() => setIsEditClicked(true)}
                  >
                    <CiEdit />
                  </button>
                </Tooltip>
                {isEditClicked && (
                  <Tooltip title="Save" color="cyan">
                    <button
                      className="table-btn"
                      name="save"
                      onClick={handleSaveChanges}
                    >
                      <AiOutlineCheckCircle />
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>
            <Row gutter={16} style={{ marginTop: "30px" }}>
              <Col span={24}>
                <Row gutter={16}>
                  <Col span={8}>
                    <div>
                      <h3
                        style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          margin: "5px 0",
                        }}
                      >
                        Department:
                      </h3>
                      <p>
                        {isEditClicked ? (
                          <Input
                            name="department"
                            value={editFields.department}
                            onChange={handleInputChange}
                          />
                        ) : (
                          selectedJob.department
                        )}
                      </p>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div>
                      <h3
                        style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          margin: "5px 0",
                        }}
                      >
                        Location:
                      </h3>
                      <p>
                        {isEditClicked ? (
                          <Input
                            name="jobLocation"
                            value={editFields.jobLocation}
                            onChange={handleInputChange}
                          />
                        ) : (
                          selectedJob.jobLocation
                        )}
                      </p>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div>
                      <h3
                        style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          margin: "5px 0",
                        }}
                      >
                        Experience:
                      </h3>
                      <p>
                        {isEditClicked ? (
                          <Input
                            name="experience"
                            value={editFields.experience}
                            onChange={handleInputChange}
                          />
                        ) : (
                          selectedJob.experience
                        )}
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={8}>
                    <div>
                      <h3
                        style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          margin: "5px 0",
                        }}
                      >
                        Vacancies:
                      </h3>
                      <p>
                        {isEditClicked ? (
                          <Input
                            name="vacancies"
                            value={editFields.vacancies}
                            onChange={handleInputChange}
                          />
                        ) : (
                          selectedJob.vacancies
                        )}
                      </p>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div>
                      <h3
                        style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          margin: "5px 0",
                        }}
                      >
                        Posted By:
                      </h3>
                      <p>
                        {isEditClicked ? (
                          <Input
                            name="postedBy"
                            value={editFields.postedBy}
                            onChange={handleInputChange}
                          />
                        ) : (
                          selectedJob.postedBy
                        )}
                      </p>
                    </div>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={24}>
                    <div>
                      <h3
                        style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          margin: "5px 0",
                        }}
                      >
                        Description:
                      </h3>
                      <p>
                        {isEditClicked ? (
                          <TextArea
                            name="description"
                            value={editFields.description}
                            onChange={handleInputChange}
                          />
                        ) : (
                          selectedJob.description
                        )}
                      </p>
                    </div>
                  </Col>
                </Row>
                {isEditClicked && (
                  <Row gutter={16}>
                    <Col span={24}>
                      <div>
                        <h3
                          style={{
                            fontWeight: "bold",
                            fontSize: "16px",
                            margin: "5px 0",
                            color: "red",
                          }}
                        >
                          Reason For This Update:
                        </h3>
                        <TextArea
                          name="note"
                          value={editFields.note}
                          placeHolder="Please mention reason for update & what is updated"
                          onChange={handleInputChange}
                        />
                      </div>
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
          </>
        ) : (
          <p>No job selected</p>
        )}
      </Modal>
      <Modal
        title="Confirm Delete"
        open={isConfirmModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        <p>Are you sure you want to delete this job?</p>
      </Modal>
      <Drawer
        title="History Data"
        placement="left"
        closable={true}
        onClose={handleDrawerClose}
        open={isDrawerVisible}
        width={400}
      >
        {historyData.length > 0 ? (
          <List
            dataSource={historyData}
            renderItem={(item, index) => (
              <List.Item key={index}>
                <List.Item.Meta
                  title={`Date: ${moment(item.date).format(
                    "DD MMMM YYYY, HH:mm"
                  )}`}
                  description={
                    <>
                      <p>Comments: {item.note}</p>
                      <p>Updated By: {item.updatedBy}</p>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <p>No history available</p>
        )}
      </Drawer>
    </div>
  );
};

export default Viewjob;
