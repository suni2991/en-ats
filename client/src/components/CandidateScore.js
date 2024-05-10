import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CandidateScoresChart = () => {
  const [candidateScores, setCandidateScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/candidate-scores');
        setCandidateScores(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Candidate Scores</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <LineChart width={700} height={400} data={candidateScores}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fullName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="psychometric" stroke="#8884d8" name="Psychometric" />
          <Line type="monotone" dataKey="java" stroke="#82ca9d" name="Java" />
          <Line type="monotone" dataKey="vocabulary" stroke="#ffc658" name="Vocabulary" />
          <Line type="monotone" dataKey="quantitative" stroke="#ff7300" name="Quantitative" />
        </LineChart>
      )}
    </div>
  );
};

export default CandidateScoresChart;
