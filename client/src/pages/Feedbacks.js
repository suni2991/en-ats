import React, { useState, useEffect } from "react";
import Fetchtable from "../components/Fetchtable";
import useAuth from "../hooks/useAuth";
import { Tooltip, DatePicker, Form, Button, Modal, Select, Input, message } from "antd";
import axios from "axios";
import { MdUpdate } from "react-icons/md";
import { useNavigate} from "react-router-dom";
import { VscFeedback } from "react-icons/vsc";
import Panelist from "../components/Panelist";
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
  const [offeredCTC, setOfferedCTC] = useState("");
  const [candidateData, setCandidateData] = useState([]);
  const [historyUpdate, setHistoryUpdate] = useState(null);
  const [benefits, setBenefits] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [reloadData, setReloadData] = useState(false);

  const navigateTo = useNavigate();

  // Fetch candidates based on the role
  const fetchCandidates = async () => {
    try {
      const endpoint = auth.role === "Admin" ? `${URL}/panelist/HR` : `${URL}/panelist/${auth.fullName}`;
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
        if (offeredCTC && status === "Offered") updates.offeredCTC = offeredCTC;
        if (status) {
          updates.status = status;
          setHistoryUpdate({
            updatedAt: new Date(),
            updatedBy: auth.fullName,
            note: `Applicant ${status}`,
          });
        }

        // Update candidate data
        await axios.put(
          `${URL}/candidates/${selectedCandidate._id}`,
          { ...updates, historyUpdate },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Status updated successfully.");
        setReloadData(true);
        // Refresh the candidate data
        await fetchCandidates();

        // Send email notification
        await axios.post(
          `${URL}/send-status`,
          {
            candidateName: selectedCandidate.fullName,
            offeredCTC: offeredCTC || "",
            benefits: benefits || "",
            startDate: startDate || "",
            deadline: deadline || "",
            statusUpdate: status,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Email sent successfully.");
        closeJoiningDateModal();
      } catch (error) {
        console.error("Invalid EMail", error);
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
    console.log("row:");
    console.log(row);
    setSelectedCandidate(row);
    const passCandidate = row;
    console.log("passCandidate:");
    console.log(passCandidate);
    if (passCandidate) {
      navigateTo("/provideFeedback/"+auth._id, {state: {passCandidate: {...passCandidate}, auth: {...auth}}});  
    }
    
  }

  const showModal = (row) => {
    setSelectedCandidate(row);
    console.log("selectedCandidate: ");
    console.log(selectedCandidate);
    setIsModalVisible(true);
  };

  // useEffect(()=>{
  //   console.log("useEffect SelectedCandidate:");
  //   console.log(selectedCandidate);
  // }, [selectedCandidate]);

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
    setOfferedCTC("");
    setBenefits("");
    setStartDate(null);
    setDeadline(null);
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
            <center><Tooltip title="Update" color="cyan">
              <button className="table-btn" onClick={() => showJoiningDateModal(row)}>
                <MdUpdate />
              </button>
            </Tooltip></center>
          )}
        </div>
      ),
      width: "150px",
    },
  ];

  return (
    <div className="vh-page" style={{ textTransform: "capitalize" }}>
      <Fetchtable
        url={auth.role === "Admin" ? `${URL}/panelist/HR` : `${URL}/panelist/${auth.fullName}`}
        data={auth.role === "Admin" ? candidateData.filter((c) => c.status === "HR Interview Cleared") : candidateData}
        columns={userColumns}
        reloadData={reloadData}
      />
      {/* <Modal open={isModalVisible} onCancel={closeModal} width={1250} footer={null}>
        {selectedCandidate && <Panelist candidateData={selectedCandidate} auth={auth} onClose={closeModal} />}
      </Modal> */}
      <Modal
        title="Update Status / Joining Date / Offered CTC"
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
              <Option value="Document_Processing">Documents Processing</Option>
              <Option value="Hold">Hold</Option>
              <Option value="Offered">Pre-Offer</Option>
            </Select>
          </Form.Item>
          {status === "Onboarded" && (
            <Form.Item label="Joining Date">
              <DatePicker onChange={handleJoiningDateChange} style={{ width: "100%" }} disabledDate={disabledDate} />
            </Form.Item>
          )}
          {status === "Offered" && (
            <>
              <Form.Item label="Offered CTC">
                <Input
                  type="number"
                  placeholder="Enter Offered CTC"
                  onChange={(e) => setOfferedCTC(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Benefits">
                <Input.TextArea placeholder="Enter Benefits" onChange={(e) => setBenefits(e.target.value)} />
              </Form.Item>
              <Form.Item label="Start Date">
                <DatePicker onChange={(date) => setStartDate(date)} style={{ width: "100%" }} disabledDate={disabledDate} />
              </Form.Item>
              <Form.Item label="Deadline">
                <DatePicker onChange={(date) => setDeadline(date)} style={{ width: "100%" }} disabledDate={disabledDate} />
              </Form.Item>
            </>
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
