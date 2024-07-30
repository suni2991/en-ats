import React, { useState, useEffect } from "react";
import userlogo from "../Assests/Applicant.jpg";
import { Drawer, Collapse, Button, message } from "antd";
import useAuth from "../hooks/useAuth";
import axios from "axios";

const { Panel } = Collapse;
const URL = process.env.REACT_APP_API_URL;

const CandidateProfileDrawer = ({ open, onClose, candidateId }) => {
  const [candidateData, setCandidateData] = useState({});
  const [loading, setLoading] = useState(true);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const { token } = useAuth();
  // console.log("asas", token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${URL}/candidate/profile/${candidateId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json", // Add this if you're sending JSON data
            },
          }
        );
        const data = await response.json();

        console.log(data);
        if (data.status === "SUCCESS") {
          setCandidateData(data.data);
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
  const valueStyle = { textTransform: "capitalize" };

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
  

  const handleSendEmail = async () => {
    const emailData = {
      role: candidateData.role,
      confirmPassword: candidateData.confirmPassword,
      email: candidateData.email,
      fullName: candidateData.fullName,
    };

    try {
      const emailResponse = await axios.post(`${URL}/user/register`, emailData);
      if (emailResponse.status === 201) {
        message.success("Email sent successfully!");
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
          <div style={{textTransform:'capitalize'}}>
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

            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td style={{ width: '30%' }}><span style={labelStyle}>First Name</span></td>
                  <td style={{ width: '5%' }}> : </td>
                  <td style={{ width: '65%' }}><span style={valueStyle}>{candidateData.firstName}</span></td>
                </tr>
                <tr>
                  <td><span style={labelStyle}>Last Name</span></td>
                  <td> : </td>
                  <td><span style={valueStyle}>{candidateData.lastName}</span></td>
                </tr>
                <tr>
                  <td><span style={labelStyle}>Qualification</span></td>
                  <td> : </td>
                  <td><span style={valueStyle}>{candidateData.qualification}</span></td>
                </tr>
                <tr>
                  <td><span style={labelStyle}>Experience</span></td>
                  <td> : </td>
                  <td><span style={valueStyle}>{candidateData.totalExperience}</span></td>
                </tr>
              </tbody>
            </table>
       
          </Panel>
          <Panel
            header={<span style={panelHeaderStyle}>Contact</span>}
            key="2"
            style={{ backgroundColor: "#007d93" }}
          >
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td style={{ width: '30%' }}><span style={labelStyle}>Email</span></td>
                  <td style={{ width: '5%' }}> : </td>
                  <td style={{ width: '65%' }}><span>{candidateData.email}</span></td>
                </tr>
                <tr>
                  <td><span style={labelStyle}>Contact</span></td>
                  <td> : </td>
                  <td><span style={valueStyle}>{candidateData.contact}</span></td>
                </tr>
                <tr>
                  <td><span style={labelStyle}>Address</span></td>
                  <td> : </td>
                  <td><span style={valueStyle}>{candidateData.currentLocation}, {candidateData.state}</span></td>
                </tr>
              </tbody>
            </table>
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
                <table style={{ width: '100%' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '45%' }}><span style={labelStyle}>Round Name</span></td>
                      <td style={{ width: '5%' }}> : </td>
                      <td style={{ width: '50%' }}> <span style={valueStyle}>{round ? round.roundName : ""}</span></td>
                    </tr>
                    <tr>
                      <td><span style={labelStyle}>Panelist Name</span></td>
                      <td> : </td>
                      <td><span style={valueStyle}>{round ? round.panelistName : ""}</span></td>
                    </tr>
                    <tr>
                      <td><span style={labelStyle}>Interview Date</span></td>
                      <td> : </td>
                      <td><span style={valueStyle}>{" "} {new Date(round ? round.interviewDate : "").toLocaleDateString()}</span></td>
                    </tr>
                    <tr>
                      <td><span style={labelStyle}>Feedback Provided</span></td>
                      <td> : </td>
                      <td><span style={valueStyle}> {round && round.feedbackProvided ? "Yes" : "No"} </span></td>
                    </tr>
                  </tbody>
                </table>
               
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

              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '30%' }}><span style={labelStyle}>Status</span></td>
                    <td style={{ width: '5%' }}> : </td>
                    <td style={{ width: '65%' }}><span style={valueStyle}>{candidateData.status}</span></td>
                  </tr>
                  <tr>
                    <td><span style={labelStyle}>HR</span></td>
                    <td> : </td>
                    <td><span style={valueStyle}>{candidateData.mgrName}</span></td>
                  </tr>
                  <tr>
                    <td><span style={labelStyle}>Reference</span></td>
                    <td> : </td>
                    <td><span style={valueStyle}>{candidateData.reference}</span></td>
                  </tr>
                  
                </tbody>
              </table>
          </Panel>
        </Collapse>
       
        <div className="btn-wrapper" style={{display:'flex', justifyContent:'space-between'}}>
        {candidateData.status === "Processing" && (
        <Button
            type="primary"
            onClick={handleSendEmail}
            style={{ marginTop: "20px", background: "#00B4D2" }}
          >
            Send Credentials
          </Button>)}
          <Button
            type="primary"
            onClick={handleHistoryDrawerOpen}
            style={{ marginTop: "20px", background: "#00B4D2" }}
          >
            View History
          </Button>
        </div>
      </Drawer>

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
                <span style={labelStyle}>Updated By</span>:{" "}
                {historyItem.updatedBy}
              </p>
              <p>
                <span style={labelStyle}>Updated At</span>:{" "}
                {new Date(historyItem.updatedAt).toLocaleDateString()}
              </p>
              <p>
                <span style={labelStyle}>Note</span>: {historyItem.note}
              </p>
            </div>
          ))
        ) : (
          <p>No history available.</p>
        )}
      </Drawer>
    </>
  );
};

export default CandidateProfileDrawer;
