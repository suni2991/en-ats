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
} from "recharts";
import useAuth from "../hooks/useAuth";

const ApplicationStatus = () => {
  const [candidatesData, setCandidatesData] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/candidates-status", {
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
      <BarChart width={340} height={340} margin={{ top: 20, right: 0, left: 40, bottom: 0 }} data={candidatesData}>

        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="status" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Onboarded" name="Onboarded" fill="#00B4D2" />
        <Bar dataKey="Rejected" name="Rejected" fill="#969596" />
        <Bar dataKey="In Progress" name="In Progress" fill="#1a2763" />
      </BarChart>
    </div>
  );
};

export default ApplicationStatus;
