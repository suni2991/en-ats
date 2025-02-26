import React, { useState, useEffect } from "react";
import Fetchtable from "../components/Fetchtable";
import useAuth from "../hooks/useAuth";
import { Tooltip, DatePicker, Form, Button, Modal, Select, Input, message } from "antd";
import axios from "axios";
import { MdUpdate } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { VscFeedback } from "react-icons/vsc";
import moment from "moment";

const { Option } = Select;

const URL = process.env.REACT_APP_API_URL;

const Feedback = () => {
  const { auth, token } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isJoiningDateModalVisible, setIsJoiningDateModalVisible] = useState(false);
  const [joiningDate, setJoiningDate] = useState(null);
  const [status, setStatus] = useState("");
  const [candidateData, setCandidateData] = useState([]);
  const [historyUpdate, setHistoryUpdate] = useState(null);
  const [reloadData, setReloadData] = useState(false);
  const [documentationStatus, setDocumentationStatus] = useState("");
  const [reason, setReason] = useState("");

  const handleDocumentationStatusChange = (value) => setDocumentationStatus(value);

  const navigateTo = useNavigate();

  // Fetch candidates based on the role
  const fetchCandidates = async () => {
    try {
      const endpoint = auth.role === "Admin" ? `${URL}/api/panelist/HR` : `${URL}/api/panelist/${auth.fullName}`;
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCandidateData(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      message.error("Failed to fetch candidates.");
    }
  };

  // Fetch candidates on component load
  useEffect(() => {
    fetchCandidates();
  }, [auth.role, auth.fullName, token]);

  const handleUpdate = async () => {
    if (selectedCandidate) {
      try {
        const updates = {};
        if (joiningDate) updates.joiningDate = joiningDate.toISOString();
        const finalStatus = documentationStatus || status;
        if (finalStatus) {
          updates.status = finalStatus;
          setHistoryUpdate({
            status: finalStatus,
            updatedAt: new Date(),
            updatedBy: auth.fullName,
            note: `Applicant ${finalStatus}`,
          });
        }
        if (documentationStatus === "Candidate Declined / Backout" && reason) {
          updates.reason = reason;
        }
  
        // Update candidate data
        await axios.put(
          `${URL}/api/candidates/${selectedCandidate._id}`,
          { ...updates, historyUpdate },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Status updated successfully.");
        setReloadData(true);
        // Refresh the candidate data
        await fetchCandidates();
  
        // Send email notification
        // await axios.post(
        //   `${URL}/api/send-status`,
        //   {
        //     candidateName: selectedCandidate.fullName,
        //     statusUpdate: finalStatus,
        //   },
        //   { headers: { Authorization: `Bearer ${token}` } }
        // );
        // message.success("Email sent successfully.");
        closeJoiningDateModal();
      } catch (error) {
        console.error("Error updating status:", error);
        message.error("Failed to update status.");
        closeJoiningDateModal();
      }
    }
  };

  const renderResumeLink = (row) => {
    if (row.resume) {
      const downloadLink = `${URL}${row.resume}`;
      return (
        <a href={downloadLink} target="_blank" rel="noopener noreferrer" className="resume-link">
          {row.fullName} CV
        </a>
      );
    }
    return "Resume not available";
  };

  const provideFeedback = (row) => {
    setSelectedCandidate(row);
    const passCandidate = row;
    if (passCandidate) {
      navigateTo("/provideFeedback/" + auth._id, { state: { passCandidate: { ...passCandidate }, auth: { ...auth } } });
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
    setDocumentationStatus("");
    setReason("");
  };

  const handleJoiningDateChange = (date) => setJoiningDate(date);
  const handleStatusChange = (value) => setStatus(value);

  const disabledDate = (current) => {
    const today = moment();
    const maxDate = moment().add(30, "days");
    return current && (current < today.startOf("day") || current > maxDate.endOf("day"));
  };

  const userColumns = [
    { name: "Name", selector: (row) => row.fullName, sortable: true },
    { name: "Position", selector: (row) => row.position, sortable: true },
    { name: "Resume", cell: renderResumeLink, sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <div>
          {auth.role !== "Admin" && (
            <center>
              <Tooltip title="Give Feedback" color="cyan">
                <button className="table-btn" onClick={() => provideFeedback(row)}>
                  <VscFeedback />
                </button>
              </Tooltip>
            </center>
          )}
          {auth.role === "Admin" && (
            <center>
              <Tooltip title="Update" color="cyan">
                <button className="table-btn" onClick={() => showJoiningDateModal(row)}>
                  <MdUpdate />
                </button>
              </Tooltip>
            </center>
          )}
        </div>
      ),
      width: "150px",
    },
  ];

  return (
    <div className="vh-page" style={{ textTransform: "capitalize" }}>
      <Fetchtable
        url={auth.role === "Admin" ? `${URL}/api/panelist/HR` : `${URL}/api/panelist/${auth.fullName}`}
        data={auth.role === "Admin" ? candidateData.filter((c) => c.status === "HR Interview Cleared") : candidateData}
        columns={userColumns}
        reloadData={reloadData}
      />
      <Modal
        title="Update Status / Joining Date / Offered CTC"
        open={isJoiningDateModalVisible}
        onCancel={closeJoiningDateModal}
        footer={null}
      >
        <Form layout="vertical">
          <Form.Item label="Status">
            <Select onChange={handleStatusChange} placeholder="Choose Status">
              <Option value="Documentation">Documentation</Option>
              <Option value="Salary Negotiation">Salary Negotiation</Option>
              <Option value="Offer">Offer</Option>
              <Option value="Joining Status">Joining Status</Option>
            </Select>
          </Form.Item>
          {status === "Documentation" && (
            <Form.Item label="Documentation Status">
              <Select onChange={handleDocumentationStatusChange} placeholder="Choose Documentation Status">
                <Option value="Complete Documentation">Complete Documentation</Option>
                <Option value="Incomplete Documentation">Incomplete Documentation</Option>
                <Option value="Documentation on Hold">Documentation on Hold</Option>
                <Option value="Requested for Documentation">Requested for Documentation</Option>
              </Select>
            </Form.Item>
          )}
          {status === "Salary Negotiation" && (
            <Form.Item label="Salary Negotiation Status">
              <Select onChange={handleDocumentationStatusChange} placeholder="Choose Status">
                <Option value="Approved">Approved</Option>
                <Option value="Rejected">Rejected</Option>
                <Option value="On Hold">On Hold</Option>
                <Option value="Shared for negotiation">Shared for Negotiation</Option>
              </Select>
            </Form.Item>
          )}
          {status === "Offer" && (
            <Form.Item label="Offer Status">
              <Select onChange={handleDocumentationStatusChange} placeholder="Choose Status">
                <Option value="Offer Letter Shared">Offer Letter Shared</Option>
                <Option value="Offer Accepted">Offer Accepted</Option>
                <Option value="Offer Declined">Offer Declined</Option>
                <Option value="Offer On Hold">Offer On Hold</Option>
                <Option value="Seeking Counter Offer">Seeking Counter Offer</Option>
              </Select>
            </Form.Item>
          )}
          {status === "Joining Status" && (
            <div>
              <Form.Item label="Joining Status">
                <Select onChange={handleDocumentationStatusChange} placeholder="Choose Status">
                  <Option value="Joined">Joined</Option>
                  <Option value="Candidate Declined / Backout">Candidate Declined / Backout</Option>
                  <Option value="To Join">To Join</Option>
                  <Option value="Offer Revoked">Offer Revoked</Option>
                  <Option value="To Join/ Serving Notice Period">To Join/ Serving Notice Period</Option>
                </Select>
              </Form.Item>
              {(documentationStatus === "Joined" || documentationStatus === "To Join") && (
                <Form.Item label="Joining Date">
                  <DatePicker onChange={handleJoiningDateChange} style={{ width: "100%" }} disabledDate={disabledDate} />
                </Form.Item>
              )}
              {documentationStatus === "Candidate Declined / Backout" && (
                <Form.Item label="Reason">
                  <Input.TextArea onChange={(e) => setReason(e.target.value)} placeholder="Enter reason for decline/backout" />
                </Form.Item>
              )}
            </div>
          )}
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
