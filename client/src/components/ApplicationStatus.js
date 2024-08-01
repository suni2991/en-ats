import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useAuth from "../hooks/useAuth";

const ApplicationStatus = () => {
  const [candidatesData, setCandidatesData] = useState([]);
  const { token } = useAuth();
  const URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${URL}/candidates-status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCandidatesData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!candidatesData || candidatesData.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div>
    <center><h1>Applicant Status</h1></center><br/>
      <ResponsiveContainer width="95%" height={400}>
        <BarChart width={340} height={340} margin={{ top: 20, right: 20, left: 20, bottom: 20 }} data={candidatesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Onboarded" name="Onboarded" fill="#00B4D2" />
          <Bar dataKey="Rejected" name="Rejected" fill="#969596" />
          <Bar dataKey="In Progress" name="In Progress" fill="#1a2763" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ApplicationStatus;
