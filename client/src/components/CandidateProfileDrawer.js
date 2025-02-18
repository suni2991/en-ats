import React, { useState, useEffect } from "react";
import userlogo from "../Assests/Applicant.jpg";
import { Drawer, Collapse, Button, message, Card, Input, Modal, List } from "antd";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import Item from "antd/es/list/Item";
import ButtonGroup from "antd/es/button/button-group";

const { Panel } = Collapse;
const URL = process.env.REACT_APP_API_URL;

const CandidateProfileDrawer = ({ open, onClose, candidateId }) => {
  const [candidateData, setCandidateData] = useState({});
  const [candidateUniqueId, setCandidateUniqueId] = useState(candidateId);
  const [loading, setLoading] = useState(true);
  const [isRejectCVButtonDisabled, setIsRejectCVButtonDisabled] = useState(false);
  const [isPutCVOnHoldButtonDisabled, setisPutCVOnHoldButtonDisabled] = useState(false);
  const [isShortlistCVButtonDisabled, setIsShortlistCVButtonDisabled] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const { token, auth, role } = useAuth();
  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
  const [rejectionNote, setRejectionNote] = useState("");


  useEffect(() => {
    if (candidateData.status === 'Rejected' || candidateData.status === 'CV Shortlisted' || candidateData.status === 'CV Rejected') {
      setIsShortlistCVButtonDisabled(true);
      setisPutCVOnHoldButtonDisabled(true);
      setIsRejectCVButtonDisabled(true);
    }
    else if(candidateData.status === 'CV On Hold'){
      setIsShortlistCVButtonDisabled(false);
      setisPutCVOnHoldButtonDisabled(true);
      setIsRejectCVButtonDisabled(false);
    }
    else{
      setIsShortlistCVButtonDisabled(false);
      setisPutCVOnHoldButtonDisabled(false);
      setIsRejectCVButtonDisabled(false);
    }
  }, [candidateData, candidateUniqueId])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${URL}/candidate/profile/${candidateId}`,
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

  const renderResumeLink = (candidate) => {
    if (candidate.resume) {
      const downloadLink = `${URL}${candidate.resume}`;
      return (
        <a href={downloadLink} target="_blank" rel="noopener noreferrer" className='resume-link'>
          {candidate.firstName} CV
        </a>
      );
    } else {
      return "Resume not available";
    }
  };

  const updateScore = async (subject) => {
    try {
      const response = await axios.put(
        `${URL}/candidate/${candidateId}/reset-scores`,
        { subject },  // Only send the subject name
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
          [subject]: { ...prevData[subject], score: -1 },
        }));
      }
    } catch (error) {
      console.error(`Error resetting score for ${subject}:`, error);
      message.error(`Error resetting score for ${subject}`);
    }
  };


  const renderScores = () => {
    const renderScoreRow = (subject, subjectData) => (
      <p>
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

    if (!candidateData?.assessmentDone) {
      return <p>No assessment data available.</p>;
    }

    if (candidateData.selectedCategory === "Technical") {
      return (
        <>
          {renderScoreRow("Psychometric", candidateData.psychometric)}
          {renderScoreRow("Java", candidateData.java)}
          {renderScoreRow("Vocabulary", candidateData.vocabulary)}
          {renderScoreRow("Quantitative", candidateData.quantitative)}
        </>
      );
    } else if (candidateData.selectedCategory === "Non-Technical") {
      return (
        <>
          {renderScoreRow("Vocabulary", candidateData.vocabulary)}
          {renderScoreRow("Excel", candidateData.excel)}
          {renderScoreRow("Accounts", candidateData.accounts)}
          {renderScoreRow("Quantitative", candidateData.quantitative)}
        </>
      );
    }
  };

  // const handleSelection = async () => {
  //   console.log('Candiddate CV Shortlisted');

  // }


  const handlePutOnHold = async () => {

    const updatedBy = auth.fullName;

    try {

      const holdResponse = await axios.put(
        `${URL}/candidate/${candidateId}`,
        {
          status: "CV On Hold",
          // note: rejectionNote,
          history: {
            // note: `${rejectionNote}`,
            note: "CV Put On Hold",
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

      setCandidateData((prevData) => ({
        ...prevData,
        status: "CV On Hold",
        history: [
          ...(prevData.history || []),
          {
            note: "CV Put On Hold",
            updatedBy: updatedBy,
            updatedAt: new Date(),
          }
        ]
      }));

      message.success("Candidate status updated to 'CV On Hold'.");
      setIsShortlistCVButtonDisabled(false);
      setisPutCVOnHoldButtonDisabled(true);
      setIsRejectCVButtonDisabled(false);
    } catch (error) {
      console.error("Error updating candidate status:", error);
      message.error("Error updating candidate status to 'CV on Hold'.");
    }

  }

  const handleRejection = async () => {
    if (!rejectionNote) {
      message.warning("Please provide a note for the rejection.");
      return;
    }

    const updatedBy = auth.fullName; // Replace with actual user role if dynamic

    try {
      await axios.put(
        `${URL}/candidate/${candidateId}`,
        {
          status: "CV Rejected",
          note: rejectionNote,
          history: {
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
        status: "Rejected",
        history: [
          ...(prevData.history || []),
          { note: `Rejection reason: ${rejectionNote}`, updatedBy }
        ]
      }));

      setIsShortlistCVButtonDisabled(true);
      setisPutCVOnHoldButtonDisabled(true);
      setIsRejectCVButtonDisabled(true);
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

  const handleSendEmail = async () => {

    const updatedBy = auth.fullName; 

    const emailData = {
      role: candidateData.role,
      mgrEmail: candidateData.mgrEmail,
      confirmPassword: candidateData.confirmPassword,
      email: candidateData.email,
      fullName: candidateData.fullName,
    };

    try {
      // Send email credentials
      const emailResponse = await axios.post(`${URL}/user/credentials`, emailData);

      if (emailResponse.status === 201) {
        message.success("Email sent successfully!");

        // If email is sent successfully, update the candidate's status to "CV Processed"
        try {
          const updateResponse = await axios.put(
            `${URL}/candidate/${candidateId}`,
            {
              status: "CV Shortlisted",
              history: {
                note: "Credentials sent for Screening Test",
                updatedBy: auth.fullName,
                updatedAt: new Date(),
              }
            },  // update status to CV Processed
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (updateResponse.status === 200) {
            message.success("Candidate status updated to 'CV Processed'");
            setIsShortlistCVButtonDisabled(true);
            setisPutCVOnHoldButtonDisabled(true);
            setIsRejectCVButtonDisabled(true);

            setCandidateData((prevData) => ({
              ...prevData,
              status: "CV Shortlisted",
              history: [
                ...(prevData.history || []),
                { note: `CV has been shortlisted.`, updatedAt: new Date(), updatedBy }
              ]
            }));

          } else {
            message.error("Failed to update candidate status.");
          }
        } catch (error) {
          console.error("Error updating candidate status:", error);
          message.error("Error updating candidate status.");
        }
      } else {
        message.error("Failed to send email.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      message.error("Error sending email.");
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
        <Collapse accordion>
          <Panel header="Take Action on CV" key="7">
            {candidateData ? (
              // candidateData.status !== 'Rejected' && candidateData.status !== 'CV Shorlisted' && candidateData.status !== 'CV on Hold' && 
              <List>
                <Item><Button style={{ backgroundColor: 'green', color: 'white', padding: '10px' }} onClick={handleSendEmail} disabled={isShortlistCVButtonDisabled}> Shortlist CV</Button></Item>
                <Item><Button style={{ backgroundColor: '#EDC001', color: 'white', padding: '10px' }} onClick={handlePutOnHold} disabled={isPutCVOnHoldButtonDisabled}>Put on Hold</Button></Item>
                <Item><Button style={{ backgroundColor: 'red', color: 'white', padding: '10px' }} onClick={() => setRejectionModalVisible(true)} disabled={isRejectCVButtonDisabled}>Reject CV</Button></Item>
              </List>
            ) : (
              <p>Loading candidate details...</p>
            )}
          </Panel>
        </Collapse>

        <div className="btn-wrapper" style={{ display: "flex", justifyContent: "space-between" }}>
          {/* {candidateData.status === "CV Sourced" && (
            <Button type="primary" onClick={handleSendEmail} style={{ marginTop: "20px", background: "#00B4D2" }}>Shortlist CV</Button>
          )} */}
          {candidateData.status !== "Rejected" ? (
            <>
              {/* <Button type="primary" onClick={() => setRejectionModalVisible(true)} style={{ marginTop: "20px", background: "red" }}>Reject</Button> */}
              <Button type="primary" onClick={handleHistoryDrawerOpen} style={{ marginTop: "20px", background: "#00B4D2" }}>View History</Button>
            </>
          ) : (
            <Button type="primary" onClick={handleHistoryDrawerOpen} style={{ marginTop: "20px", background: "#00B4D2" }}>View History</Button>
          )}
        </div>
      </Drawer>
      {renderRejectionModal()}

      {/* Candidate History Drawer Content */}
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
                <span style={labelStyle}>Status</span>
                <span style={valueStyle}>: {candidateData.status}</span>
              </p>
              <p>
                <span style={labelStyle}>Note</span>
                <span style={valueStyle}>: {historyItem.note}</span>
              </p>
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
