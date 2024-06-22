import React, { useState, useEffect } from 'react';
import userlogo from '../Assests/Applicant.jpg';
import { Drawer, Collapse } from 'antd';

const { Panel } = Collapse;

const CandidateProfileDrawer = ({ open, onClose, candidateId }) => {
  const [candidateData, setCandidateData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5040/candidate/profile/${candidateId}`);
        const data = await response.json();
        
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
  }, [open, candidateId]);

  const drawerTitle = candidateData.fullName ? `${candidateData.fullName}'s Profile` : "Candidate Profile";

  const labelStyle = { fontWeight: 'bold' };
  const valueStyle = { marginLeft: '30px',  textTransform: 'capitalize' };

  const panelHeaderStyle = {
    color: 'white',
    textTransform: 'capitalize'
  };

  return (
    <Drawer
      title={<div style={{ backgroundColor: '#1a2763', color: 'white', padding: '10px', textTransform: 'capitalize' }}>{drawerTitle}</div>}
      placement="right"
      closable={false}
      onClose={onClose}
      open={open}
      width={400}
    >
      <div className="profile-header">
        <img src={userlogo} alt="User Logo" className="user-logo" width={100} />
        <h1>{candidateData.position}</h1>
        <br/>
      </div>
      <Collapse defaultActiveKey={['1']} accordion>
        <Panel header={<span style={panelHeaderStyle}>About</span>} key="1" style={{ backgroundColor: '#1a2763' }}>
          <p><span style={labelStyle}>First Name</span><span style={valueStyle}>: {candidateData.firstName}</span></p>
          <p><span style={labelStyle}>Last Name</span><span style={valueStyle}>: {candidateData.lastName}</span></p>
          <p><span style={labelStyle}>Qualification</span><span style={valueStyle}>: {candidateData.qualification}</span></p>
          <p><span style={labelStyle}>Experience</span><span style={valueStyle}>: {candidateData.totalExperience}</span></p>
        </Panel>
        <Panel header={<span style={panelHeaderStyle}>Contact</span>} key="2" style={{ backgroundColor: '#00B4D2' }}>
          <p><span style={labelStyle}>Email</span><span>: {candidateData.email}</span></p>
          <p><span style={labelStyle}>Contact</span><span style={valueStyle}>: {candidateData.contact}</span></p>
          <p><span style={labelStyle}>Address</span><span style={valueStyle}>: {candidateData.city}, {candidateData.district}, {candidateData.state}</span></p>
        </Panel>
        <Panel header={<span style={panelHeaderStyle}>Skills</span>} key="3" style={{ backgroundColor: '#51C4D3' }}>
          {candidateData.skills && (
            <div>
              <h3>Skills - Evaluation Details</h3>
              <ul>
                {candidateData.skills.map((skill, index) => (
                  <li key={index}>
                    <strong>{skill.name}</strong>: {skill.rating} - {skill.comments}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Panel>
        <Panel header={<span>Others</span>} key="4" style={{ backgroundColor: '#D8E3E7', color: '#000', textTransform: 'capitalize' }}>
          {candidateData.evaluationDetails && (
            <div>
              <p><span style={labelStyle}>Status</span><span style={valueStyle}>: {candidateData.status}</span></p>
              <p><span style={labelStyle}>HR</span><span style={valueStyle}>: {candidateData.mgrName}</span></p>
            </div>
          )}
        </Panel>
      </Collapse>
    </Drawer>
  );
};

export default CandidateProfileDrawer;
