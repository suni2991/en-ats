import React, { useState, useEffect } from "react";
import userlogo from "../Assests/Applicant.jpg";
import { Drawer, Collapse, Button, message, Card, Input, Modal } from "antd";
import useAuth from "../hooks/useAuth";
import axios from "axios";

const { Panel } = Collapse;
const URL = process.env.REACT_APP_API_URL;

const CandidateProfileDrawer = ({ open, onClose, candidateId, onUpdateStatus }) => {
  const [candidateData, setCandidateData] = useState({});
  const [loading, setLoading] = useState(true);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const { token, auth, role } = useAuth();
  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
  const [rejectionNote, setRejectionNote] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${URL}/api/candidate/profile/${candidateId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        if (data.status === "SUCCESS") {
          // Filter only the last added L1, L2, and HR rounds
          const filteredRounds = data.data.round.reduce((acc, round) => {
            if (
              ["L1", "L2", "HR"].includes(round.roundName) &&
              (!acc[round.roundName] ||
                new Date(round.interviewDate) >
                new Date(acc[round.roundName].interviewDate))
            ) {
              acc[round.roundName] = round;
            }
            return acc;
          }, {});

          setCandidateData({
            ...data.data,
            round: Object.values(filteredRounds),
          });
        } else {
          console.error("Failed to fetch candidate data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching candidate data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open && candidateId) {
      fetchData();
    }
  }, [open, candidateId, token]);

  const drawerTitle = candidateData.fullName
    ? `${candidateData.fullName}'s Profile`
    : "Candidate Profile";

  const labelStyle = { fontWeight: "bold" };
  const valueStyle = { marginLeft: "30px", textTransform: "capitalize" };

  const getPanelBackgroundColor = (roundName) => {
    switch (roundName) {
      case "L1":
        return "#00a2bd";
      case "L2":
        return "#00b4d2";
      case "HR":
        return "#4ccadf";
      default:
        return "#7fd9e8";
    }
  };

  const panelHeaderStyle = {
    color: "white",
    textTransform: "capitalize",
  };

  const handleHistoryDrawerOpen = () => {
    setHistoryDrawerOpen(true);
  };

  const handleHistoryDrawerClose = () => {
    setHistoryDrawerOpen(false);
  };

  // const renderResumeLink = (candidate) => {
  //   if (candidate.resume) {
  //     const downloadLink = `${URL}${candidate.resume}`;
  //     return (
  //       <a href={downloadLink} target="_blank" rel="noopener noreferrer" className='resume-link'>
  //         {candidate.firstName} CV
  //       </a>
  //     );
  //   } else {
  //     return "Resume not available";
  //   }
  // };

  const renderResumeLink = (candidate) => {
  };
  const updateScore = async (subject) => {
    try {
      const response = await axios.put(
        `${URL}/api/candidate/${candidateId}/reset-scores`,
        { subject }, 
         // Only send the subject name
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        message.success(`Score reset for ${subject}`);
        setCandidateData((prevData) => ({
          ...prevData,
          [subject]: { ...prevData[subject], score: -1, status: "pending" },
        }));
      }
    } catch (error) {
      console.error(`Error resetting score for ${subject}:`, error);
      message.error(`Error resetting score for ${subject}`);
    }
  };

  const renderScores = () => {
    if (candidateData.selectedCategory === "No-Test") {
      return <center><h1> No-Test</h1></center>;
    }

    if (!candidateData?.assessmentDone) {
      return <p>No assessment data available.</p>;
    }
  
    const renderScoreRow = (subject, subjectData) => (
      <p key={subject}>
        {subject}:{" "}
        <span style={{ color: subjectData?.status > "pass" ? "#00B4D2" : "black" }}>
          {subjectData?.score === -1 ? 0 : subjectData?.score}, {subjectData?.status ?? " "}
        </span>
        {auth.role === "Admin" && (
          <Button
            type="link"
            onClick={() => updateScore(subject)}
            disabled={subjectData?.score === -1}
          >
            Reset
          </Button>
        )}
      </p>
    );
  
    const atsCleared = candidateData.atsCleared;
    const scores = candidateData.selectedCategory === "Technical" ? (
      <>
        {renderScoreRow("Psychometric", candidateData.psychometric)}
        {renderScoreRow("Java", candidateData.java)}
        {renderScoreRow("Vocabulary", candidateData.vocabulary)}
        {renderScoreRow("Quantitative", candidateData.quantitative)}
      </>
    ) : (
      <>
        {renderScoreRow("Vocabulary", candidateData.vocabulary)}
        {renderScoreRow("Excel", candidateData.excel)}
        {renderScoreRow("Accounts", candidateData.accounts)}
        {renderScoreRow("Quantitative", candidateData.quantitative)}
      </>
    );
  
    return (
      <>
      {scores}
      <div style={{ marginTop: "20px" }}>
        {!candidateData.atsCleared && (
          <>
            <h4><strong>Test:</strong></h4>
            <Button type="primary" onClick={() => handleTestStatusUpdate("Test Rejected")} style={{ background: "red", width: "30%", marginRight: "5%" }}>Rejected</Button>
            <Button type="primary" onClick={() => handleTestStatusUpdate("Test Shortlisted")} style={{ background: "#00B4D2", width: "30%", marginRight: "5%" }}>Shortlisted</Button>
            <Button type="primary" onClick={() => handleTestStatusUpdate("Re-Test")} style={{ background: "#007d93", width: "30%" }}>Re-Test</Button>
          </>
        )}
      </div>
    </>
    );
  };

  const handleTestStatusUpdate = async (status) => {
    if (status === "Re-Test") {
      // Reset scores of "fail" subjects
      const subjectsToReset = ["psychometric", "java", "vocabulary", "quantitative", "excel", "accounts"];
      const resetPromises = subjectsToReset.map(subject => {
        if (candidateData[subject]?.status === "Fail") {
          return updateScore(subject);
        }
        return Promise.resolve();
      });
      await Promise.all(resetPromises);
    }

    const updatedStatus = status === "Test Shortlisted" ? "L1 To be Scheduled" : status;
  
    try {
      const response = await axios.put(
        `${URL}/api/candidate/${candidateId}`,
        {
          atsCleared: true,
          testStatus: status,
          status: updatedStatus,
          assessmentDone: status === "Re-Test" ? false : candidateData.assessmentDone,
          history: {
            note: `Test status updated to ${status}`,
            updatedBy: auth.fullName,
            updatedAt: new Date().toISOString(),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        message.success(`Test status updated to '${status}'`);
        setCandidateData((prevData) => ({
          ...prevData,
          testStatus: status,
          status: status,
          assessmentDone: status === "Re-Test" ? false : prevData.assessmentDone,
          history: [
            ...(prevData.history || []),
            {status: status, note: `Test status updated to ${status}`, updatedBy: auth.fullName, updatedAt: new Date().toISOString() },
          ],
        }));
      } else {
        message.error("Failed to update test status.");
      }
    } catch (error) {
      console.error("Error updating test status:", error);
      message.error("Error updating test status.");
    }
  };

  const handleRejection = async () => {
    if (!rejectionNote) {
      message.warning("Please provide a note for the rejection.");
      return;
    }
  
    const updatedBy = auth.fullName; // Replace with actual user role if dynamic

    try {
      await axios.put(
        `${URL}/api/candidate/${candidateId}`,
        {
          status: "Rejected",
          note: rejectionNote,
          history: {
            status:"CV Rejected",
            note: `${rejectionNote}`,
            updatedBy: updatedBy,
            updatedAt: new Date(),
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      message.success("Candidate status updated to 'Rejected'");
      setRejectionModalVisible(false);
      setRejectionNote("");
      setCandidateData((prevData) => ({
        ...prevData,
        status: "CV Rejected",
        history: [
          ...(prevData.history || []),
          { status: "CV Rejected", note: `Rejection reason: ${rejectionNote}`, updatedBy }
        ]
      }));
    } catch (error) {
      console.error("Error rejecting candidate:", error);
      message.error("Error updating candidate status.");
    }
  };
  

  const renderRejectionModal = () => (
    <Modal
      title="Reject Candidate"
      open={rejectionModalVisible}
      onOk={handleRejection}
      onCancel={() => setRejectionModalVisible(false)}
      okText="Confirm Rejection"
      okButtonProps={{ disabled: !rejectionNote }}
    >
      <p>Please provide a reason for rejection:</p>
      <Input.TextArea
        rows={4}
        value={rejectionNote}
        onChange={(e) => setRejectionNote(e.target.value)}
        placeholder="Enter rejection reason"
        required
      />
      
    </Modal>
  );

  const handleSendEmailAndUpdateStatus = async (status) => {
    if (status === "CV Shortlisted") {
      const emailData = {
        role: candidateData.role,
        mgrEmail: candidateData.mgrEmail,
        confirmPassword: candidateData.confirmPassword,
        email: candidateData.email,
        fullName: candidateData.fullName,
      };
  
      try {
        // Send email credentials
        const emailResponse = await axios.post(`${URL}/api/user/credentials`, emailData);
        if (emailResponse.status === 201) {
          message.success("Email sent successfully!");
        } else {
          message.error("Failed to send email.");
        }
      } catch (error) {
        console.error("Error sending email:", error);
        message.error("Error sending email.");
      }
    }
  
    // Update candidate's status
    try {
      const updateResponse = await axios.put(
        `${URL}/api/candidate/${candidateId}`,
        {
          status,
          history: {
            status: status,
            note: `Status updated to ${status}`,
            updatedBy: auth.fullName,
            updatedAt: new Date().toISOString(),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (updateResponse.status === 200) {
        message.success(`Candidate status updated to '${status}'`);
        setCandidateData((prevData) => ({
          ...prevData,
          status,
          history: [
            ...(prevData.history || []),
            { status: status, note: `Status updated to ${status}`, updatedBy: auth.fullName, updatedAt: new Date().toISOString() },
          ],
        }));
        // Call the callback function to update the status in CandidateCard
        onUpdateStatus(candidateId, status);
      } else {
        message.error("Failed to update candidate status.");
      }
    } catch (error) {
      console.error("Error updating candidate status:", error);
      message.error("Error updating candidate status.");
    }
  };
  

  return (
    <>
      <Drawer
        title={
          <div
            style={{
              backgroundColor: "#004854",
              color: "white",
              padding: "10px",
              textTransform: "capitalize",
            }}
          >
            {drawerTitle}
          </div>
        }
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
        width={400}
      >
        <div className="profile-header">
          <img
            src={userlogo}
            alt="User Logo"
            className="user-logo"
            width={100}
          />
          <h1>{candidateData.position}</h1>
          <div style={{ textTransform: 'capitalize' }}>
            {renderResumeLink(candidateData)}
          </div>
          <br />
        </div>

        <Collapse defaultActiveKey={["1"]} accordion>
          <Panel
            header={<span style={panelHeaderStyle}>About</span>}
            key="1"
            style={{ backgroundColor: "#005a69" }}
          >
            <p>
              <span style={labelStyle}>First Name</span>
              <span style={valueStyle}>: {candidateData.firstName}</span>
            </p>
            <p>
              <span style={labelStyle}>Last Name</span>
              <span style={valueStyle}>: {candidateData.lastName}</span>
            </p>
            <p>
              <span style={labelStyle}>Qualification</span>
              <span style={valueStyle}>: {candidateData.qualification}</span>
            </p>
            <p>
              <span style={labelStyle}>Experience</span>
              <span style={valueStyle}>: {candidateData.totalExperience}</span>
            </p>
          </Panel>
          <Panel
            header={<span style={panelHeaderStyle}>Contact</span>}
            key="2"
            style={{ backgroundColor: "#007d93" }}
          >
            <p>
              <span style={labelStyle}>Email</span>
              <span>: {candidateData.email}</span>
            </p>
            <p>
              <span style={labelStyle}>Contact</span>
              <span style={valueStyle}>: {candidateData.contact}</span>
            </p>
            <p>
              <span style={labelStyle}>Address</span>
              <span style={valueStyle}>
                : {candidateData.currentLocation}, {candidateData.state}
              </span>
            </p>
          </Panel>
          {candidateData.round &&
            candidateData.round.length > 0 &&
            candidateData.round.map((round, index) => (
              <Panel
                header={`${round ? round.roundName : "Unknown"}-Round`}
                key={index}
                style={{
                  backgroundColor: round
                    ? getPanelBackgroundColor(round.roundName)
                    : "defaultColor",
                  textTransform: "capitalize",
                }}
              >
                <p>
                  <span style={labelStyle}>Round Name</span>
                  <span style={valueStyle}>
                    : {round ? round.roundName : ""}
                  </span>
                </p>
                <p>
                  <span style={labelStyle}>Panelist Name</span>
                  <span style={valueStyle}>
                    : {round ? round.panelistName : ""}
                  </span>
                </p>
                <p>
                  <span style={labelStyle}>Interview Date</span>
                  <span style={valueStyle}>
                    :{" "}
                    {new Date(
                      round ? round.interviewDate : ""
                    ).toLocaleDateString()}
                  </span>
                </p>
                <p>
                  <span style={labelStyle}>Feedback Provided</span>
                  <span style={valueStyle}>
                    : {round && round.feedbackProvided ? "Yes" : "No"}
                  </span>
                </p>
                <ul>
                  {round?.skills &&
                    round.skills.map((skill, skillIndex) => (
                      <li key={skillIndex}>
                        <strong>{skill.name}</strong>: {skill.rating} -{" "}
                        {skill.comments}
                      </li>
                    ))}
                </ul>
              </Panel>
            ))}
        </Collapse>
        <Collapse>
          <Panel
            header={<span>Others</span>}
            key="4"
            style={{
              backgroundColor: "#ccf0f6",
              color: "#000",
              textTransform: "capitalize",
            }}
          >
            <div>
              <p>
                <span style={labelStyle}>Status</span>
                <span style={valueStyle}>: {candidateData.status}</span>
              </p>
              <p>
                <span style={labelStyle}>Source</span>
                <span style={valueStyle}>: {candidateData.source}</span>
              </p>
              <p>
                <span style={labelStyle}>HR</span>
                <span style={valueStyle}>: {candidateData.mgrName}</span>
              </p>
              <p>
                <span style={labelStyle}>Reference</span>
                <span style={valueStyle}>: {candidateData.reference}</span>
              </p>
            </div>
          </Panel>
        </Collapse>
        <Collapse accordion>
          <Panel header="Assessment Details" key="1">
            {candidateData ? (
              <Card>
                {renderScores()}
              </Card>
            ) : (
              <p>Loading candidate details...</p>
            )}
          </Panel>
        </Collapse>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {(candidateData.status && (candidateData.status.includes("CV") || candidateData.status.includes("Awaiting"))) && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: "10px" }}>
                <Button type="primary" onClick={() => handleSendEmailAndUpdateStatus("CV Shortlisted")} style={{ background: "#00B4D2", width: "48%" }}>CV Shortlisted</Button>
                <Button type="primary" onClick={() => handleSendEmailAndUpdateStatus("Awaiting Feedback")} style={{ background: "#00B4D2", width: "48%" }}>Awaiting Feedback</Button>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <Button type="primary" onClick={() => handleSendEmailAndUpdateStatus("CV on Hold")} style={{ background: "#007d93", width: "48%" }}>CV on Hold</Button>
                <Button type="primary" onClick={() => setRejectionModalVisible(true)} style={{ background: "red", width: "48%" }}>CV Rejected</Button>
              </div>
            </div>
          )}
          <Button type="primary" onClick={handleHistoryDrawerOpen} style={{ marginTop: "20px", background: "#00B4D2", alignSelf: "center" }}>View History</Button>
          <div>
            <h6>{candidateData.status}</h6>
          </div>
        </div>
      </Drawer>
      {renderRejectionModal()}
      <Drawer
        title="Candidate History"
        placement="left"
        closable={true}
        onClose={handleHistoryDrawerClose}
        open={historyDrawerOpen}
        width={400}
      >
        {candidateData.history && candidateData.history.length > 0 ? (
          candidateData.history.map((historyItem, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <p style={{color:"#00B4D2"}}>
                <span style={labelStyle}>Status</span>
                <span style={valueStyle}>: {historyItem.status}</span>
              </p>
              <p>
                <span style={labelStyle}>Updated By</span>
                <span style={valueStyle}>: {historyItem.updatedBy}</span>
              </p>
              <p>
                <span style={labelStyle}>Updated At</span>
                <span style={valueStyle}>
                  : {new Date(historyItem.updatedAt).toLocaleDateString()}
                </span>
              </p>
              <p>
                <span style={labelStyle}>Note</span>
                <span style={valueStyle}>: {historyItem.note}</span>
              </p>
              <hr/>
            </div>
          ))
        ) : (
          <p>No history available for this candidate.</p>
        )}
      </Drawer>
    </>
  );
};

export default CandidateProfileDrawer;
