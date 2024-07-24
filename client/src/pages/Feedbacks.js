import React, { useState, useEffect } from "react";
import Fetchtable from "../components/Fetchtable";
import useAuth from "../hooks/useAuth";
import { Tooltip, DatePicker, Form, Button, Modal, Select } from "antd";
import axios from "axios";
import { MdUpdate } from "react-icons/md";
import { VscFeedback } from "react-icons/vsc";
import Panelist from "../components/Panelist";

const { Option } = Select;

const URL = process.env.REACT_APP_API_URL;
const Feedback = () => {
  const { auth, token } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isJoiningDateModalVisible, setIsJoiningDateModalVisible] =
    useState(false);
  const [joiningDate, setJoiningDate] = useState(null);
  const [status, setStatus] = useState("");
  const [candidateData, setCandidateData] = useState([]);
  const [historyUpdate, setHistoryUpdate] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const panelistResponse = await axios.get(
          `${URL}/panelist/${auth.fullName}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCandidateData(panelistResponse.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, [auth.fullName, token]);

  const userColumns = [
    { name: "Name", selector: (row) => row.fullName, sortable: true },
    { name: "Position", selector: (row) => row.position, sortable: true },
    { name: "Resume", cell: (row) => renderResumeLink(row), sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <Tooltip title="Give Feedback" color="cyan">
            <button className="table-btn" onClick={() => showModal(row)}>
              <VscFeedback />
            </button>
          </Tooltip>
          {auth.role === "HR" && (
            <Tooltip title="Update" color="cyan">
              <button
                className="table-btn"
                onClick={() => showJoiningDateModal(row)}
              >
                <MdUpdate />
              </button>
            </Tooltip>
          )}
        </div>
      ),
      width: "150px",
    },
  ];

  const renderResumeLink = (row) => {
    if (row.resume) {
      const downloadLink = `${URL}${row.resume}`;
      return (
        <a
          href={downloadLink}
          target="_blank"
          rel="noopener noreferrer"
          className="resume-link"
        >
          {row.fullName} CV
        </a>
      );
    } else {
      return "Resume not available";
    }
  };

  const showModal = (row) => {
    setSelectedCandidate(row);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedCandidate(null);
  };

  const showJoiningDateModal = (row) => {
    setSelectedCandidate(row);
    setIsJoiningDateModalVisible(true);
  };

  const closeJoiningDateModal = () => {
    setIsJoiningDateModalVisible(false);
    setSelectedCandidate(null);
    setJoiningDate(null);
    setStatus("");
  };

  const handleJoiningDateChange = (date) => {
    setJoiningDate(date);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleUpdate = async () => {
    if (selectedCandidate) {
      try {
        const updates = {};
        if (joiningDate) {
          updates.joiningDate = joiningDate.toISOString();
        
        }
        if (status) {
          updates.status = status;
        
          // Prepare history update
          const historyUpdateData = {
            updatedAt: new Date(),
            updatedBy: auth.fullName,
            note: `Applicant ${status}`,
          };
          setHistoryUpdate(historyUpdateData);
         
          if (status === "Onboarded") {
            updates.role = "Enfusian";
            updates.dateCreated = new Date().toISOString(); // Set dateCreated to current date
            // console.log(
            //   "Role set to Enfusian and dateCreated set:",
            //   updates.dateCreated
            // );
          } else {
            updates.role = "Applicant";
          }
        }
        // console.log("Updates being sent:", updates);

        await axios.put(
          `${URL}/candidates/${selectedCandidate._id}`,
          { ...updates, historyUpdate },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Update successful");
        closeJoiningDateModal();
      } catch (error) {
        console.error("Failed to update", error);
      }
    }
  };

  return (
    <div className="vh-page" style={{ textTransform: "capitalize" }}>
      <Fetchtable
        url={`${URL}/panelist/${auth.fullName}`}
        data={candidateData}
        columns={userColumns}
      />
      <Modal
        open={isModalVisible}
        onCancel={closeModal}
        width={700}
        footer={null}
      >
        {selectedCandidate && (
          <Panelist candidateData={selectedCandidate} auth={auth} />
        )}
      </Modal>
      <Modal
        title="Update Status / Joining Date"
        open={isJoiningDateModalVisible}
        onCancel={closeJoiningDateModal}
        footer={null}
      >
        <Form layout="vertical">
          <Form.Item label="Status">
            <Select onChange={handleStatusChange} placeholder="Choose Status">
              <Option value="Selected">Selected</Option>
              <Option value="Onboarded">Onboarded</Option>
              <Option value="Rejected">Rejected</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Joining Date">
            <DatePicker
              onChange={handleJoiningDateChange}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
        <center>
          <Button
            type="primary"
            className="add-button"
            style={{ backgroundColor: "#A50707" }}
            onClick={handleUpdate}
          >
            Update
          </Button>
        </center>
      </Modal>
    </div>
  );
};

export default Feedback;
