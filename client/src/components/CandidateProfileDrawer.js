import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Drawer } from 'antd';

const CandidateProfileDrawer = ({ open, onClose, candidateId }) => {
  const [candidateData, setCandidateData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5040/candidate/${candidateId}`);
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

  return (
    <Drawer
      title="Candidate Profile"
      placement="right"
      closable={false}
      onClose={onClose}
      open={open}
      width={400}
    >
      <div className="profile-info">
        <h1>Full Name: {candidateData.fullName}</h1>
        <h1>Position: {candidateData.position}</h1>
        <p>First Name: {candidateData.firstName}</p>
        <p>Last Name: {candidateData.lastName}</p>
        <p>Email: {candidateData.email}</p>
        <p>DoB: {candidateData.dob}</p>
        <p>Qualification: {candidateData.qualification}</p>
        <p>Experience: {candidateData.totalExperience}</p>
        <p>Contact: {candidateData.contact}</p>
        <p>City: {candidateData.district}</p>
        <p>District: {candidateData.district}</p>
        <p>Manager Name: {candidateData.mgrName}</p>
        <p>Panelist: {candidateData.panelistName}</p>
        <h1>Status: {candidateData.status}</h1>
        {candidateData.evaluationDetails && (
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
      </div>
    </Drawer>
  );
};

export default CandidateProfileDrawer;
