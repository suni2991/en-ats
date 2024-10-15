import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { message, Modal, Input } from "antd";
import useAuth from "../hooks/useAuth";

const URL = process.env.REACT_APP_API_URL;

const ApproveJobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [note, setNote] = useState("");
  const [updatedBy, setUpdatedBy] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState(""); // 'Approve' or 'Reject'
  const { token } = useAuth();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${URL}/job/${id}`);
        setJob(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const updateJobStatus = async (newStatus) => {
    try {
      const updatedJob = {
        ...job,
        status: newStatus,
        history: [
          ...job.history,
          {
            updatedBy: updatedBy || "Directors", // Use provided name or default
            updatedAt: new Date(),
            note: note,
          },
        ],
      };
      await axios.put(`${URL}/job-posts/${id}`, updatedJob, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJob((prevJob) => ({ ...prevJob, status: newStatus }));
      message.success(
        `Job ${
          newStatus === "Active" ? "Approved" : "Rejected"
        } successfully`
      );
      setIsModalVisible(false);
    } catch (error) {
      console.error("Update request failed:", error);
      message.error(
        `Failed to ${newStatus === "Active" ? "approve" : "reject"} job`
      );
    }
  };

  const handleModalOk = () => {
    if (!note || !updatedBy) {
      message.error("Please provide both a note and your name.");
      return;
    }
    updateJobStatus(modalMode);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setNote("");
    setUpdatedBy("");
  };

  const showApproveModal = () => {
    setModalMode("Active");
    setIsModalVisible(true);
  };

  const showRejectModal = () => {
    setModalMode("Denied");
    setIsModalVisible(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!job) return <p>Job not found</p>;

  const statusMessageStyle = {
    color:
      job.status === "Denied"
        ? "red"
        : job.status === "Active"
        ? "green"
        : "inherit",
    fontWeight: "bold",
    background: "#fff",
  };

  return (
    <div className="bg">
      <div className="job-details">
        {(job.status === "Active" || job.status === "Denied") && (
          <p style={statusMessageStyle}>
            The current Job is already {job.status} on{" "}
            {new Date(job.postedAt).toLocaleString()}
          </p>
        )}
        <h2>{job.position}</h2>
        <br />
        <br />
        <p>
          <strong>Department:</strong> {job.department}
        </p>
        <p>
          <strong>Description:</strong> {job.description}
        </p>
        <p>
          <strong>Job Location:</strong> {job.jobLocation}
        </p>
        <p>
          <strong>Vacancies:</strong> {job.vacancies}
        </p>
        <p>
          <strong>Experience:</strong> {job.experience}
        </p>
        <p>
          <strong>Responsibilities:</strong> {job.responsibilities}
        </p>
        <p>
          <strong>Primary Skills:</strong> {job.primarySkills.join(", ")}
        </p>
        {job.secondarySkills && (
          <p>
            <strong>Secondary Skills:</strong> {job.secondarySkills.join(", ")}
          </p>
        )}
        <p>
          <strong>Status:</strong> {job.status}
        </p>
        <p>
          <strong>Posted By:</strong> {job.postedBy} on{" "}
          {new Date(job.postedAt).toLocaleString()}
        </p>

        {(job.status !== "Active" && job.status !== "Denied") && (
          <div className="button-container">
            <button onClick={showApproveModal}>Approve</button>
            <button onClick={showRejectModal}>Reject</button>
          </div>
        )}
      </div>

      <Modal
        title={modalMode === "Active" ? "Approve Job" : "Reject Job"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={modalMode === "Active" ? "Approve" : "Reject"}
        cancelText="Cancel"
      >
        <Input.TextArea
          rows={4}
          placeholder="Enter note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Input
          placeholder="Enter your name"
          value={updatedBy}
          onChange={(e) => setUpdatedBy(e.target.value)}
          style={{ marginTop: '10px' }}
        />
      </Modal>
    </div>
  );
};

export default ApproveJobDetails;
