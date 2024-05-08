import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Drawer } from 'antd';

const CandidateProfileDrawer = ({ visible, onClose, candidateId }) => {
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

    if (visible && candidateId) {
      fetchData();
    }
  }, [visible, candidateId]);

  return (
    <Drawer
      title="Candidate Profile"
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visible}
      width={500}
    >
      <div className="profile-info">
        <p>First Name: {candidateData.firstName}</p>
        <p>Last Name: {candidateData.lastName}</p>
        <p>Email: {candidateData.email}</p>
        <p>DoB: {candidateData.dob}</p>
        <p>Qualification: {candidateData.qualification}</p>
        <p>Experience: {candidateData.totalExperience}</p>
        <p>Contact: {candidateData.contact}</p>
        <p>City: {candidateData.currentLocation}</p>
        <p>District: {candidateData.district}</p>
        <p>Manager Name: {candidateData.mgrName}</p>
        
      </div>
    </Drawer>
  );
};

export default CandidateProfileDrawer;
