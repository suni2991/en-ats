import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ApplicationStatus = () => {
  const [candidatesData, setCandidatesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/candidates-status'); // Assuming the endpoint is correctly set up
        setCandidatesData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Check if candidatesData is empty or null
  if (!candidatesData || candidatesData.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <BarChart width={300} height={300} data={candidatesData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="status" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Onboarded" name="Onboarded" fill="#8884d8" />
        <Bar dataKey="Rejected" name="Rejected" fill="#82ca9d" />
        <Bar dataKey="In Progress" name="In Progress" fill="#ffc658" />
      </BarChart>
    </div>
  );
};

export default ApplicationStatus;
